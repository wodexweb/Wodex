// import React, { useState, useEffect, useRef } from "react";
// import { Container, Row, Col, Card, CardBody, Form, FormGroup, Label, Input, Button, Table } from "reactstrap";
// import { APIClient } from "../../helpers/api_helper";

// const api = new APIClient();

// const MediaLibrary = () => {

//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const [media, setMedia] = useState<any[]>([]);
//     const [editingId, setEditingId] = useState<number | null>(null);

//     const [formData, setFormData] = useState({
//         page_slug: "home",
//         section: "hero",
//         title: "",
//         subtitle: ""
//     });

//     const fetchMedia = async () => {
//         const res: any = await api.get("api/admin/media-library");
//         setMedia(res);
//     };

//     useEffect(() => { fetchMedia(); }, []);

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();

//         const file = fileInputRef.current?.files?.[0];
//         const data = new FormData();

//         Object.entries(formData).forEach(([k, v]) => data.append(k, v));
//         if (file) data.append("file", file);

//         if (editingId) {
//             await api.update(`api/admin/media-library/${editingId}`, data);
//         } else {
//             await api.create("api/admin/media-library", data);
//         }

//         setEditingId(null);
//         setFormData({ page_slug: "home", section: "hero", title: "", subtitle: "" });

//         fetchMedia();
//     };

//     const handleEdit = (item: any) => {
//         setEditingId(item.id);
//         setFormData({
//             page_slug: item.page_slug,
//             section: item.section,
//             title: item.title || "",
//             subtitle: item.subtitle || ""
//         });
//     };

//     return (
//         <div className="page-content">
//             <Container fluid>
//                 <Row>

//                     {/* FORM */}
//                     <Col lg={4}>
//                         <Card>
//                             <CardBody>
//                                 <h4>{editingId ? "Update Media" : "Add Media"}</h4>

//                                 <Form onSubmit={handleSubmit}>

//                                     <FormGroup>
//                                         <Label>Page</Label>
//                                         <Input type="select"
//                                             value={formData.page_slug}
//                                             onChange={(e) => setFormData({ ...formData, page_slug: e.target.value })}
//                                         >
//                                             <option value="home">Home</option>
//                                             <option value="about-iap">About</option>
//                                             <option value="events">Events</option>
//                                         </Input>
//                                     </FormGroup>

//                                     <FormGroup>
//                                         <Label>Section</Label>
//                                         <Input type="select"
//                                             value={formData.section}
//                                             onChange={(e) => setFormData({ ...formData, section: e.target.value })}
//                                         >
//                                             <option value="hero">Hero</option>
//                                             <option value="header">Header</option>
//                                         </Input>
//                                     </FormGroup>

//                                     <FormGroup>
//                                         <Label>Title</Label>
//                                         <Input value={formData.title}
//                                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                                         />
//                                     </FormGroup>

//                                     <FormGroup>
//                                         <Label>Subtitle</Label>
//                                         <Input value={formData.subtitle}
//                                             onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
//                                         />
//                                     </FormGroup>

//                                     <FormGroup>
//                                         <Label>Image</Label>
//                                         <Input type="file" innerRef={fileInputRef} />
//                                     </FormGroup>

//                                     <Button color="primary" className="w-100">
//                                         {editingId ? "Update" : "Save"}
//                                     </Button>

//                                 </Form>
//                             </CardBody>
//                         </Card>
//                     </Col>

//                     {/* TABLE */}
//                     <Col lg={8}>
//                         <Card>
//                             <CardBody>
//                                 <h4>Media List</h4>

//                                 <Table bordered responsive>
//                                     <thead>
//                                         <tr>
//                                             <th>ID</th>
//                                             <th>Page</th>
//                                             <th>Section</th>
//                                             <th>Title</th>
//                                             <th>Image</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {media.map((item: any) => (
//                                             <tr key={item.id}>
//                                                 <td>{item.id}</td>
//                                                 <td>{item.page_slug}</td>
//                                                 <td>{item.section}</td>
//                                                 <td>{item.title}</td>
//                                                 <td>
//                                                     {item.file_path &&
//                                                         <img
//                                                             src={`${process.env.REACT_APP_API_URL}/storage/${item.file_path}`}
//                                                             width="80"
//                                                         />
//                                                     }
//                                                 </td>
//                                                 <td>
//                                                     <Button size="sm" color="warning" onClick={() => handleEdit(item)}>Edit</Button>{" "}
//                                                     <Button size="sm" color="danger" onClick={async () => {
//                                                         await api.delete(`api/admin/media-library/${item.id}`);
//                                                         fetchMedia();
//                                                     }}>Delete</Button>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </Table>

