import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Card, CardBody, Col, Container, Form, FormGroup, Input,
  Label, Button, Row, Table, Badge, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

const Notices = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    notice_title: "",
    notice_description: "",
    publish_date: "",
    visibility: "public",
    status: "active",
  });

  /* ================= FETCH ================= */

  const fetchNotices = useCallback(async () => {
    try {
      const response: any = await api.get("api/admin/notices");
      const data = response?.data ?? response;

      if (Array.isArray(data)) {
        setNotices(data);
      } else {
        setNotices([]);
        toast.error("Invalid response format ❌");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load notices ❌");
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  /* ================= CHECKBOX ================= */

  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      setSelectedNotices(notices.map((item) => item.id));
    } else {
      setSelectedNotices([]);
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedNotices.includes(id)) {
      setSelectedNotices(selectedNotices.filter((item) => item !== id));
    } else {
      setSelectedNotices([...selectedNotices, id]);
    }
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = () => {
    if (!selectedNotices.length) return;

    toast.error(
      ({ closeToast }) => (
        <div>
          <p>Delete {selectedNotices.length} selected notices?</p>
          <div className="d-flex gap-2 mt-2">
            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                try {
                  await Promise.all(
                    selectedNotices.map(id =>
                      api.delete(`api/admin/notices/${id}`)
                    )
                  );
                  toast.success("Selected notices deleted 🗑️");
                  setSelectedNotices([]);
                  fetchNotices();
                } catch {
                  toast.error("Bulk delete failed ❌");
                }
                closeToast();
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
      { autoClose: false }
    );
  };

  /* ================= FORM ================= */

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      notice_title: "",
      notice_description: "",
      publish_date: "",
      visibility: "public",
      status: "active",
    });
    setIsEditing(false);
    setSelectedId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      if (fileRef.current?.files?.[0]) {
        payload.append("attachment", fileRef.current.files[0]);
      }

      if (isEditing && selectedId) {
        payload.append("_method", "PUT");
        await api.create(`api/admin/notices/${selectedId}`, payload);
        toast.success("Notice updated successfully ✅");
      } else {
        await api.create("api/admin/notices", payload);
        toast.success("Notice created successfully ✅");
      }

      resetForm();
      fetchNotices();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS TOGGLE ================= */

  const handleStatusToggle = (item: any) => {
    const newStatus = item.status === "active" ? "inactive" : "active";

    toast.info(
      ({ closeToast }) => (
        <div>
          <p>
            {item.status === "active"
              ? "Inactivate this notice?"
              : "Activate this notice?"}
          </p>
          <div className="d-flex gap-2 mt-2">
            <Button
              size="sm"
              color="primary"
              onClick={async () => {
                try {
                  await api.update(`api/admin/notices/${item.id}`, {
                    status: newStatus,
                  });
                  toast.success("Status updated ✅");
                  fetchNotices();
                } catch {
                  toast.error("Status update failed ❌");
                }
                closeToast();
              }}
            >
              Yes
            </Button>
            <Button size="sm" color="secondary" onClick={closeToast}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  /* ================= DELETE ================= */

  const handleDelete = (id: number) => {
    toast.error(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this notice?</p>
          <div className="d-flex gap-2 mt-2">
            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                try {
                  await api.delete(`api/admin/notices/${id}`);
                  toast.success("Notice deleted successfully 🗑️");
                  fetchNotices();
                } catch {
                  toast.error("Delete failed ❌");
                }
                closeToast();
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
      { autoClose: false }
    );
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setSelectedId(item.id);
    setFormData({
      notice_title: item.notice_title,
      notice_description: item.notice_description,
      publish_date: item.publish_date,
      visibility: item.visibility,
      status: item.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredNotices = notices.filter(item =>
    item.notice_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* LEFT FORM */}
          <Col xl={4}>
            <Card>
              <CardBody>
                <h4>{isEditing ? "Edit Notice" : "New Notice"}</h4>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      name="notice_title"
                      value={formData.notice_title}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      name="notice_description"
                      value={formData.notice_description}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      name="publish_date"
                      value={formData.publish_date}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>

                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Notice"}
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* RIGHT TABLE */}
          <Col xl={8}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-3">
                  <h4>Manage Notices</h4>
                  {selectedNotices.length > 0 && (
                    <Button color="danger" onClick={handleBulkDelete}>
                      Delete ({selectedNotices.length})
                    </Button>
                  )}
                </div>

                <Table hover responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.map(item => (
                      <tr key={item.id}>
                        <td>
                          <Input
                            type="checkbox"
                            checked={selectedNotices.includes(item.id)}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </td>
                        <td>{item.id}</td>
                        <td>{item.notice_title}</td>
                        <td>
                          <Badge color={item.status === "active" ? "success" : "danger"}>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="d-flex gap-2">
                          <Button size="sm" color="info" onClick={() => handleEdit(item)}>
                            Edit
                          </Button>
                          <Button size="sm" color="warning" onClick={() => handleStatusToggle(item)}>
                            Toggle
                          </Button>
                          <Button size="sm" color="danger" onClick={() => handleDelete(item.id)}>
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Notices;