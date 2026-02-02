import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Label,
  Form,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

type EventOption = {
  id: string;
  title: string;
};

const ManageGallery = () => {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  const [title, setTitle] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    api.get("api/events").then((res: any) => {
      const apiEvents =
        res.data?.map((e: any) => ({
          id: String(e.id),
          title: e.title,
        })) || [];

      setEvents(apiEvents);
    });
  }, []);

  /* ================= FETCH GALLERY (ONLY IF EVENT SELECTED) ================= */
  const fetchGallery = async (eventId: string) => {
    if (!eventId) {
      setGalleryImages([]);
      return;
    }

    try {
      const res: any = await api.get(`api/admin/gallery/${eventId}`);
      setGalleryImages(res.images || []);
    } catch {
      setGalleryImages([]);
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter title");
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one photo");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);

    // event OPTIONAL
    if (selectedEvent) {
      formData.append("event_id", selectedEvent);
    }

    Array.from(selectedFiles).forEach((file) => {
      formData.append("files[]", file);
    });

    try {
      await api.create("api/admin/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Images uploaded successfully");

      setTitle("");
      setSelectedFiles(null);
      if (fileRef.current) fileRef.current.value = "";

      if (selectedEvent) {
        fetchGallery(selectedEvent);
      }
    } catch {
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* ================= LEFT FORM ================= */}
          <Col lg={4}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Upload Event Photos</h4>

                <Form onSubmit={handleUpload}>
                  {/* TITLE INPUT */}
                  <div className="mb-3">
                    <Label>Title</Label>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter title"
                    />
                  </div>

                  {/* EVENT SELECT (OPTIONAL) */}
                  <div className="mb-3">
                    <Label>Select Event (Optional)</Label>
                    <Input
                      type="select"
                      value={selectedEvent}
                      onChange={(e) => {
                        const eventId = e.target.value;
                        setSelectedEvent(eventId);
                        if (eventId) {
                          fetchGallery(eventId);
                        } else {
                          setGalleryImages([]);
                        }
                      }}
                    >
                      <option value="">-- Optional --</option>
                      {events.map((event) => (
                        <option key={event.id} value={event.id}>
                          {event.title}
                        </option>
                      ))}
                    </Input>
                  </div>

                  {/* FILE INPUT */}
                  <div className="mb-3">
                    <Label>Photos</Label>
                    <Input
                      type="file"
                      multiple
                      innerRef={fileRef}
                      onChange={(e) => setSelectedFiles(e.target.files)}
                    />
                  </div>

                  <Button color="primary" className="w-100" type="submit">
                    Upload to Gallery
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* ================= RIGHT GALLERY ================= */}
          <Col lg={8}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Gallery Grid Display</h4>

                {selectedEvent ? (
                  <Row>
                    {galleryImages.map((path, idx) => (
                      <Col md={4} key={idx} className="mb-3">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/storage/${path}`}
                          alt="gallery"
                          className="img-fluid rounded shadow"
                          style={{
                            height: "150px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <p className="text-muted">
                    Select an event to view its gallery.
                  </p>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageGallery;
