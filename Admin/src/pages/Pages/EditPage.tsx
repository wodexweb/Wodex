import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  CardBody,
  Button,
  Input,
  Spinner,
  Row,
  Col,
  FormGroup,
  Label,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { toast, ToastContainer } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

const EditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "draft",
  });

  useEffect(() => {
    fetchPage();
  }, []);

  const fetchPage = async () => {
    try {
      const res: any = await api.get(`/api/admin/pages/${id}`);
      const data = res.data || res;

      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        status: data.status,
      });
    } catch {
      toast.error("Failed to load page");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.title.trim()) return toast.error("Title required");
    if (!formData.slug.trim()) return toast.error("Slug required");
    if (!formData.content.trim()) return toast.error("Content required");

    try {
      setSaving(true);

      // ✅ FIXED URL
      await api.put(`/api/admin/pages/${id}`, formData);

      toast.success("Page updated successfully ✅");
      setTimeout(() => navigate("/pages/manage"), 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-content text-center mt-5">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="page-content">
      <Container>
        <Card>
          <CardBody>
            <h4 className="mb-4">Edit Page</h4>

            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Content</Label>
              <CKEditor
                editor={ClassicEditor as any}
                data={formData.content}
                onChange={(_, editor) =>
                  setFormData({
                    ...formData,
                    content: editor.getData(),
                  })
                }
              />
            </FormGroup>

            <FormGroup className="mt-3">
              <Label>Status</Label>
              <Input
                type="select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Input>
            </FormGroup>

            <div className="mt-4">
              <Button
                color="primary"
                onClick={handleUpdate}
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Page"}
              </Button>

              <Button
                color="secondary"
                className="ms-2"
                onClick={() => navigate("/pages/manage")}
              >
                Cancel
              </Button>
            </div>
          </CardBody>
        </Card>
      </Container>

      <ToastContainer />
    </div>
  );
};

export default EditPage;