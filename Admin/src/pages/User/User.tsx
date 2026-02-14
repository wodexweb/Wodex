import React, { useEffect, useState, useCallback, useMemo } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
    Card,
    CardBody,
    Col,
    Container,
    Row,
    Table,
    Badge,
    Spinner,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// EXPORT PACKAGES
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const api = new APIClient();

/* ================= TYPES ================= */
interface Registration {
    id: number;
    name: string;
    surname: string;
    email: string;
    mobile: string;
    city: string;
    status?: "paid" | "pending";
}

const UserMembershipPurchases: React.FC = () => {
    const [data, setData] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Search and Selection States
    const [search, setSearch] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // View Modal State
    const [viewModal, setViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
    const [viewLoading, setViewLoading] = useState(false);

    const toggleViewModal = () => setViewModal(!viewModal);

    /* ================= FETCH LIST ================= */
    const fetchPurchases = useCallback(async () => {
        try {
            setLoading(true);
            const res: any = await api.get("/api/registration");
            const fetchedData = res?.data || res;
            setData(Array.isArray(fetchedData) ? fetchedData : []);
        } catch (error) {
            console.error("Fetch Error:", error);
            toast.error("Failed to load membership data ❌");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPurchases();
    }, [fetchPurchases]);

    /* ================= SEARCH & FILTER ================= */
    const filteredData = useMemo(() => {
        if (!search) return data;
        return data.filter(
            (item) =>
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                item.surname.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase()) ||
                item.city.toLowerCase().includes(search.toLowerCase())
        );
    }, [data, search]);

    /* ================= CHECKBOX LOGIC ================= */
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
            "Name": `${item.name} ${item.surname}`,
            "Email": item.email,
            "Mobile": item.mobile,
            "City": item.city,
            "Status": item.status === "paid" ? "Approved" : "Pending",
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Purchases");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Membership_Purchases.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "Name", "Mobile", "City", "Status"];
        const tableRows = filteredData.map((item, index) => [
            index + 1,
            `${item.name} ${item.surname}`,
            item.mobile,
            item.city,
            item.status === "paid" ? "Approved" : "Pending",
        ]);
        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.text("User Membership Purchases", 14, 15);
        doc.save("Membership_Purchases.pdf");
    };

    /* ================= ACTIONS ================= */
    const approveMembership = async (id: number) => {
        try {
            await api.put(`/api/registration/${id}/approve`);
            toast.success("Membership approved ✅");
            fetchPurchases();
        } catch {
            toast.error("Failed to approve ❌");
        }
    };

    const deleteMember = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            await api.delete(`/api/registration/${id}`);
            toast.success("Record deleted successfully 🗑️");
            fetchPurchases();
        } catch {
            toast.error("Failed to delete member ❌");
        }
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Delete ${selectedIds.length} selected records?`)) return;
        try {
            setBulkDeleting(true);
            await Promise.all(selectedIds.map(id => api.delete(`/api/registration/${id}`)));
            toast.success("Bulk delete successful ✅");
            setSelectedIds([]);
            fetchPurchases();
        } catch {
            toast.error("Bulk delete failed ❌");
        } finally {
            setBulkDeleting(false);
        }
    };

    const editMember = (id: number) => navigate(`/users/edit/${id}`);

    const viewMember = async (id: number) => {
        try {
            setViewLoading(true);
            const res: any = await api.get(`/api/registration/${id}`);
            setSelectedUser(res?.data || res);
            setViewModal(true);
        } catch {
            toast.error("Failed to fetch user details ❌");
        } finally {
            setViewLoading(false);
        }
    };

    /* ================= PAGINATION CALCULATIONS ================= */
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                {/* HEADER SECTION */}
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h4 className="mb-0">Membership Purchases</h4>
                                        <Badge color="info" pill>Total: {filteredData.length}</Badge>
                                    </div>

                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                        {/* ✅ ADDED ICONS TO EXPORT BUTTONS */}
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
                                            placeholder="Search users..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            style={{ width: "200px" }}
                                        />
                                    </div>
                                </div>

                                {loading ? (
                                    <div className="text-center py-5"><Spinner color="primary" /></div>
                                ) : (
                                    <>
                                        <div className="table-responsive">
                                            <Table hover className="table-nowrap align-middle mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th style={{ width: "40px" }}>
                                                            <Input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filteredData.length && filteredData.length > 0} />
                                                        </th>
                                                        <th>#</th>
                                                        <th>User</th>
                                                        <th>Contact</th>
                                                        <th>City</th>
                                                        <th>Status</th>
                                                        <th className="text-end">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentItems.length > 0 ? (
                                                        currentItems.map((item, index) => (
                                                            <tr key={item.id}>
                                                                <td>
                                                                    <Input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelectOne(item.id)} />
                                                                </td>
                                                                <td>{indexOfFirst + index + 1}</td>
                                                                <td><strong>{item.name} {item.surname}</strong></td>
                                                                <td>{item.mobile}</td>
                                                                <td>{item.city}</td>
                                                                <td>
                                                                    <Badge color={item.status === "paid" ? "success" : "warning"} pill className="text-uppercase px-3 py-2">
                                                                        {item.status === "paid" ? "APPROVED" : "PENDING"}
                                                                    </Badge>
                                                                </td>
                                                                <td className="text-end">
                                                                    <div className="d-flex justify-content-end gap-2">
                                                                        {item.status !== "paid" && (
                                                                            <Button color="soft-success" size="sm" onClick={() => approveMembership(item.id)}>Approve</Button>
                                                                        )}
                                                                        <Button color="soft-info" size="sm" onClick={() => viewMember(item.id)}>View</Button>
                                                                        <Button color="soft-primary" size="sm" onClick={() => editMember(item.id)}>Edit</Button>
                                                                        <Button color="soft-danger" size="sm" onClick={() => deleteMember(item.id)}>Delete</Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr><td colSpan={7} className="text-center py-4">No records found.</td></tr>
                                                    )}
                                                </tbody>
                                            </Table>
                                        </div>

                                        {/* PAGINATION CONTROLS */}
                                        {filteredData.length > itemsPerPage && (
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <Button color="light" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                                                    Previous
                                                </Button>
                                                <span className="text-muted">Page <strong>{currentPage}</strong> of {totalPages}</span>
                                                <Button color="light" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage((prev) => prev + 1)}>
                                                    Next
                                                </Button>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* VIEW MODAL remains the same */}
                                <Modal isOpen={viewModal} toggle={toggleViewModal} centered>
                                    <ModalHeader toggle={toggleViewModal}>User Details</ModalHeader>
                                    <ModalBody>
                                        {viewLoading ? (
                                            <div className="text-center"><Spinner /></div>
                                        ) : selectedUser ? (
                                            <Table bordered responsive className="mb-0">
                                                <tbody>
                                                    <tr><th style={{ width: "40%" }}>Full Name</th><td>{selectedUser.name} {selectedUser.surname}</td></tr>
                                                    <tr><th>Email</th><td>{selectedUser.email}</td></tr>
                                                    <tr><th>Mobile</th><td>{selectedUser.mobile}</td></tr>
                                                    <tr><th>City</th><td>{selectedUser.city}</td></tr>
                                                    <tr>
                                                        <th>Status</th>
                                                        <td>
                                                            <Badge color={selectedUser.status === "paid" ? "success" : "warning"} pill>
                                                                {selectedUser.status === "paid" ? "APPROVED" : "PENDING"}
                                                            </Badge>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        ) : (
                                            <p className="text-center">No user data found</p>
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={toggleViewModal}>Close</Button>
                                    </ModalFooter>
                                </Modal>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UserMembershipPurchases;