import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Table,
    Button,
    Spinner,
    Input,
    Badge,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// EXPORT PACKAGES
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const api = new APIClient();

/* ================= TYPES ================= */

interface Member {
    id: number;
    name: string;
    position: string;
    rank?: number | null;
    photo_url?: string | null;
}

/* ================= COMPONENT ================= */

const MemberList: React.FC = () => {
    const navigate = useNavigate();

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    /* ================= LOAD MEMBERS ================= */

    useEffect(() => {
        api
            .get("/api/admin/members")
            .then((res: any) => {
                let list: Member[] = [];
                if (Array.isArray(res)) list = res;
                else if (Array.isArray(res?.data)) list = res.data;
                else if (Array.isArray(res?.data?.data)) list = res.data.data;
                setMembers(list);
            })
            .catch(() => {
                toast.error("Failed to load members ❌");
                setMembers([]);
            })
            .finally(() => setLoading(false));
    }, []);

    /* ================= SEARCH ================= */

    const filteredMembers = useMemo(() => {
        if (!search) return members;
        return members.filter(
            (m) =>
                m.name.toLowerCase().includes(search.toLowerCase()) ||
                m.position.toLowerCase().includes(search.toLowerCase())
        );
    }, [members, search]);

    /* ================= EXPORT EXCEL ================= */

    const exportToExcel = () => {
        // Exports the currently filtered members
        const exportData = filteredMembers.map((m, index) => ({
            "No.": index + 1,
            "Rank": m.rank || "N/A",
            "Name": m.name,
            "Position": m.position,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, "Members_Directory.xlsx");
    };

    /* ================= EXPORT PDF ================= */

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "Rank", "Name", "Position"];
        const tableRows = filteredMembers.map((m, index) => [
            index + 1,
            m.rank || "N/A",
            m.name,
            m.position,
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.text("Members Directory Report", 14, 15);
        doc.save("Members_Directory.pdf");
    };

    /* ================= CHECKBOX ================= */

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredMembers.length && filteredMembers.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredMembers.map((m) => m.id));
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    /* ================= DELETE HANDLER ================= */

    const handleDelete = (id: number) => {
        const confirmToast = toast(
            ({ closeToast }) => (
                <div>
                    <p>Delete this member?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" color="secondary" onClick={closeToast}>Cancel</Button>
                        <Button size="sm" color="danger" onClick={async () => {
                            try {
                                const payload = new FormData();
                                payload.append("_method", "DELETE");
                                await api.create(`/api/admin/members/${id}`, payload);
                                setMembers(prev => prev.filter(m => m.id !== id));
                                setSelectedIds(prev => prev.filter(x => x !== id));
                                toast.dismiss(confirmToast);
                                toast.success("Deleted ✅");
                            } catch {
                                toast.error("Failed ❌");
                            }
                        }}>Delete</Button>
                    </div>
                </div>
            ), { autoClose: false }
        );
    };

    const handleBulkDelete = () => {
        const confirmToast = toast(
            ({ closeToast }) => (
                <div>
                    <p>Delete {selectedIds.length} members?</p>
                    <div className="d-flex justify-content-end gap-2">
                        <Button size="sm" color="secondary" onClick={closeToast}>Cancel</Button>
                        <Button size="sm" color="danger" onClick={async () => {
                            try {
                                setBulkDeleting(true);
                                await Promise.all(selectedIds.map(id => {
                                    const payload = new FormData();
                                    payload.append("_method", "DELETE");
                                    return api.create(`/api/admin/members/${id}`, payload);
                                }));
                                setMembers(prev => prev.filter(m => !selectedIds.includes(m.id)));
                                setSelectedIds([]);
                                toast.dismiss(confirmToast);
                                toast.success("Selected members deleted ✅");
                            } catch {
                                toast.error("Bulk delete failed ❌");
                            } finally {
                                setBulkDeleting(false);
                            }
                        }}>Delete All</Button>
                    </div>
                </div>
            ), { autoClose: false }
        );
    };

    /* ================= LOADING ================= */

    if (loading) {
        return (
            <div className="page-content">
                <div className="d-flex justify-content-center align-items-center mt-5">
                    <Spinner color="primary" />
                    <span className="ms-2">Loading members...</span>
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
                            <CardBody>
                                {/* HEADER & BUTTONS */}
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <h4 className="mb-0">Members Directory</h4>
                                        <Badge color="info" pill>Total: {filteredMembers.length}</Badge>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2">
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

                                        <Button color="primary" size="sm" onClick={() => navigate("/members/create")}>
                                            + Add Member
                                        </Button>

                                        <Input
                                            type="text"
                                            placeholder="Search members..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            style={{ width: 220 }}
                                        />
                                    </div>
                                </div>

                                {/* TABLE */}
                                <div className="table-responsive">
                                    <Table hover className="mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: 40 }}>
                                                    <Input
                                                        type="checkbox"
                                                        checked={filteredMembers.length > 0 && selectedIds.length === filteredMembers.length}
                                                        onChange={toggleSelectAll}
                                                    />
                                                </th>
                                                <th style={{ width: 80 }}>Rank</th>
                                                <th style={{ width: 100 }} className="text-center">Photo</th>
                                                <th>Name</th>
                                                <th>Position</th>
                                                <th style={{ width: 220 }} className="text-end">Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {filteredMembers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="text-center text-muted py-5">
                                                        No members found matching your search.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredMembers.map((m) => (
                                                    <tr key={m.id}>
                                                        <td>
                                                            <Input
                                                                type="checkbox"
                                                                checked={selectedIds.includes(m.id)}
                                                                onChange={() => toggleSelectOne(m.id)}
                                                            />
                                                        </td>
                                                        <td>{m.rank ?? "-"}</td>
                                                        <td className="text-center">
                                                            {m.photo_url ? (
                                                                <img
                                                                    src={m.photo_url}
                                                                    alt={m.name}
                                                                    className="rounded-circle shadow-sm"
                                                                    style={{ width: 40, height: 40, objectFit: "cover" }}
                                                                />
                                                            ) : (
                                                                <div className="bg-light rounded-circle text-muted d-flex align-items-center justify-content-center mx-auto" style={{ width: 40, height: 40, fontSize: '10px' }}>NO IMG</div>
                                                            )}
                                                        </td>
                                                        <td className="fw-bold text-dark">{m.name}</td>
                                                        <td>{m.position}</td>
                                                        <td className="text-end">
                                                            <Button size="sm" color="soft-info" className="me-1" onClick={() => navigate(`/members/view/${m.id}`)}>View</Button>
                                                            <Button size="sm" color="soft-success" className="me-1" onClick={() => navigate(`/members/edit/${m.id}`)}>Edit</Button>
                                                            <Button size="sm" color="soft-danger" onClick={() => handleDelete(m.id)}>Delete</Button>
                                                        </td>
                                                    </tr>
                                                ))
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

export default MemberList;