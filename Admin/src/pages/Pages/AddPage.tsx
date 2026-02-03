import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Label,
  Button,
  Row,
  Spinner,
} from "reactstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const api = new APIClient();

const AddPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "published",
  });

  /* ================= CHANGE HANDLER ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !prev.slug ? { slug: generateSlug(value) } : {}),
    }));
  };

  /* ================= SLUG ================= */

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.create("/api/pages", formData);
      navigate("/pages/manage");
    } catch (err) {
      alert(err || "Failed to create page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={12} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-4 border-bottom pb-3">Add Page</h4>

                <Form onSubmit={handleSubmit}>
                  {/* ROW 1 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Page Title</Label>
                        <input
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Slug</Label>
                        <input
                          className="form-control"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 2 — CKEDITOR */}
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Page Content</Label>
                        <CKEditor
                          editor={ClassicEditor as any}
                          data={formData.content}
                          onChange={(_, editor: any) => {
                            const data = editor.getData();
                            setFormData((prev) => ({
                              ...prev,
                              content: data,
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 3 */}
                  <Row>
                    <Col md={4}>
                      <FormGroup>
                        <Label>Status</Label>
                        <select
                          className="form-control"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                        </select>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* SUBMIT */}
                  <div className="text-center mt-4">
                    <Button color="primary" disabled={loading}>
                      {loading && <Spinner size="sm" className="me-2" />}
                      Save Page
                    </Button>

                    <Button
                      type="button"
                      color="secondary"
                      className="ms-2"
                      onClick={() => navigate("/pages/manage")}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddPage;
