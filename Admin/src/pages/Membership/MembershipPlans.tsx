import React, { useEffect, useState, useCallback } from "react";
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Button, Row, Table, Badge } from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

const MembershipPlans = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration_months: "",
        benefits: "",
        status: "active",
    });

    const resetForm = () => {
        setFormData({ name: "", price: "", duration_months: "", benefits: "", status: "active" });
        setIsEditing(false);
        setSelectedId(null);
    };

    const fetchPlans = useCallback(async () => {
        try {
            const response: any = await api.get("api/admin/membership-plans");
            setPlans(Array.isArray(response) ? response : []);
        } catch (error) { 
            console.error("Fetch Error:", error);
            toast.error("Failed to fetch plans ❌");
        }
    }, []);

    useEffect(() => { fetchPlans(); }, [fetchPlans]);

    // --- Status Toggle Logic ---
    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await api.update(`api/admin/membership-plans/${item.id}`, { 
                ...item,
                status: newStatus 
            });
            toast.success(`Plan ${newStatus === "active" ? "Activated" : "Deactivated"} ✅`);
            fetchPlans();
        } catch (error) {
            toast.error("Failed to update status ❌");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isEditing) {
                await api.update(`api/admin/membership-plans/${selectedId}`, formData);
                toast.success("Plan Updated Successfully ✅");
            } else {
                await api.create("api/admin/membership-plans", formData);
                toast.success("Plan Created Successfully ✅");
            }
            resetForm();
            fetchPlans();
        } catch (error) { 
            toast.error("Save Failed ❌"); 
        }
        finally { setLoading(false); }
    };

    // --- NEW: Toast Delete Confirmation ---
    const handleDelete = (id: number) => {
        toast.info(
            <div>
                <p>Are you sure you want to delete this plan?</p>
                <div className="d-flex gap-2">
                    <Button
                        size="sm"
                        color="danger"
                        onClick={async () => {
                            try {
                                await api.delete(`api/admin/membership-plans/${id}`);
                                toast.dismiss();
                                toast.success("Plan Deleted Successfully 🗑️");
                                fetchPlans();
                            } catch (error) {
                                toast.error("Delete Failed ❌");
                            }
                        }}
                    >
                        Yes Delete
                    </Button>
                    <Button
                        size="sm"
                        color="secondary"
                        onClick={() => toast.dismiss()}
                    >
                        Cancel
                    </Button>
                </div>
            </div>,
            { autoClose: false }
        );
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col xl={4}>
                        <Card>
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
                                    <div className="hstack gap-2 mt-3">
                                        <Button color="primary" type="submit" className="w-100" disabled={loading}>
                                            {loading ? "Saving..." : "Save Plan"}
                                        </Button>
                                        {isEditing && <Button color="soft-secondary" className="w-100" onClick={resetForm}>Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xl={8}>
                        <Card>
                            <CardBody>
                                {/* FIXED TYPO HERE */}
                                <Table hover a lign="middle" className="table-nowrap">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Plan Name</th>
                                            <th>Price</th>
                                            <th>Duration</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {plans.map((plan, idx) => (
                                            <tr key={idx}>
                                                <td className="fw-medium">{plan.name}</td>
                                                <td>{plan.price}</td>
                                                <td>{plan.duration_months} Mo</td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Badge color={plan.status === 'active' ? 'success' : 'danger'}>
                                                            {plan.status}
                                                        </Badge>
                                                        <Button 
                                                            size="sm" 
                                                            color={plan.status === 'active' ? 'soft-danger' : 'soft-success'}
                                                            onClick={() => handleStatusToggle(plan)}
                                                        >
                                                            {plan.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Button color="soft-info" size="sm" className="me-2" onClick={() => { setIsEditing(true); setSelectedId(plan.id); setFormData(plan); }}>
                                                        Edit
                                                    </Button>

                                                    {/* UPDATED DELETE BUTTON */}
                                                    <Button color="soft-danger" size="sm" onClick={() => handleDelete(plan.id)}>
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

export default MembershipPlans;