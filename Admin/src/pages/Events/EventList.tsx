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

interface EventItem {
    id: number;
    title: string;
    end_date: string;
    status: "upcoming" | "recent" | "past";
    photo_url?: string | null;
}

/* ================= STATUS UI CONFIG ================= */

const statusUI = {
    upcoming: { label: "UPCOMING", className: "badge-soft-info" },
    recent: { label: "RECENT", className: "badge-soft-success" },
    past: { label: "PAST", className: "badge-soft-danger" },
};

/* ================= COMPONENT ================= */

const EventList = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState<EventItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    /* ================= FETCH ================= */

    const fetchEvents = async () => {
        try {
            const res: any = await api.get("/api/admin/events");

            const all = [
                ...(res.upcoming || []),
                ...(res.recent || []),
                ...(res.past || []),
            ].sort(
                (a: EventItem, b: EventItem) =>
                    new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
            );

            setEvents(all);
        } catch {
            toast.error("Failed to load events");
        } finally {
            setLoading(false);
        }
    };

    /* ================= SEARCH ================= */

    const filteredEvents = useMemo(() => {
        if (!search) return events;
        return events.filter((e) =>
            e.title.toLowerCase().includes(search.toLowerCase()),
        );
    }, [events, search]);

    /* ================= EXPORT EXCEL ================= */

    const exportToExcel = () => {
        const exportData = filteredEvents.map((e, index) => ({
            "No.": index + 1,
            "ID": e.id,
            "Title": e.title,
            "End Date": new Date(e.end_date).toLocaleDateString(),
            "Status": e.status.toUpperCase(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Events_Report.xlsx");
    };

    /* ================= EXPORT PDF ================= */

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "ID", "Title", "End Date", "Status"];
        const tableRows = filteredEvents.map((e, index) => [
            index + 1,
            e.id,
            e.title,
            new Date(e.end_date).toLocaleDateString(),
            e.status.toUpperCase(),
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.text("Events Management Report", 14, 15);
        doc.save("Events_Report.pdf");
    };

    /* ================= CHECKBOX ================= */

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEvents.length && filteredEvents.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEvents.map((e) => e.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    /* ================= SINGLE DELETE ================= */

    const handleDelete = (id: number) => {
        const confirmId = toast.warning(
            ({ closeToast }) => (
                <div>
                    <p className="mb-2">Delete this event permanently?</p>
                    <div className="d-flex gap-2">
                        <Button color="danger" size="sm" onClick={async () => {
                            try {
                                setDeletingId(id);
                                await api.delete(`/api/admin/events/${id}`);
                                setEvents(prev => prev.filter(e => e.id !== id));
                                setSelectedIds(prev => prev.filter(x => x !== id));
                                toast.dismiss(confirmId);
                                toast.success("Event removed");
                            } catch {
                                toast.error("Delete failed");
                            } finally {
                                setDeletingId(null);
                            }
                        }}>Delete</Button>
                        <Button color="secondary" size="sm" onClick={closeToast}>Cancel</Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    /* ================= BULK DELETE ================= */

    const handleBulkDelete = () => {
        const confirmId = toast.warning(
            ({ closeToast }) => (
                <div>
                    <p className="mb-2">Delete {selectedIds.length} selected events?</p>
                    <div className="d-flex gap-2">
                        <Button color="danger" size="sm" onClick={async () => {
                            try {
                                setBulkDeleting(true);
                                for (const id of selectedIds) {
                                    await api.delete(`/api/admin/events/${id}`);
                                }
                                setEvents(prev => prev.filter(e => !selectedIds.includes(e.id)));
                                setSelectedIds([]);
                                toast.dismiss(confirmId);
                                toast.success("Bulk delete successful");
                            } catch {
                                toast.error("Some deletions failed");
                            } finally {
                                setBulkDeleting(false);
                            }
                        }}>Delete All</Button>
                        <Button color="secondary" size="sm" onClick={closeToast}>Cancel</Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    if (loading) {
        return (
            <div className="page-content">
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <Spinner color="primary" />
                    <span className="ms-2">Loading events...</span>
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
                            <CardHeader className="bg-white border-0 py-3">
                                <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h5 className="mb-0 fw-bold">Events Directory</h5>
                                        <Badge color="info" pill>Total: {filteredEvents.length}</Badge>
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
                                            <Button color="danger" size="sm" disabled={bulkDeleting} onClick={handleBulkDelete}>
                                                {bulkDeleting ? "Deleting..." : `Delete (${selectedIds.length})`}
                                            </Button>
                                        )}

                                        <Link to="/events/create">
                                            <Button color="primary" size="sm">+ Add Event</Button>
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

                            <CardBody className="p-0">
                                <div className="table-responsive">
                                    <Table hover className="mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 40 }}>
                                                    <Input
                                                        type="checkbox"
                                                        checked={filteredEvents.length > 0 && selectedIds.length === filteredEvents.length}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th>ID</th>
                                                <th className="text-center">Image</th>
                                                <th>Title</th>
                                                <th>End Date</th>
                                                <th>Status</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredEvents.map((e) => (
                                                <tr key={e.id}>
                                                    <td>
                                                        <Input
                                                            type="checkbox"
                                                            checked={selectedIds.includes(e.id)}
                                                            onChange={() => toggleSelectOne(e.id)}
                                                        />
                                                    </td>
                                                    <td>#{e.id}</td>
                                                    <td className="text-center">
                                                        {e.photo_url ? (
                                                            <img src={e.photo_url} alt="" className="rounded shadow-sm" style={{ width: 40, height: 40, objectFit: "cover" }} />
                                                        ) : (
                                                            <div className="bg-light rounded d-flex align-items-center justify-content-center mx-auto" style={{ width: 40, height: 40 }}>
                                                                <i className="ri-image-line text-muted"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="fw-medium text-primary">{e.title}</td>
                                                    <td>{new Date(e.end_date).toLocaleDateString()}</td>
                                                    <td>
                                                        <span className={`badge ${statusUI[e.status].className} px-3 py-2`}>
                                                            {statusUI[e.status].label}
                                                        </span>
                                                    </td>
                                                    <td className="text-end">
                                                        <div className="d-flex justify-content-end gap-2">
                                                            <Button size="sm" color="soft-info" onClick={() => navigate(`/events/view/${e.id}`)}>View</Button>
                                                            <Button size="sm" color="soft-success" onClick={() => navigate(`/events/edit/${e.id}`)}>Edit</Button>
                                                            <Button size="sm" color="soft-danger" disabled={deletingId === e.id} onClick={() => handleDelete(e.id)}>
                                                                {deletingId === e.id ? "..." : "Remove"}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredEvents.length === 0 && (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-5 text-muted">No events found.</td>
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
            <ToastContainer />
        </div>
    );
};

export default EventList;