//                             </CardBody>
//                         </Card>
//                     </Col>

//                 </Row>
//             </Container>
//         </div>
//     );
// };

// export default MediaLibrary;

import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Table
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const MediaLibrary = () => {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [media, setMedia] = useState<any[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        page_slug: "home",
        section: "hero",
        title: "",
        subtitle: ""
    });

    const fetchMedia = async () => {
        const res: any = await api.get("api/admin/media-library");
        setMedia(res);
    };

    useEffect(() => {
        fetchMedia();
    }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const file = fileInputRef.current?.files?.[0];
        const data = new FormData();

        Object.entries(formData).forEach(([k, v]) =>
            data.append(k, String(v))
        );

        if (file) data.append("file", file);

        if (editingId) {
            await api.put(`api/admin/media-library/${editingId}`, data);
        } else {
            await api.post("api/admin/media-library", data);
        }

        setEditingId(null);
        setFormData({
            page_slug: "home",
            section: "hero",
            title: "",
            subtitle: ""
        });

        if (fileInputRef.current) fileInputRef.current.value = "";

        fetchMedia();
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setFormData({
            page_slug: item.page_slug,
            section: item.section,
            title: item.title || "",
            subtitle: item.subtitle || ""
        });
    };

    return (
        <div className="page-content">
            <Container fluid>
                <Row>

                    {/* FORM */}
                    <Col lg={4}>
                        <Card>
                            <CardBody>
                                <h4>{editingId ? "Update Media" : "Add Media"}</h4>

                                <Form onSubmit={handleSubmit}>

                                    <FormGroup>
                                        <Label>Page</Label>
                                        <Input
                                            type="select"
                                            value={formData.page_slug}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    page_slug: e.target.value
                                                })
                                            }
                                        >
                                            <option value="home">Home</option>
                                            <option value="about-iap">About</option>
                                            <option value="events">Events</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Section</Label>
                                        <Input
                                            type="select"
                                            value={formData.section}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    section: e.target.value
                                                })
                                            }
                                        >
                                            <option value="hero">Hero</option>
                                            <option value="header">Header</option>
                                        </Input>
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Title</Label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    title: e.target.value
                                                })
                                            }
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Subtitle</Label>
                                        <Input
                                            value={formData.subtitle}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    subtitle: e.target.value
                                                })
                                            }
                                        />
                                    </FormGroup>

                                    <FormGroup>
                                        <Label>Image</Label>
                                        <Input type="file" innerRef={fileInputRef} />
                                    </FormGroup>

                                    <Button color="primary" className="w-100">
                                        {editingId ? "Update" : "Save"}
                                    </Button>

                                </Form>
                            </CardBody>
                        </Card>
                    </Col>

                    {/* TABLE */}
                    <Col lg={8}>
                        <Card>
                            <CardBody>
                                <h4>Media List</h4>

                                <Table bordered responsive>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Page</th>
                                            <th>Section</th>
                                            <th>Title</th>
                                            <th>Image</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {media.map((item: any) => (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.page_slug}</td>
                                                <td>{item.section}</td>
                                                <td>{item.title}</td>
                                                <td>
                                                    {item.file_path && (
                                                        <img
                                                            src={`${process.env.REACT_APP_API_URL}/storage/${item.file_path}`}
                                                            width="80"
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    <Button
                                                        size="sm"
                                                        color="warning"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </Button>{" "}
                                                    <Button
                                                        size="sm"
                                                        color="danger"
                                                        onClick={async () => {
                                                            await api.delete(
                                                                `api/admin/media-library/${item.id}`
                                                            );
                                                            fetchMedia();
                                                        }}
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
        </div>
    );
};

export default MediaLibrary;
