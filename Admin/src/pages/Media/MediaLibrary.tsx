import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Badge } from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const MediaLibrary = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [media, setMedia] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        media_name: "",
        media_type: "Banner image", // Default topic
    });

    const fetchMedia = async () => {
        const res: any = await api.get("api/admin/media");
        setMedia(res);
    };

    useEffect(() => { fetchMedia(); }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const file = fileInputRef.current?.files?.[0];
        if (!file) return alert("Select a file first");

        setLoading(true);
        const data = new FormData();
        data.append("media_name", formData.media_name);
        data.append("media_type", formData.media_type);
        data.append("file", file);

        try {
            await api.create("api/admin/media", data, { headers: { "Content-Type": "multipart/form-data" } });
            fetchMedia();
            setFormData({ media_name: "", media_type: "Banner image" });
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (err) { alert("Upload failed"); }
        finally { setLoading(false); }
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>
                    <Col lg={4}>
                        <Card>
                            <CardBody>
                                <h4 className="card-title mb-4">Upload Media</h4>
                                <Form onSubmit={handleUpload}>
                                    <FormGroup>
                                        <Label>Media Name</Label>
                                        <Input value={formData.media_name} onChange={(e) => setFormData({...formData, media_name: e.target.value})} required />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Media Type (Topic)</Label>
                                        <Input type="select" value={formData.media_type} onChange={(e) => setFormData({...formData, media_type: e.target.value})}>
                                            <option>Banner image</option>
                                            <option>Home Gallery</option>
                                            <option>Breadcrumbs image</option>
                                            <option>General</option>
                                        </Input>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>File</Label>
                                        <Input type="file" innerRef={fileInputRef} accept="image/*" />
                                    </FormGroup>
                                    <Button color="primary" className="w-100" type="submit" disabled={loading}>
                                        {loading ? "Uploading..." : "Upload to Library"}
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg={8}>
                        <Row>
                            {media.map((item, idx) => (
                                <Col md={4} key={idx} className="mb-4">
                                    <Card>
                                        <img src={`${process.env.REACT_APP_API_URL}/storage/${item.file_path}`} alt="" style={{ height: "150px", objectFit: "cover" }} className="card-img-top" />
                                        <CardBody>
                                            <p className="fw-bold mb-1 text-truncate">{item.media_name}</p>
                                            <Badge color="info">{item.media_type}</Badge>
                                            <Button color="link" className="text-danger p-0 mt-2 d-block" onClick={async () => { if(window.confirm("Delete?")) { await api.delete(`api/admin/media/${item.id}`); fetchMedia(); } }}>Delete</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default MediaLibrary;