import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Spinner,
} from "reactstrap";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

/* ================= TYPES ================= */

interface MenuItem {
  id: number;
  title: string;
  url: string;
  order: number;
  parent_id?: number | null;
  is_active: boolean;
  children?: MenuItem[];
}

interface Menu {
  id: number;
  name: string;
  location: "header" | "footer";
}

interface Page {
  id: number;
  title: string;
  slug: string;
  status: string;
}

interface Props {
  location: "header" | "footer";
}

/* ================= SORTABLE ITEM ================= */

const SortableItem = ({
  item,
  onDelete,
  onToggle,
  onEdit,
}: {
  item: MenuItem;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  onEdit: (item: MenuItem) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: item.is_active ? 1 : 0.6,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="d-flex align-items-center justify-content-between border p-2 mb-2 rounded bg-body text-body">
        <div {...attributes} {...listeners} className="me-3 opacity-75" style={{ cursor: "grab" }}>
          ☰
        </div>

        <div className="flex-grow-1">
          <strong>{item.title}</strong>
          <div className="small opacity-75">{item.url}</div>
        </div>

        <div className="d-flex gap-2">
          <Button
            size="sm"
            color={item.is_active ? "success" : "secondary"}
            outline
            onClick={() => onToggle(item.id)}
          >
            {item.is_active ? "Enabled" : "Disabled"}
          </Button>

          <Button size="sm" color="info" outline onClick={() => onEdit(item)}>
            Edit
          </Button>

          <Button size="sm" color="danger" outline onClick={() => onDelete(item.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ================= COMPONENT ================= */

const MenuBuilder: React.FC<Props> = ({ location }) => {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [form, setForm] = useState({
    title: "",
    url: "",
    parent_id: "",
    link_type: "url" as "url" | "page",
    page_slug: "",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchMenu();
    fetchPages();
  }, [location]);

  /* ================= FETCH ================= */

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const menusRes: any = await api.get("/api/admin/menus");
      const menusData = menusRes.data || menusRes;
      const foundMenu = menusData.find((m: Menu) => m.location === location);

      if (!foundMenu) {
        setMenu(null);
        setItems([]);
        return;
      }

      setMenu(foundMenu);

      const itemsRes: any = await api.get(
        `/api/admin/menus/by-location/${location}`
      );

      setItems(itemsRes.data || itemsRes || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load menu ❌");
    } finally {
      setLoading(false);
    }
  };

  const fetchPages = async () => {
    try {
      const res: any = await api.get("/api/admin/pages");
      const rawData = res.data?.data || res.data || res || [];

      const published = rawData.filter(
        (p: Page) => p.status?.toLowerCase() === "published"
      );

      setPages(published);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pages ❌");
    }
  };

  /* ================= FORM ================= */

  const handleChange = (e: ChangeEvent<any>) => {
    const { name, value } = e.target;

    if (name === "link_type") {
      setForm((prev) => ({
        ...prev,
        link_type: value as "url" | "page",
        url: "",
        page_slug: "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePageSelect = (e: ChangeEvent<any>) => {
    const slug = e.target.value;

    setForm((prev) => ({
      ...prev,
      page_slug: slug,
      url: slug ? `/${slug}` : "",
    }));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);

    const matchedPage = pages.find((p) => `/${p.slug}` === item.url);

    setForm({
      title: item.title,
      url: item.url,
      parent_id: item.parent_id ? String(item.parent_id) : "",
      link_type: matchedPage ? "page" : "url",
      page_slug: matchedPage ? matchedPage.slug : "",
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setForm({
      title: "",
      url: "",
      parent_id: "",
      link_type: "url",
      page_slug: "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!menu?.id) return;

    try {
      const payload = {
        menu_id: menu.id,
        title: form.title,
        url: form.url,
        parent_id: form.parent_id || null,
      };

      if (editingItem) {
        await api.patch(
          `/api/admin/menu-items/${editingItem.id}`,
          payload
        );
        toast.success("Menu item updated successfully ✅");
      } else {
        await api.post("/api/admin/menu-items", payload);
        toast.success("Menu item added successfully ✅");
      }

      handleCancelEdit();
      await fetchMenu();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save menu item ❌");
    }
  };

  /* ================= ACTIONS ================= */

  const deleteItem = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this item?"))
      return;

    try {
      await api.delete(`/api/admin/menu-items/${id}`);
      toast.success("Deleted successfully ✅");
      fetchMenu();
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  const toggleItem = async (id: number) => {
    try {
      await api.patch(`/api/admin/menu-items/${id}/toggle`);
      toast.success("Status updated ✅");
      fetchMenu();
    } catch {
      toast.error("Failed to update status ❌");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const newItems = arrayMove(items, oldIndex, newIndex);
    setItems(newItems);

    try {
      await api.post("/api/admin/menu-items/order", {
        items: newItems.map((item, index) => ({
          id: item.id,
          order: index + 1,
        })),
      });

      toast.success("Menu order updated ✅");
    } catch {
      toast.error("Failed to update order ❌");
    }
  };

  const renderItems = (itemsToRender: MenuItem[], level = 0) =>
    itemsToRender.map((item) => (
      <div key={item.id} style={{ marginLeft: level * 20 }}>
        <SortableItem
          item={item}
          onDelete={deleteItem}
          onToggle={toggleItem}
          onEdit={handleEdit}
        />
        {item.children && renderItems(item.children, level + 1)}
      </div>
    ));

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );

  if (!menu)
    return (
      <p className="text-center text-muted">Menu not found</p>
    );

  return (
    <>
      <Row>
        <Col md={5}>
          <Card className="mb-4">
            <CardBody>
              <h5>
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h5>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Link Type</Label>
                  <Input
                    type="select"
                    name="link_type"
                    value={form.link_type}
                    onChange={handleChange}
                  >
                    <option value="url">Custom URL</option>
                    <option value="page">Page</option>
                  </Input>
                </FormGroup>

                {form.link_type === "url" ? (
                  <FormGroup>
                    <Label>URL</Label>
                    <Input
                      name="url"
                      value={form.url}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <Label>Select Page</Label>
                    <Input
                      type="select"
                      value={form.page_slug}
                      onChange={handlePageSelect}
                      required
                    >
                      <option value="">-- Select --</option>
                      {pages.map((page) => (
                        <option key={page.id} value={page.slug}>
                          {page.title} (/{page.slug})
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                )}

                <Button
                  type="submit"
                  color="primary"
                  className="w-100"
                >
                  {editingItem ? "Update" : "Add"} Item
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>

        <Col md={7}>
          <Card>
            <CardBody>
              <h5>{menu.name}</h5>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={items.map((i) => i.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {renderItems(items)}
                </SortableContext>
              </DndContext>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
};

export default MenuBuilder;