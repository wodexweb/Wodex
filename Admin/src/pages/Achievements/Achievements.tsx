import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Table,
  Badge,
  Spinner,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// EXPORT PACKAGES
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const api = new APIClient();

const Achievements = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Search and Selection
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "active",
  });

  /* ================= FETCH DATA ================= */
  const fetchAchievements = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response: any = await api.get("api/admin/achievements");
      const data = response?.data || response;
      setAchievements(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to load achievements ❌");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  /* ================= SEARCH & SELECTION ================= */
  const filteredData = useMemo(() => {
    if (!search) return achievements;
    return achievements.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [achievements, search]);

  const toggleSelectAll = (e: any) => {
    if (e.target.checked && filteredData.length > 0) {
      setSelectedIds(filteredData.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  /* ================= EXPORT LOGIC ================= */
  const exportToExcel = () => {
    const exportData = filteredData.map((item, index) => ({
      "No.": index + 1,
      "Title": item.title,
      "Description": item.description || "N/A",
      "Status": item.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Achievements");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Achievements_List.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["No.", "Title", "Status"];
    const tableRows = filteredData.map((item, index) => [
      index + 1,
      item.title,
      item.status.toUpperCase(),
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.text("Achievements Report", 14, 15);
    doc.save("Achievements_Report.pdf");
  };

  /* ================= FORM ACTIONS ================= */
  const resetForm = () => {
    setFormData({ title: "", description: "", status: "active" });
    setIsEditing(false);
    setSelectedId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("status", formData.status);

    if (fileRef.current?.files?.[0]) {
      payload.append("image", fileRef.current.files[0]);
    }

    try {
      if (isEditing && selectedId) {
        payload.append("_method", "PUT");
        await api.create(`api/admin/achievements/${selectedId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Updated successfully ✅");
      } else {
        await api.create("api/admin/achievements", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Created successfully ✅");
      }
      resetForm();
      fetchAchievements();
    } catch (error) {
      toast.error("Action Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await api.delete(`api/admin/achievements/${id}`);
        toast.success("Deleted 🗑️");
        fetchAchievements();
      } catch {
        toast.error("Delete failed");
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected items?`)) return;
    try {
        setBulkDeleting(true);
        await Promise.all(selectedIds.map(id => api.delete(`api/admin/achievements/${id}`)));
        toast.success("Bulk delete successful ✅");
        setSelectedIds([]);
        fetchAchievements();
    } catch {
        toast.error("Some deletions failed");
    } finally {
        setBulkDeleting(false);
    }
  };

  const handleStatusToggle = async (item: any) => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    try {
      await api.update(`api/admin/achievements/${item.id}`, { status: newStatus });
      fetchAchievements();
      toast.success("Status changed");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setSelectedId(item.id);
    setFormData({
      title: item.title,
      description: item.description || "",
      status: item.status,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* FORM SECTION */}
          <Col xl={4}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <h4 className="card-title mb-4">
                  {isEditing ? "Edit Achievement" : "Add New Achievement"}
                </h4>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      placeholder="Enter achievement title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description</Label>
                    <Input
                      type="textarea"
                      placeholder="Details..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Achievement Image</Label>
                    <Input type="file" innerRef={fileRef} accept="image/*" />
                  </FormGroup>
                  <div className="hstack gap-2 mt-4">
                    <Button color="primary" type="submit" className="w-100" disabled={loading}>
                      {loading ? "Processing..." : isEditing ? "Update Now" : "Save Achievement"}
                    </Button>
                    {isEditing && (
                      <Button color="light" type="button" className="w-100" onClick={resetForm}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* TABLE SECTION */}
          <Col xl={8}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <h4 className="mb-0">Achievements List</h4>
                    <Badge color="info" pill>Total: {filteredData.length}</Badge>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {/* ✅ ADDED ICONS TO EXCEL/PDF BUTTONS */}
                    <Button color="success" outline size="sm" onClick={exportToExcel}>
                        <i className="ri-file-excel-2-line align-bottom me-1"></i> Excel
                    </Button>
                    <Button color="danger" outline size="sm" onClick={exportToPDF}>
                        <i className="ri-file-pdf-line align-bottom me-1"></i> PDF
                    </Button>

                    {selectedIds.length > 0 && (
                        <Button color="danger" size="sm" disabled={bulkDeleting} onClick={handleBulkDelete}>
                             <i className="ri-delete-bin-line align-bottom me-1"></i> Delete ({selectedIds.length})
                        </Button>
                    )}

                    <Input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: "180px" }}
                    />
                  </div>
                </div>

                <div className="table-responsive">
                  <Table hover className="align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40px" }}>
                          <Input
                            type="checkbox"
                            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fetchLoading ? (
                        <tr><td colSpan={5} className="text-center py-5"><Spinner color="primary" /></td></tr>
                      ) : filteredData.length > 0 ? (
                        filteredData.map((item, idx) => (
                          <tr key={item.id}>
                            <td>
                              <Input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleSelectOne(item.id)}
                              />
                            </td>
                            <td>
                              <img
                                src={item.image_url}
                                alt="achieve"
                                className="rounded shadow-sm"
                                style={{ width: "50px", height: "40px", objectFit: "cover" }}
                              />
                            </td>
                            <td className="fw-medium text-primary">{item.title}</td>
                            <td>
                              <Badge color={item.status === "active" ? "success" : "danger"} className="me-2">
                                {item.status.toUpperCase()}
                              </Badge>
                              <Button
                                size="sm"
                                color="soft-info"
                                onClick={() => handleStatusToggle(item)}
                              >
                                Toggle
                              </Button>
                            </td>
                            <td className="text-end">
                                <div className="d-flex justify-content-end gap-2">
                                    <Button color="soft-primary" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button color="soft-danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                                </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td colSpan={5} className="text-center py-4">No records found.</td></tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Achievements;