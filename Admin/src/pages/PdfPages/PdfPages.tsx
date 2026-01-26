import React, { useEffect, useState, useRef, useCallback } from "react";
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
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const PdfPages = () => {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [pdfs, setPdfs] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
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

    const fetchPdfs = useCallback(async () => {
        try {
            const response: any = await api.get("api/admin/pdf-pages");
            setPdfs(Array.isArray(response) ? response : []);
        } catch (error) {
            console.error("Fetch Error", error);
        }
    }, []);

    useEffect(() => {
        fetchPdfs();
    }, [fetchPdfs]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({ title: "", description: "", link: "", pdf_for: "", status: "active" });
        setIsEditing(false);
        setSelectedId(null);
        if (fileRef.current) fileRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => payload.append(key, value));

        if (fileRef.current?.files?.[0]) {
            payload.append("file", fileRef.current.files[0]);
        }

        try {
            if (isEditing && selectedId) {
                payload.append("_method", "PUT");
                await api.create(`api/admin/pdf-pages/${selectedId}`, payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.create("api/admin/pdf-pages", payload, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            alert(isEditing ? "PDF Updated Successfully!" : "PDF Uploaded Successfully!");
            resetForm();
            fetchPdfs();
        } catch (error) {
            console.error("Submit error:", error);
            alert("Save Failed. Please check console for details.");
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

    // --- ACTIVATE / DEACTIVATE LOGIC (FIXED) ---
    const handleStatusToggle = async (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";
        try {
            // Using update helper directly to avoid multipart boundary issues on simple JSON update
            await api.update(`api/admin/pdf-pages/${item.id}`, {
                status: newStatus
            });
            fetchPdfs();
        } catch (error: any) {
            console.error("Status Update Error:", error.response?.data || error.message);
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this PDF?")) {
            try {
                await api.delete(`api/admin/pdf-pages/${id}`);
                fetchPdfs();
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    const handleBulkDelete = async () => {
        if (window.confirm(`Delete ${selectedPdfs.length} selected PDFs?`)) {
            try {
                await Promise.all(selectedPdfs.map((id) => api.delete(`api/admin/pdf-pages/${id}`)));
                setSelectedPdfs([]);
                fetchPdfs();
            } catch (error) {
                alert("Bulk delete failed");
            }
        }
    };

    const filteredPdfs = pdfs.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col xl={4}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title mb-4">{isEditing ? "Edit PDF" : "Upload Document"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input name="title" value={formData.title} onChange={handleChange} required placeholder="Enter title" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Link (External/Google Drive)</Label>
                                        <Input name="link" value={formData.link} onChange={handleChange} placeholder="https://drive.google.com/..." />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input type="textarea" name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Enter description" />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>PDF For (Category)</Label>
                                        <Input type="select" name="pdf_for" value={formData.pdf_for} onChange={handleChange}>
                                            <option value="">Select PDF For</option>
                                            <option value="student">Student</option>
                                            <option value="staff">Staff</option>
                                            <option value="public">General Public</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>PDF File</Label>
                                        <Input type="file" innerRef={fileRef} accept=".pdf" />
                                    </FormGroup>
                                    <div className="hstack gap-2 mt-4">
                                        <Button color="primary" type="submit" className="w-100" disabled={loading}>
                                            {loading ? "Processing..." : isEditing ? "Update PDF" : "Upload PDF"}
                                        </Button>
                                        {isEditing && <Button color="soft-secondary" onClick={resetForm} className="w-100">Cancel</Button>}
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xl={8}>
                        <Card>
                            <CardBody>
                                <div className="d-flex mb-3 align-items-center">
                                    <h4 className="card-title flex-grow-1">Manage Documents</h4>
                                    {selectedPdfs.length > 0 && (
                                        <Button color="danger" className="btn-sm me-2" onClick={handleBulkDelete}>
                                            Delete Selected ({selectedPdfs.length})
                                        </Button>
                                    )}
                                    <Input type="text" placeholder="Search title..." style={{ width: "200px" }} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <div className="table-responsive">
                                    <Table hover a lign="middle" className="table-nowrap">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: "40px" }}>
                                                    <Input 
                                                        type="checkbox" 
                                                        onChange={(e) => e.target.checked ? setSelectedPdfs(pdfs.map((p) => p.id)) : setSelectedPdfs([])} 
                                                        checked={selectedPdfs.length === pdfs.length && pdfs.length > 0} 
                                                    />
                                                </th>
                                                <th>Title & Category</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPdfs.length > 0 ? (
                                                filteredPdfs.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>
                                                            <Input 
                                                                type="checkbox" 
                                                                checked={selectedPdfs.includes(item.id)} 
                                                                onChange={() => setSelectedPdfs((prev) => prev.includes(item.id) ? prev.filter((i) => i !== item.id) : [...prev, item.id])} 
                                                            />
                                                        </td>
                                                        <td>
                                                            <div className="fw-medium">{item.title}</div>
                                                            <small className="text-primary text-uppercase">{item.pdf_for || "General"}</small>
                                                        </td>
                                                        <td>
                                                            <div className="d-flex align-items-center gap-2">
                                                                <Badge color={item.status === 'active' ? 'success' : 'danger'}>
                                                                    {item.status}
                                                                </Badge>
                                                                <Button
                                                                    size="sm"
                                                                    color={item.status === 'active' ? 'soft-danger' : 'soft-success'}
                                                                    onClick={() => handleStatusToggle(item)}
                                                                >
                                                                    {item.status === 'active' ? 'Deactivate' : 'Activate'}
                                                                </Button>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <UncontrolledDropdown>
                                                                <DropdownToggle tag="button" className="btn btn-soft-secondary btn-sm"><i className="ri-more-fill"></i></DropdownToggle>
                                                                <DropdownMenu end>
                                                                    <DropdownItem onClick={() => handleEdit(item)}>Edit</DropdownItem>
                                                                    {item.file_path && (
                                                                        <DropdownItem href={`${process.env.REACT_APP_API_URL}/storage/${item.file_path}`} target="_blank">View File</DropdownItem>
                                                                    )}
                                                                    {item.link && (
                                                                        <DropdownItem href={item.link} target="_blank">External Link</DropdownItem>
                                                                    )}
                                                                    <DropdownItem divider />
                                                                    <DropdownItem className="text-danger" onClick={() => handleDelete(item.id)}>Delete</DropdownItem>
                                                                </DropdownMenu>
                                                            </UncontrolledDropdown>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan={4} className="text-center py-4 text-muted">No documents found.</td></tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default PdfPages;