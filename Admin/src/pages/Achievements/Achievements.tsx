import React, { useEffect, useState, useRef, useCallback } from "react";
import {
    Card, CardBody, Col, Container, Form, FormGroup, Input,
    Label, Button, Row, Table, Badge
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const Achievements = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "active",
    });

    const resetForm = () => {
        setFormData({ title: "", description: "", status: "active" });
        setIsEditing(false);
        setSelectedId(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const fetchAchievements = useCallback(async () => {
        try {
            const response: any = await api.get("api/admin/achievements");
            
            /** * FIX: Laravel returns { success: true, data: [...] }
             * We must check for response.data
             */
            if (response && response.data) {
                setAchievements(response.data);
            } else if (Array.isArray(response)) {
                setAchievements(response);
            }
        } catch (error) {
            console.error("Fetch Error", error);
            setAchievements([]);
        }
    }, []);

    useEffect(() => {
        fetchAchievements();
    }, [fetchAchievements]);

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
                // Method spoofing for Laravel to handle PUT with FormData
                payload.append("_method", "PUT"); 
                await api.create(`api/admin/achievements/${selectedId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            } else {
                await api.create("api/admin/achievements", payload, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
            }
            alert("Success!");
            resetForm();
            fetchAchievements();
        } catch (error: any) {
            alert("Action Failed: Check file size or validation.");
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            await api.update(`api/admin/achievements/${item.id}`, { status: newStatus });
            fetchAchievements();
        } catch (error) {
            alert("Status update failed");
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
                    <Col xl={4}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title mb-4">{isEditing ? "Edit Achievement" : "Add Achievement"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input type="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Image</Label>
                                        <Input type="file" innerRef={fileRef} accept="image/*" />
                                    </FormGroup>
                                    <div className="hstack gap-2">
                                        <Button color="primary" type="submit" className="w-100" disabled={loading}>
                                            {loading ? "Saving..." : "Save Achievement"}
                                        </Button>
                                        {isEditing && <Button color="soft-secondary" type="button" className="w-100" onClick={resetForm}>Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl={8}>
                        <Card>
                            <CardBody>
                                <Table hover a lign="middle" className="table-nowrap">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Image</th>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {achievements.length > 0 ? achievements.map((item, idx) => (
                                            <tr key={item.id || idx}>
                                                <td>
                                                    <img 
                                                        src={item.image_url || "https://via.placeholder.com/50x40?text=No+Img"} 
                                                        alt="" 
                                                        className="rounded shadow-sm" 
                                                        style={{ width: "50px", height: "40px", objectFit: "cover" }} 
                                                    />
                                                </td>
                                                <td>
                                                    <div className="fw-medium">{item.title}</div>
                                                    <small className="text-muted d-block text-truncate" style={{maxWidth: '150px'}}>
                                                        {item.description}
                                                    </small>
                                                </td>
                                                <td>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <Badge color={item.status === 'active' ? 'success' : 'danger'}>{item.status}</Badge>
                                                        <Button size="sm" color={item.status === 'active' ? 'soft-danger' : 'soft-success'} onClick={() => handleStatusToggle(item)}>
                                                            {item.status === 'active' ? 'Deactivate' : 'Activate'}
                                                        </Button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Button color="soft-info" size="sm" className="me-2" onClick={() => handleEdit(item)}>Edit</Button>
                                                    <Button color="soft-danger" size="sm" onClick={async () => { 
                                                        if(window.confirm("Delete?")) { 
                                                            await api.delete(`api/admin/achievements/${item.id}`); 
                                                            fetchAchievements(); 
                                                        } 
                                                    }}>Delete</Button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={4} className="text-center py-4 text-muted">No records found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Achievements;