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
}: {
  item: MenuItem;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="d-flex align-items-center justify-content-between border p-2 mb-2 rounded bg-white">
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: "grab" }}
          className="me-3 text-muted"
        >
          ☰
        </div>

        <div className="flex-grow-1">
          <strong>{item.title}</strong>
          <div className="text-muted small">{item.url}</div>
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

  const [form, setForm] = useState({
    title: "",
    url: "",
    parent_id: "",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  /* ================= FETCH MENU ================= */

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchMenu = async () => {
    try {
      setLoading(true);

      // 1️⃣ Load menus to get menu_id
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

      // 2️⃣ Load menu items by location
      const itemsRes: any = await api.get(
        `/api/admin/menus/by-location/${location}`,
      );

      setItems(itemsRes.data || []);
    } catch (err) {
      console.error("FETCH MENU ERROR:", err);
      setMenu(null);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM ================= */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!menu?.id) {
      alert("Menu not loaded");
      return;
    }

    if (!form.title || !form.url) return;

    try {
      await api.post("/api/admin/menu-items", {
        menu_id: menu.id,
        title: form.title,
        url: form.url,
        parent_id: form.parent_id || null,
      });

      setForm({ title: "", url: "", parent_id: "" });
      fetchMenu();
    } catch (err) {
      alert(err);
    }
  };

  /* ================= ACTIONS ================= */

  const deleteItem = async (id: number) => {
    if (!window.confirm("Delete this menu item?")) return;
    await api.delete(`/api/admin/menu-items/${id}`);
    fetchMenu();
  };

  const toggleItem = async (id: number) => {
    await api.put(`/api/admin/menu-items/${id}/toggle`);
    fetchMenu();
  };

  /* ================= DRAG END ================= */

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
  };

  /* ================= RENDER ================= */

  const renderItems = (items: MenuItem[], level = 0) =>
    items.map((item) => (
      <div key={item.id} style={{ marginLeft: level * 20 }}>
        <SortableItem item={item} onDelete={deleteItem} onToggle={toggleItem} />
        {item.children &&
          item.children.length > 0 &&
          renderItems(item.children, level + 1)}
      </div>
    ));

  /* ================= UI ================= */

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
    <Row>
      {/* LEFT – MENU LIST */}
      <Col md={7}>
        <Card className="mb-4">
          <CardBody>
            <h5 className="mb-3">{menu.name}</h5>

            {items.length === 0 && (
              <p className="text-muted">
                No menu items yet. Add one from the right →
              </p>
            )}

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

      {/* RIGHT – ADD FORM */}
      <Col md={5}>
        <Card>
          <CardBody>
            <h5 className="mb-3">Add Menu Item</h5>

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
                <Label>URL</Label>
                <Input
                  name="url"
                  value={form.url}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Parent Menu (optional)</Label>
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

              <Button color="primary" type="submit" className="w-100">
                Add Menu Item
              </Button>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default MenuBuilder;
