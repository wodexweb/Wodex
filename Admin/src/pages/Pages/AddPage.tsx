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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const api = new APIClient();
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

/* =====================================================================
   CUSTOM UPLOAD ADAPTER FOR CKEDITOR 5 CLASSIC BUILD
   -----------------------------------------------------------------------
   @ckeditor/ckeditor5-build-classic is a PRE-BUILT bundle. You cannot
   add plugins like SimpleUploadAdapter to it — the "simpleUpload" config
   key is silently ignored, causing "filerepository-no-upload-adapter".

   This custom adapter is registered in onReady() and handles all uploads.

   WHY NO AUTH HEADER:
     The upload route is now PUBLIC in api.php (outside auth:sanctum).
     This solves the 401 Unauthenticated error caused by CORS preflight
     stripping the Authorization header before Sanctum can read it.

   CKEditor 5 contract:
     SUCCESS → resolve({ default: "https://..." })
     ERROR   → reject("error message string")
   ===================================================================== */
class CustomUploadAdapter {
  private loader: any;
  private controller: AbortController;

  constructor(loader: any) {
    this.loader = loader;
    this.controller = new AbortController();
  }

  upload(): Promise<{ default: string }> {
    return this.loader.file.then(
      (file: File) =>
        new Promise<{ default: string }>((resolve, reject) => {
          const formData = new FormData();
          // Field name MUST be "upload" — matches Laravel validation rule
          formData.append("upload", file);

          fetch(`${API_BASE_URL}/api/admin/pages/upload-image`, {
            method: "POST",
            headers: {
              // ✅ No Authorization header needed — route is now public
              // ✅ Do NOT set Content-Type — browser sets it automatically
              //    with the correct multipart/form-data boundary
              Accept: "application/json",
            },
            body: formData,
            signal: this.controller.signal,
          })
            .then(async (res) => {
              const data = await res.json();

              if (!res.ok) {
                // Laravel validation or server error
                const msg =
                  data?.error?.message ||
                  data?.message ||
                  `Upload failed (${res.status})`;
                console.error("[CKEditor Upload] Error:", res.status, data);
                throw new Error(msg);
              }

              return data;
            })
            .then((data) => {
              // CKEditor 5 needs { default: "url" }
              if (data?.default) {
                resolve({ default: data.default });
              } else {
                console.error("[CKEditor Upload] Bad response:", data);
                reject("Upload failed — unexpected server response");
              }
            })
            .catch((err) => {
              if (err.name !== "AbortError") {
                reject(err.message || "Upload failed");
              }
            });
        })
    );
  }

  abort(): void {
    this.controller.abort();
  }
}

/* ===================================================================== */

const AddPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "published",
  });

  /* ─── Slug generator ─── */
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  /* ─── Input handler ─── */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: slugManuallyEdited ? prev.slug : generateSlug(value),
      }));
      return;
    }

    if (name === "slug") {
      setSlugManuallyEdited(value.length > 0);
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ─── Submit ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title required");
    if (!formData.slug.trim()) return toast.error("Slug required");
    if (!formData.content.trim()) return toast.error("Content required");

    setLoading(true);

    try {
      await api.create("/api/admin/pages", formData);
      toast.success("Page created successfully ✅");
      setTimeout(() => navigate("/pages/manage"), 1000);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create page ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ─── Render ─── */
  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={12} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-4 border-bottom pb-3">Add Page</h4>

                <Form onSubmit={handleSubmit}>

                  {/* ── Title & Slug ── */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Page Title *</Label>
                        <input
                          className="form-control"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="About Us"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Slug *</Label>
                        <div className="input-group">
                          <span className="input-group-text">/</span>
                          <input
                            className="form-control"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="about-us"
                          />
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ── CKEditor ── */}
                  <Row>
                    <Col md={12}>
                      <FormGroup>
                        <Label>Page Content *</Label>

                        <CKEditor
                          editor={ClassicEditor as any}
                          data={formData.content}

                          onReady={(editor: any) => {
                            /*
                             * ✅ Register the custom upload adapter.
                             * This MUST be done in onReady — the adapter
                             * is registered directly on FileRepository,
                             * which is the only way that works with
                             * pre-built CKEditor 5 classic bundles.
                             */
                            editor.plugins.get(
                              "FileRepository"
                            ).createUploadAdapter = (loader: any) =>
                              new CustomUploadAdapter(loader);
                          }}

                          config={{
                            toolbar: [
                              "heading", "|",
                              "bold", "italic", "link",
                              "bulletedList", "numberedList",
                              "blockQuote", "insertTable",
                              "imageUpload", "|",
                              "undo", "redo",
                            ],
                          }}

                          onChange={(_: any, editor: any) => {
                            setFormData((prev) => ({
                              ...prev,
                              content: editor.getData(),
                            }));
                          }}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ── Status ── */}
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

                  {/* ── Buttons ── */}
                  <div className="text-center mt-4">
                    <Button type="submit" color="primary" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Page"
                      )}
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

      <ToastContainer />
    </div>
  );
};

export default AddPage;
