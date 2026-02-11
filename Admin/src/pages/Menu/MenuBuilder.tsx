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

/* ================= API ================= */
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
        <div
          {...attributes}
          {...listeners}
          className="me-3 opacity-75"
          style={{ cursor: "grab" }}
        >
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

          <Button
            size="sm"
            color="info"
            outline
            onClick={() => onEdit(item)}
          >
            Edit
          </Button>

          <Button
            size="sm"
            color="danger"
            outline
            onClick={() => onDelete(item.id)}
          >
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
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [form, setForm] = useState({
    title: "",
    url: "",
    parent_id: "",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchMenu();
  }, [location]);

  const fetchMenu = async () => {
    try {
      setLoading(true);

      const menusRes: any = await api.get("/api/admin/menus");
      const foundMenu = menusRes.data.find(
        (m: Menu) => m.location === location,
      );

      if (!foundMenu) {
        setMenu(null);
        setItems([]);
        return;
      }

      setMenu(foundMenu);

      const itemsRes: any = await api.get(
        `/api/admin/menus/by-location/${location}`,
      );

      setItems(itemsRes.data || []);
    } catch {
      toast.error("Failed to load menu ❌");
      setMenu(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      url: item.url,
      parent_id: item.parent_id ? String(item.parent_id) : "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!menu?.id) return;

    try {
      if (editingItem) {
        await api.patch(`/api/admin/menu-items/${editingItem.id}`, {
          title: form.title,
          url: form.url,
          parent_id: form.parent_id || null,
        });
        toast.success("Menu item updated successfully ✅");
      } else {
        await api.post("/api/admin/menu-items", {
          menu_id: menu.id,
          title: form.title,
          url: form.url,
          parent_id: form.parent_id || null,
        });
        toast.success("Menu item added successfully ✅");
      }

      setForm({ title: "", url: "", parent_id: "" });
      setEditingItem(null);

      setTimeout(() => {
        fetchMenu();
      }, 1000);

    } catch {
      toast.error("Failed to save menu item ❌");
    }
  };

  const deleteItem = (id: number) => {
    toast.warning(
      ({ closeToast }) => (
        <div>
          <p className="mb-2">Delete this menu item?</p>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                try {
                  await api.delete(`/api/admin/menu-items/${id}`);
                  toast.success("Menu item deleted successfully");
                  setTimeout(() => {
                    fetchMenu();
                  }, 1000);
                } catch {
                  toast.error("Delete failed ❌");
                }
                closeToast?.();
              }}
            >
              Yes, Delete
            </Button>
            <Button size="sm" color="secondary" onClick={closeToast}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { autoClose: false },
    );
  };

  const toggleItem = async (id: number) => {
    try {
      await api.patch(`/api/admin/menu-items/${id}/toggle`);
      toast.success("Menu item status updated");
      setTimeout(() => {
        fetchMenu();
      }, 1000);
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

    await api.post("/api/admin/menu-items/order", {
      items: newItems.map((item, index) => ({
        id: item.id,
        order: index + 1,
        parent_id: item.parent_id ?? null,
      })),
    });

    toast.success("Menu order updated");

    setTimeout(() => {
      fetchMenu();
    }, 1000);
  };

  const renderItems = (items: MenuItem[], level = 0) =>
    items.map((item) => (
      <div key={item.id} style={{ marginLeft: level * 20 }}>
        <SortableItem
          item={item}
          onDelete={deleteItem}
          onToggle={toggleItem}
          onEdit={handleEdit}
        />
        {item.children &&
          item.children.length > 0 &&
          renderItems(item.children, level + 1)}
      </div>
    ));

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  if (!menu) {
    return <p className="text-muted">Menu not found</p>;
  }

  return (
    <>
      <Row>
        <Col md={7}>
          <Card className="mb-4">
            <CardBody>
              <h5 className="mb-3">{menu.name}</h5>

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

        <Col md={5}>
          <Card>
            <CardBody>
              <h5>{editingItem ? "Edit Menu Item" : "Add Menu Item"}</h5>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Title</Label>
                  <Input name="title" value={form.title} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>URL</Label>
                  <Input name="url" value={form.url} onChange={handleChange} />
                </FormGroup>

                <FormGroup>
                  <Label>Parent Menu</Label>
                  <Input
                    type="select"
                    name="parent_id"
                    value={form.parent_id}
                    onChange={handleChange}
                  >
                    <option value="">Top Level</option>
                    {items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>

                <Button type="submit" color="primary" className="w-100">
                  {editingItem ? "Update Menu Item" : "Add Menu Item"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <ToastContainer />
    </>
  );
};

export default MenuBuilder;
