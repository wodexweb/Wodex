import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

/* ================= TYPES ================= */

interface EventType {
  id: number;
  title: string;
  description?: string;
  end_date: string;
  link: string;
  photo_url?: string | null;
}

const EditEvent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  /* ================= LOAD EVENT ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/admin/events/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? null;
        if (!data) return;

        setEvent(data);
        setTitle(data.title);
        setDescription(data.description ?? "");
        setEndDate(data.end_date?.slice(0, 10));
        setLink(data.link);
        setImagePreview(data.photo_url ?? null);
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= IMAGE CHANGE ================= */

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /* ================= UPDATE EVENT ================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("end_date", endDate);
    formData.append("link", link);
    if (status) formData.append("status", status);
    formData.append("_method", "PUT");

    if (imageFile) {
      formData.append("photo", imageFile);
    }

    api
      .create(`/api/events/${id}`, formData)
      .then(() => {
        toast.success("Event updated successfully ✅");
        navigate("/events/list");
      })
      .catch(() => {
        toast.error("Failed to update event ❌");
      })
      .finally(() => setSaving(false));
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading event...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-content">
        <div className="text-center mt-5 text-muted">Event not found</div>
      </div>
    );
  }

  /* ================= FORM UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                {/* HEADER */}
                <div className="border-bottom pb-3 mb-4">
                  <h4 className="mb-1 fw-semibold">Edit Event</h4>
                  <p className="text-muted mb-0">
                    Update event details and image
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* TITLE */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* END DATE */}
                    <Col lg={3}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">End Date</Label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* STATUS */}
                    <Col lg={3}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Status</Label>
                        <Input
                          type="select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="">Auto (Recommended)</option>
                          <option value="upcoming">Upcoming</option>
                          <option value="recent">Recent</option>
                          <option value="past">Past</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* LINK */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Event Link</Label>
                        <Input
                          type="url"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* IMAGE */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Event Image</Label>

                        <Card className="border mb-2">
                          <div
                            className="d-flex justify-content-center align-items-center bg-light"
                            style={{ height: 220 }}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="img-fluid rounded"
                                style={{
                                  maxHeight: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span className="text-muted">
                                No image available
                              </span>
                            )}
                          </div>
                        </Card>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </FormGroup>
                    </Col>

                    {/* DESCRIPTION */}
                    <Col lg={12}>
                      <FormGroup className="mb-4">
                        <Label className="fw-semibold">Description</Label>
                        <Input
                          type="textarea"
                          rows={4}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FormGroup>
                    </Col>

                    {/* ACTIONS */}
                    <Col xs={12}>
                      <div className="d-flex gap-2">
                        <Button
                          color="secondary"
                          outline
                          type="button"
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>

                        <Button color="primary" disabled={saving}>
                          {saving ? "Saving..." : "Update Event"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 🔔 ToastContainer – SAME pattern as EventList & Register */}
      <ToastContainer />
    </div>
  );
};

export default EditEvent;
