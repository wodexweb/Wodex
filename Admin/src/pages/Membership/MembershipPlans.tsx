import React, { useEffect, useState, useCallback, useMemo } from "react";
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

const MembershipPlans = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    // Search and Selection States
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration_months: "",
        benefits: "",
        status: "active",
    });

    /* ================= FETCH DATA ================= */

    const fetchPlans = useCallback(async () => {
        try {
            setFetchLoading(true);
            const response: any = await api.get("api/admin/membership-plans");
            const data = response?.data ?? response;
            setPlans(Array.isArray(data) ? data : []);
        } catch (error) { 
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch plans ❌");
        } finally {
            setFetchLoading(false);
        }
    }, []);

    useEffect(() => { fetchPlans(); }, [fetchPlans]);

    /* ================= SEARCH & FILTER ================= */

    const filteredPlans = useMemo(() => {
        if (!searchTerm) return plans;
        return plans.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [plans, searchTerm]);

    /* ================= EXPORT LOGIC ================= */

    const exportToExcel = () => {
        const exportData = filteredPlans.map((item, index) => ({
            "No.": index + 1,
            "Plan Name": item.name,
            "Price": item.price,
            "Duration (Months)": item.duration_months,
            "Status": item.status.toUpperCase(),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Plans");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Membership_Plans.xlsx");
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        const tableColumn = ["No.", "Plan Name", "Price", "Duration", "Status"];
        const tableRows = filteredPlans.map((item, index) => [
            index + 1,
            item.name,
            item.price,
            `${item.duration_months} Mo`,
            item.status.toUpperCase(),
        ]);

        autoTable(doc, { head: [tableColumn], body: tableRows });
        doc.text("Membership Plans Directory", 14, 15);
        doc.save("Membership_Plans.pdf");
    };

    /* ================= CHECKBOX LOGIC ================= */

    const toggleSelectAll = (e: any) => {
        if (e.target.checked && filteredPlans.length > 0) {
            setSelectedIds(filteredPlans.map((item) => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    const toggleSelectOne = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    /* ================= FORM ACTIONS ================= */

    const resetForm = () => {
        setFormData({ name: "", price: "", duration_months: "", benefits: "", status: "active" });
        setIsEditing(false);
        setSelectedId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing && selectedId) {
                await api.update(`api/admin/membership-plans/${selectedId}`, formData);
                toast.success("Plan Updated ✅");
            } else {
                await api.create("api/admin/membership-plans", formData);
                toast.success("Plan Created ✅");
            }
            resetForm();
            fetchPlans();
        } catch (error) { 
            toast.error("Action Failed ❌"); 
        } finally { 
            setLoading(false); 
        }
    };

    /* ================= DELETE ACTIONS ================= */

    const handleDelete = (id: number) => {
        const confirmToast = toast.warning(
            ({ closeToast }) => (
                <div>
                    <p className="mb-2">Delete this membership plan?</p>
                    <div className="d-flex gap-2">
                        <Button size="sm" color="danger" onClick={async () => {
                            try {
                                await api.delete(`api/admin/membership-plans/${id}`);
                                toast.success("Deleted 🗑️");
                                fetchPlans();
                                toast.dismiss(confirmToast);
                            } catch {
                                toast.error("Delete failed ❌");
                            }
                        }}>Delete</Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>Cancel</Button>
                    </div>
                </div>
            ), { autoClose: false }
        );
    };

    const handleBulkDelete = () => {
        const confirmToast = toast.error(
            ({ closeToast }) => (
                <div>
                    <p className="mb-2">Delete {selectedIds.length} selected plans?</p>
                    <div className="d-flex gap-2">
                        <Button size="sm" color="danger" onClick={async () => {
                            try {
                                setBulkDeleting(true);
                                await Promise.all(selectedIds.map(id => api.delete(`api/admin/membership-plans/${id}`)));
                                toast.success("Bulk delete successful ✅");
                                setSelectedIds([]);
                                fetchPlans();
                                toast.dismiss(confirmToast);
                            } catch {
                                toast.error("Bulk delete failed ❌");
                            } finally {
                                setBulkDeleting(false);
                            }
                        }}>Yes, Delete All</Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>Cancel</Button>
                    </div>
                </div>
            ), { autoClose: false }
        );
    };

    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await api.update(`api/admin/membership-plans/${item.id}`, { ...item, status: newStatus });
            toast.success("Status Updated ✅");
            fetchPlans();
        } catch {
            toast.error("Failed to update status ❌");
        }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    {/* LEFT FORM SECTION */}
                    <Col xl={4}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <h4 className="card-title mb-4">{isEditing ? "Edit Plan" : "New Membership Plan"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Plan Name</Label>
                                        <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required placeholder="e.g. Gold Member" />
                                    </FormGroup>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Price</Label>
                                                <Input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label>Duration (Months)</Label>
                                                <Input type="number" value={formData.duration_months} onChange={(e) => setFormData({...formData, duration_months: e.target.value})} required />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <FormGroup>
                                        <Label>Benefits</Label>
                                        <Input type="textarea" rows={4} value={formData.benefits} onChange={(e) => setFormData({...formData, benefits: e.target.value})} placeholder="Benefit 1&#10;Benefit 2" />
                                    </FormGroup>
                                    <div className="hstack gap-2 mt-4">
                                        <Button color="primary" type="submit" className="w-100" disabled={loading}>
                                            {loading ? "Saving..." : "Save Plan"}
                                        </Button>
                                        {isEditing && <Button color="light" className="w-100" onClick={resetForm}>Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* RIGHT TABLE SECTION */}
                    <Col xl={8}>
                        <Card className="border-0 shadow-sm">
                            <CardBody>
                                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <h4 className="mb-0">Plans Management</h4>
                                        <Badge color="info" pill>Total: {filteredPlans.length}</Badge>
                                    </div>
                                    <div className="d-flex flex-wrap gap-2">
                                        <Button color="success" outline size="sm" onClick={exportToExcel}>Excel</Button>
                                        <Button color="danger" outline size="sm" onClick={exportToPDF}>PDF</Button>
                                        {selectedIds.length > 0 && (
                                            <Button color="danger" size="sm" disabled={bulkDeleting} onClick={handleBulkDelete}>
                                                Delete ({selectedIds.length})
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
                                                    <Input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === filteredPlans.length && filteredPlans.length > 0} />
                                                </th>
                                                <th>Plan Details</th>
                                                <th>Price</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                                <th className="text-end">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchLoading ? (
                                                <tr><td colSpan={6} className="text-center py-5"><Spinner color="primary" /></td></tr>
                                            ) : filteredPlans.length > 0 ? (
                                                filteredPlans.map((plan) => (
                                                    <tr key={plan.id}>
                                                        <td>
                                                            <Input type="checkbox" checked={selectedIds.includes(plan.id)} onChange={() => toggleSelectOne(plan.id)} />
                                                        </td>
                                                        <td className="fw-medium text-primary">{plan.name}</td>
                                                        <td>{plan.price}</td>
                                                        <td>{plan.duration_months} Mo</td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Badge color={plan.status === 'active' ? 'success' : 'danger'}>
                                                                    {plan.status.toUpperCase()}
                                                                </Badge>
                                                                <Button size="sm" color="soft-warning" onClick={() => handleStatusToggle(plan)}>Toggle</Button>
                                                            </div>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <Button color="soft-info" size="sm" onClick={() => { setIsEditing(true); setSelectedId(plan.id); setFormData(plan); window.scrollTo(0,0); }}>Edit</Button>
                                                                <Button color="soft-danger" size="sm" onClick={() => handleDelete(plan.id)}>Delete</Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={6} className="text-center py-4">No plans found.</td></tr>
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

export default MembershipPlans;