import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Card,
    CardBody,
    CardHeader,
    Table,
    Button,
    Spinner,
    Container,
    Row,
    Col,
    Input,
    Badge,
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

/* ================= TYPES ================= */

interface PageItem {
    id: number;
    title: string;
    slug: string;
    status: "published" | "draft";
    created_at: string;
}

/* ================= STATUS UI ================= */

const statusUI = {
    published: { label: "PUBLISHED", className: "badge-soft-success" },
    draft: { label: "DRAFT", className: "badge-soft-warning" },
};

/* ================= COMPONENT ================= */

const ManagePages = () => {
    const navigate = useNavigate();
    const [pages, setPages] = useState<PageItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    useEffect(() => {
        fetchPages();
    }, []);

    /* ================= FETCH ================= */

    const fetchPages = async () => {
        try {
            const res: any = await api.get("/api/admin/pages");
            setPages(res || []);
        } catch {
            toast.error("Failed to load pages");
        } finally {
            setLoading(false);
        }
    };

    /* ================= SEARCH ================= */

    const filteredPages = useMemo(() => {
        if (!search) return pages;
        return pages.filter((p) =>
            p.title.toLowerCase().includes(search.toLowerCase()),
        );
    }, [pages, search]);

    /* ================= EXPORT LOGIC ================= */

    const exportToExcel = () => {
        const exportData = filteredPages.map((p, index) => ({
            "No.": index + 1,
            "ID": p.id,
            "Title": p.title,
            "Slug": p.slug,
            "Status": p.status.toUpperCase(),
            "Created Date": new Date(p.created_at).toLocaleDateString(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Pages");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Manage_Pages_List.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "ID", "Title", "Slug", "Status"];
        const tableRows = filteredPages.map((p, index) => [
            index + 1,
            p.id,
            p.title,
            p.slug,
            p.status.toUpperCase(),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.text("Manage Pages Report", 14, 15);
        doc.save("Manage_Pages_Report.pdf");
    };

    /* ================= CHECKBOX ================= */

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredPages.length && filteredPages.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredPages.map((p) => p.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    /* ================= SINGLE DELETE ================= */

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this page?")) return;

        try {
            setDeletingId(id);
            await api.delete(`/api/admin/pages/${id}`);
            setPages((prev) => prev.filter((p) => p.id !== id));
            setSelectedIds((prev) => prev.filter((x) => x !== id));
            toast.success("Page deleted successfully ✅");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Delete failed ❌");
        } finally {
            setDeletingId(null);
        }
    };

    /* ================= BULK DELETE ================= */

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} selected pages permanently?`)) return;

        try {
            setBulkDeleting(true);
            await Promise.all(selectedIds.map((id) => api.delete(`/api/admin/pages/${id}`)));
            setPages((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
            setSelectedIds([]);
            toast.success("Selected pages deleted successfully ✅");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Bulk delete failed ❌");
        } finally {
            setBulkDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <Spinner color="primary" />
                    <span className="ms-2 text-muted">Loading pages...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col xl={12}>
                        <Card className="border-0 shadow-sm">
                            {/* ================= HEADER ================= */}
                            <CardHeader className="bg-white border-0 py-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="mb-0 fw-bold">Static Pages</h5>
                                        <Badge color="info" pill>Total: {filteredPages.length}</Badge>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        {/* EXPORT BUTTONS */}
                                        <Button color="success" outline size="sm" onClick={exportToExcel}>
                                            <i className="ri-file-excel-2-line align-bottom me-1"></i> Excel
                                        </Button>
                                        <Button color="danger" outline size="sm" onClick={exportToPDF}>
                                            <i className="ri-file-pdf-line align-bottom me-1"></i> PDF
                                        </Button>

                                        {selectedIds.length > 0 && (
                                            <Button
                                                color="danger"
                                                size="sm"
                                                disabled={bulkDeleting}
                                                onClick={handleBulkDelete}
                                            >
                                                {bulkDeleting ? "Deleting..." : `Delete (${selectedIds.length})`}
                                            </Button>
                                        )}

                                        <Link to="/pages/add">
                                            <Button color="primary" size="sm">+ Add Page</Button>
                                        </Link>

                                        <Input
                                            type="text"
                                            placeholder="Search title..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            style={{ width: 180 }}
                                        />
                                    </div>
                                </div>
                            </CardHeader>

                            {/* ================= TABLE ================= */}
                            <CardBody className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 40 }}>
                                                    <Input
                                                        type="checkbox"
                                                        checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Slug</th>
                                                <th>Status</th>
                                                <th>Created</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredPages.map((p) => (
                                                <tr key={p.id}>
                                                    <td>
                                                        <Input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(p.id)}
                                                            onChange={() => toggleSelectOne(p.id)}
                                                        />
                                                    </td>
                                                    <td>#{p.id}</td>
                                                    <td className="fw-medium text-primary">{p.title}</td>
                                                    <td><code>/{p.slug}</code></td>
                                                    <td>
                                                        <span className={`badge ${statusUI[p.status].className} px-3 py-2`}>
                                                            {statusUI[p.status].label}
                                                        </span>
                                                    </td>
                                                    <td>{new Date(p.created_at).toLocaleDateString()}</td>
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button size="sm" color="soft-info" onClick={() => navigate(`/pages/view/${p.id}`)}>View</Button>
                                                            <Button size="sm" color="soft-success" onClick={() => navigate(`/pages/edit/${p.id}`)}>Edit</Button>
                                                            <Button
                                                                size="sm"
                                                                color="soft-danger"
                                                                disabled={deletingId === p.id}
                                                                onClick={() => handleDelete(p.id)}
                                                            >
                                                                {deletingId === p.id ? "..." : "Remove"}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredPages.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-5 text-muted">No pages found.</td>
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

export default ManagePages;