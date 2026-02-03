import React, { useEffect, useRef, useState } from "react";
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
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [driveLink, setDriveLink] = useState("");

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    api
      .get("/api/events")
      .then((res: any) => {
        // backend gives { upcoming, recent, past }
        const allEvents = [
          ...(res.upcoming || []),
          ...(res.recent || []),
          ...(res.past || []),
        ];

        setEvents(
          allEvents.map((e: any) => ({
            id: String(e.id),
            title: e.title,
          })),
        );
      })
      .catch((err) => {
        console.error("Events fetch error:", err);
      });
  }, []);

  /* ================= FETCH GALLERY ================= */
  const fetchGallery = async (eventId: string) => {
    if (!eventId) return; // ⛔ safety

    try {
      const res: any = await api.get(`/api/admin/gallery/event/${eventId}`);

      // backend safe response handling
      if (!res || typeof res !== "object") {
        setImages([]);
        return;
      }

      setImages(Array.isArray(res.images) ? res.images : []);
      setDriveLink(res.drive_link || "");
      setTitle(res.event_title || "");
    } catch (err: any) {
      console.error("Gallery fetch failed:", err);
      setImages([]); // ⛔ prevent UI crash
      setDriveLink("");
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEvent) return alert("Select event");
    if (!files || files.length === 0) return alert("Select images");

    const formData = new FormData();
    formData.append("event_id", selectedEvent);
    formData.append("title", title);

    Array.from(files).forEach((f) => {
      formData.append("files[]", f);
    });

    try {
      await api.create("/api/admin/gallery", formData);
      alert("Images uploaded");
      fetchGallery(selectedEvent);

      if (fileRef.current) fileRef.current.value = "";
      setFiles(null);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          {/* LEFT */}
          <Col lg={4}>
            <Card>
              <CardBody>
                <h4>Upload Event Photos</h4>

                <Form onSubmit={handleUpload}>
                  <Label>Select Event</Label>
                  <Input
                    type="select"
                    value={selectedEvent}
                    onChange={(e) => {
                      const id = e.target.value;
                      setSelectedEvent(id);

                      if (!id) {
                        setImages([]);
                        setTitle("");
                        return;
                      }

                      const ev = events.find((x) => x.id === id);
                      setTitle(ev ? ev.title : "");

                      // ✅ only ONE controlled call
                      fetchGallery(id);
                    }}
                  >
                    <option value="">-- Select Event --</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title}
                      </option>
                    ))}
                  </Input>

                  <Label className="mt-3">Title</Label>
                  <Input value={title} readOnly />

                  <Label className="mt-3">Photos</Label>
                  <Input
                    type="file"
                    multiple
                    innerRef={fileRef}
                    onChange={(e) => setFiles(e.target.files)}
                  />

                  <Button className="mt-3 w-100" color="primary">
                    Upload
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* RIGHT */}
          <Col lg={8}>
            <Card>
              <CardBody>
                <h4>Gallery</h4>

                {driveLink && (
                  <a
                    href={driveLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-primary mb-3"
                  >
                    Open Google Drive Folder
                  </a>
                )}

                <Row>
                  {images.map((img, i) => (
                    <Col md={4} key={i} className="mb-3">
                      <img
                        src={`${process.env.REACT_APP_API_URL}/storage/${img}`}
                        className="img-fluid rounded"
                        style={{ height: 150, objectFit: "cover" }}
                      />
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ManageGallery;
