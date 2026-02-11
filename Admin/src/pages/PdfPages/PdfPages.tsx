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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    /* ================= FETCH ================= */

    const fetchPdfs = useCallback(async () => {
        try {
            const response: any = await api.get("api/admin/pdf-pages");
            const data = response?.data ?? response;
            setPdfs(Array.isArray(data) ? data : []);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load PDFs ❌");
        }
    }, []);

    useEffect(() => {
        fetchPdfs();
    }, [fetchPdfs]);

    /* ================= FORM ================= */

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

    /* ================= STATUS TOGGLE ================= */

    const handleStatusToggle = (item: any) => {
        const newStatus = item.status === "active" ? "inactive" : "active";

        toast.info(
            ({ closeToast }) => (
                <div>
                    <p>
                        {item.status === "active"
                            ? "Deactivate this PDF?"
                            : "Activate this PDF?"}
                    </p>
                    <div className="d-flex gap-2 mt-2">
                        <Button
                            size="sm"
                            color="primary"
                            onClick={async () => {
                                try {
                                    await api.update(`api/admin/pdf-pages/${item.id}`, {
                                        status: newStatus,
                                    });
                                    toast.success("Status updated ✅");
                                    fetchPdfs();
                                } catch {
                                    toast.error("Status update failed ❌");
                                }
                                closeToast();
                            }}
                        >
                            Yes
                        </Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    /* ================= DELETE ================= */

    const handleDelete = (id: number) => {
        toast.error(
            ({ closeToast }) => (
                <div>
                    <p>Are you sure you want to delete this PDF?</p>
                    <div className="d-flex gap-2 mt-2">
                        <Button
                            size="sm"
                            color="danger"
                            onClick={async () => {
                                try {
                                    await api.delete(`api/admin/pdf-pages/${id}`);
                                    toast.success("PDF deleted successfully 🗑️");
                                    fetchPdfs();
                                } catch {
                                    toast.error("Delete failed ❌");
                                }
                                closeToast();
                            }}
                        >
                            Yes, Delete
                        </Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    /* ================= BULK DELETE ================= */

    const handleBulkDelete = () => {
        if (!selectedPdfs.length) return;

        toast.error(
            ({ closeToast }) => (
                <div>
                    <p>Delete {selectedPdfs.length} selected PDFs?</p>
                    <div className="d-flex gap-2 mt-2">
                        <Button
                            size="sm"
                            color="danger"
                            onClick={async () => {
                                try {
                                    await Promise.all(
                                        selectedPdfs.map((id) =>
                                            api.delete(`api/admin/pdf-pages/${id}`)
                                        )
                                    );
                                    toast.success("Selected PDFs deleted 🗑️");
                                    setSelectedPdfs([]);
                                    fetchPdfs();
                                } catch {
                                    toast.error("Bulk delete failed ❌");
                                }
                                closeToast();
                            }}
                        >
                            Yes, Delete All
                        </Button>
                        <Button size="sm" color="secondary" onClick={closeToast}>
                            Cancel
                        </Button>
                    </div>
                </div>
            ),
            { autoClose: false }
        );
    };

    const filteredPdfs = pdfs.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col xl={4}>
                        <Card>
                            <CardBody>
                                <h4>{isEditing ? "Edit PDF" : "Upload PDF"}</h4>
                                <Form onSubmit={handleSubmit}>
                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            required
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Description</Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>PDF File</Label>
                                        <Input
                                            type="file"
                                            innerRef={fileRef}
                                            accept=".pdf"
                                        />
                                    </FormGroup>

                                    <Button color="primary" type="submit" disabled={loading}>
                                        {loading
                                            ? "Processing..."
                                            : isEditing
                                            ? "Update"
                                            : "Upload"}
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col xl={8}>
                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between mb-3">
                                    <h4>Manage Documents</h4>
                                    {selectedPdfs.length > 0 && (
                                        <Button
                                            color="danger"
                                            size="sm"
                                            onClick={handleBulkDelete}
                                        >
                                            Delete Selected ({selectedPdfs.length})
                                        </Button>
                                    )}
                                </div>

                                <Input
                                    placeholder="Search..."
                                    className="mb-3"
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />

                                <Table hover responsive className="table-nowrap">
                                    <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPdfs.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.title}</td>
                                                <td>
                                                    <Badge
                                                        color={
                                                            item.status === "active"
                                                                ? "success"
                                                                : "danger"
                                                        }
                                                    >
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                                <td className="d-flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        color="info"
                                                        onClick={() =>
                                                            handleStatusToggle(item)
                                                        }
                                                    >
                                                        Toggle
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        color="primary"
                                                        onClick={() =>
                                                            handleEdit(item)
                                                        }
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        onClick={() =>
                                                            handleDelete(item.id)
                                                        }
                                                    >
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

export default PdfPages;