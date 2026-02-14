import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    Card, CardBody, Col, Container, Form, FormGroup, Input,
    Label, Button, Row, Table, Badge, Spinner
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

const Notices = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [notices, setNotices] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
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
            setFetchLoading(true);
            const response: any = await api.get("api/admin/notices");
            const data = response?.data ?? response;

            if (Array.isArray(data)) {
                setNotices(data);
            } else {
                setNotices([]);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load notices ❌");
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => { fetchNotices(); }, [fetchNotices]);

    /* ================= SEARCH & FILTER ================= */

    const filteredNotices = useMemo(() => {
        if (!searchTerm) return notices;
        return notices.filter(item =>
            item.notice_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [notices, searchTerm]);

    /* ================= EXPORT LOGIC ================= */

    const exportToExcel = () => {
        const exportData = filteredNotices.map((item, index) => ({
            "No.": index + 1,
            "Title": item.notice_title,
            "Description": item.notice_description,
            "Date": item.publish_date,
            "Status": item.status.toUpperCase(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Notices");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Notices_Report.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "Title", "Date", "Status"];
        const tableRows = filteredNotices.map((item, index) => [
            index + 1,
            item.notice_title,
            item.publish_date,
            item.status.toUpperCase(),
        ]);

        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.text("Notices Management Report", 14, 15);
        doc.save("Notices_Report.pdf");
    };

    /* ================= CHECKBOX ================= */

    const handleSelectAll = (e: any) => {
        if (e.target.checked && filteredNotices.length > 0) {
            setSelectedNotices(filteredNotices.map((item) => item.id));
        } else {
            setSelectedNotices([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedNotices((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    /* ================= BULK DELETE ================= */

    const handleBulkDelete = () => {
        if (!selectedNotices.length) return;

        const confirmToast = toast.error(
            ({ closeToast }) => (
                <div>
                    <p>Delete {selectedNotices.length} selected notices?</p>
                    <div className="d-flex gap-2 mt-2">
                        <Button size="sm" color="danger" onClick={async () => {
                            try {
                                setBulkDeleting(true);
                                await Promise.all(selectedNotices.map(id => api.delete(`api/admin/notices/${id}`)));
                                toast.success("Selected notices deleted 🗑️");
                                setSelectedNotices([]);
                                fetchNotices();
                                toast.dismiss(confirmToast);
                            } catch {
                                toast.error("Bulk delete failed ❌");
                            } finally {
                                setBulkDeleting(false);
                            }
                        }}>Yes, Delete</Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>Cancel</Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const [bulkDeleting, setBulkDeleting] = useState(false);

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

    /* ================= ACTION HANDLERS ================= */

    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await api.update(`api/admin/notices/${item.id}`, { status: newStatus });
            toast.success("Status updated ✅");
            fetchNotices();
        } catch {
            toast.error("Status update failed ❌");
        }
    };

    const handleDelete = (id: number) => {
        if (!window.confirm("Are you sure you want to delete this notice?")) return;
        api.delete(`api/admin/notices/${id}`)
            .then(() => {
                toast.success("Notice deleted 🗑️");
                fetchNotices();
            })
            .catch(() => toast.error("Delete failed"));
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

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    {/* LEFT FORM */}
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <h4 className="mb-4">{isEditing ? "Edit Notice" : "New Notice"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input name="notice_title" value={formData.notice_title} onChange={handleChange} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input type="textarea" name="notice_description" value={formData.notice_description} onChange={handleChange} required rows={4} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Publish Date</Label>
                                        <Input type="date" name="publish_date" value={formData.publish_date} onChange={handleChange} required />
                                    </FormGroup>
                                    <div className="hstack gap-2 mt-4">
                                        <Button color="primary" type="submit" disabled={loading} className="w-100">
                                            {loading ? "Processing..." : "Save Notice"}
                                        </Button>
                                        {isEditing && <Button color="light" onClick={resetForm} className="w-100">Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* RIGHT TABLE */}
                    <Col xl={8}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h4 className="mb-0">Manage Notices</h4>
                                        <Badge color="info" pill>Total: {filteredNotices.length}</Badge>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {/* ✅ ADDED ICONS HERE */}
                                        <Button color="success" outline size="sm" onClick={exportToExcel}>
                                            <i className="ri-file-excel-2-line align-bottom me-1"></i> Excel
                                        </Button>
                                        <Button color="danger" outline size="sm" onClick={exportToPDF}>
                                            <i className="ri-file-pdf-line align-bottom me-1"></i> PDF
                                        </Button>
                                        
                                        {selectedNotices.length > 0 && (
                                            <Button color="danger" size="sm" disabled={bulkDeleting} onClick={handleBulkDelete}>
                                                <i className="ri-delete-bin-line align-bottom me-1"></i> Delete ({selectedNotices.length})
                                            </Button>
                                        )}
                                        <Input
                                            placeholder="Search title..."
                                            style={{ width: "180px" }}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <Table hover className="align-middle mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "40px" }}>
                                                    <Input type="checkbox" onChange={handleSelectAll} checked={selectedNotices.length === filteredNotices.length && filteredNotices.length > 0} />
                                                </th>
                                                <th>ID</th>
                                                <th>Notice Title</th>
                                                <th>Status</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchLoading ? (
                                                <tr><td colSpan={5} className="text-center py-5"><Spinner color="primary" /></td></tr>
                                            ) : filteredNotices.length > 0 ? (
                                                filteredNotices.map(item => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <Input type="checkbox" checked={selectedNotices.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
                                                        </td>
                                                        <td>#{item.id}</td>
                                                        <td className="fw-medium text-primary">{item.notice_title}</td>
                                                        <td>
                                                            <Badge color={item.status === "active" ? "success" : "danger"} className="px-3 py-2">
                                                                {item.status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Button size="sm" color="soft-info" onClick={() => handleEdit(item)}>Edit</Button>
                                                                <Button size="sm" color="soft-warning" onClick={() => handleStatusToggle(item)}>Toggle</Button>
                                                                <Button size="sm" color="soft-danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={5} className="text-center py-4 text-muted">No notices found.</td></tr>
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

export default Notices;