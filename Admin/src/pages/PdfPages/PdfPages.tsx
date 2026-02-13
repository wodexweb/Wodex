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

const PdfPages = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [pdfs, setPdfs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [selectedPdfs, setSelectedPdfs] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        link: "",
        pdf_for: "",
        status: "active",
    });

    /* ================= FETCH ================= */

    const fetchPdfs = useCallback(async () => {
        try {
            setFetchLoading(true);
            const response: any = await api.get("api/admin/pdf-pages");
            const data = response?.data ?? response;
            setPdfs(Array.isArray(data) ? data : []);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load PDFs ❌");
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPdfs();
    }, [fetchPdfs]);

    /* ================= SEARCH & FILTER ================= */

    const filteredPdfs = useMemo(() => {
        if (!searchTerm) return pdfs;
        return pdfs.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [pdfs, searchTerm]);

    /* ================= EXPORT LOGIC ================= */

    const exportToExcel = () => {
        const exportData = filteredPdfs.map((item, index) => ({
            "No.": index + 1,
            "Title": item.title,
            "Description": item.description || "N/A",
            "Status": item.status.toUpperCase(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Documents_List.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "Title", "Status"];
        const tableRows = filteredPdfs.map((item, index) => [
            index + 1,
            item.title,
            item.status.toUpperCase(),
        ]);

        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.text("Manage Documents Report", 14, 15);
        doc.save("Documents_Report.pdf");
    };

    /* ================= CHECKBOX LOGIC ================= */

    const handleSelectAll = (e: any) => {
        if (e.target.checked && filteredPdfs.length > 0) {
            setSelectedPdfs(filteredPdfs.map((item) => item.id));
        } else {
            setSelectedPdfs([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedPdfs((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    /* ================= FORM HANDLING ================= */

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            link: "",
            pdf_for: "",
            status: "active",
        });
        setIsEditing(false);
        setSelectedId(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) =>
            payload.append(key, value)
        );

        if (fileRef.current?.files?.[0]) {
            payload.append("file", fileRef.current.files[0]);
        }

        try {
            if (isEditing && selectedId) {
                payload.append("_method", "PUT");
                await api.create(`api/admin/pdf-pages/${selectedId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("PDF updated successfully ✅");
            } else {
                await api.create("api/admin/pdf-pages", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("PDF uploaded successfully ✅");
            }

            resetForm();
            fetchPdfs();
        } catch {
            toast.error("Save failed ❌");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setIsEditing(true);
        setSelectedId(item.id);
        setFormData({
            title: item.title,
            description: item.description || "",
            link: item.link || "",
            pdf_for: item.pdf_for || "",
            status: item.status,
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    /* ================= DELETE ACTIONS ================= */

    const handleDelete = (id: number) => {
        if (!window.confirm("Delete this PDF?")) return;
        api.delete(`api/admin/pdf-pages/${id}`)
            .then(() => {
                toast.success("Deleted 🗑️");
                fetchPdfs();
            })
            .catch(() => toast.error("Delete failed"));
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedPdfs.length} selected items?`)) return;
        try {
            await Promise.all(selectedPdfs.map(id => api.delete(`api/admin/pdf-pages/${id}`)));
            toast.success("Bulk delete successful ✅");
            setSelectedPdfs([]);
            fetchPdfs();
        } catch {
            toast.error("Some deletions failed");
        }
    };

    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await api.update(`api/admin/pdf-pages/${item.id}`, { status: newStatus });
            toast.success("Status updated ✅");
            fetchPdfs();
        } catch {
            toast.error("Failed to toggle status");
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    {/* LEFT SIDE: UPLOAD FORM */}
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <h4 className="mb-4">{isEditing ? "Edit Document" : "Upload New Document"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Enter PDF title" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input type="textarea" name="description" value={formData.description} onChange={handleChange} placeholder="Optional description" rows={3} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>PDF File</Label>
                                        <Input type="file" innerRef={fileRef} accept=".pdf" required={!isEditing} />
                                        {isEditing && <small className="text-muted">Leave empty to keep current file</small>}
                                    </FormGroup>
                                    <div className="d-flex gap-2 mt-4">
                                        <Button color="primary" type="submit" disabled={loading} className="w-100">
                                            {loading ? "Processing..." : isEditing ? "Update PDF" : "Upload PDF"}
                                        </Button>
                                        {isEditing && <Button color="secondary" onClick={resetForm}>Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* RIGHT SIDE: TABLE LIST */}
                    <Col xl={8}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h4 className="mb-0">Manage Documents</h4>
                                        <Badge color="info" pill>Total: {filteredPdfs.length}</Badge>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        {/* ✅ ADDED ICONS TO EXCEL/PDF BUTTONS */}
                                        <Button color="success" outline size="sm" onClick={exportToExcel}>
                                            <i className="ri-file-excel-2-line align-bottom me-1"></i> Excel
                                        </Button>
                                        <Button color="danger" outline size="sm" onClick={exportToPDF}>
                                            <i className="ri-file-pdf-line align-bottom me-1"></i> PDF
                                        </Button>
                                        
                                        {selectedPdfs.length > 0 && (
                                            <Button color="danger" size="sm" onClick={handleBulkDelete}>
                                                <i className="ri-delete-bin-line align-bottom me-1"></i> Delete ({selectedPdfs.length})
                                            </Button>
                                        )}
                                        
                                        <Input
                                            placeholder="Search title..."
                                            style={{ width: "200px" }}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <Table hover responsive className="align-middle custom-table">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "40px" }}>
                                                    <Input type="checkbox" onChange={handleSelectAll} checked={selectedPdfs.length === filteredPdfs.length && filteredPdfs.length > 0} />
                                                </th>
                                                <th>Document Details</th>
                                                <th>Status</th>
                                                <th className="text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchLoading ? (
                                                <tr><td colSpan={4} className="text-center py-5"><Spinner color="primary" /></td></tr>
                                            ) : filteredPdfs.length > 0 ? (
                                                filteredPdfs.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            <Input type="checkbox" checked={selectedPdfs.includes(item.id)} onChange={() => handleSelectItem(item.id)} />
                                                        </td>
                                                        <td>
                                                            <div className="d-flex flex-column">
                                                                <span className="fw-bold text-dark">{item.title}</span>
                                                                {item.file_url && (
                                                                    <a href={item.file_url} target="_blank" rel="noreferrer" className="text-primary small">
                                                                        View File 📄
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <Badge color={item.status === "active" ? "success" : "danger"} pill className="px-3">
                                                                {item.status.toUpperCase()}
                                                            </Badge>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                <Button size="sm" color="soft-info" onClick={() => handleStatusToggle(item)}>Toggle</Button>
                                                                <Button size="sm" color="soft-primary" onClick={() => handleEdit(item)}>Edit</Button>
                                                                <Button size="sm" color="soft-danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="text-center py-4">No documents found.</td>
                                                </tr>
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

export default PdfPages;