import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Spinner,
  Button,
} from "reactstrap";

const api = new APIClient();

/* ================= TYPES ================= */

interface Announcement {
  id: number;
  title: string;
  description?: string | null;
  link?: string | null;
  end_date: string;
  photo_url?: string | null;
}

const ViewAnnouncement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /* ================= LOAD ANNOUNCEMENT ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/announcements/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? null;
        setAnnouncement(data);
      })
      .catch(() => setAnnouncement(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading announcement...</span>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!announcement) {
    return (
      <div className="page-content">
        <div className="text-center mt-5 text-muted">
          Announcement not found
        </div>
      </div>
    );
  }

  /* ================= VIEW ================= */

  return (
    <div className="page-content">
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4 align-items-center">
          <Col>
            <h4 className="mb-1 fw-semibold">{announcement.title}</h4>
            <p className="text-muted mb-0">
              Complete information about this announcement
            </p>
          </Col>

          <Col className="text-end">
            <Button
              color="secondary"
              outline
              className="me-2"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              color="primary"
              onClick={() => navigate(`/announcements/edit/${announcement.id}`)}
            >
              Edit
            </Button>
          </Col>
        </Row>

        <Row className="justify-content-center">
          {/* IMAGE */}
          <Col xl={5} lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <div
                className="d-flex align-items-center justify-content-center bg-light"
                style={{ height: 360 }}
              >
                {announcement.photo_url ? (
                  <img
                    src={announcement.photo_url}
                    alt={announcement.title}
                    className="img-fluid"
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <span className="text-muted">No image available</span>
                )}
              </div>
            </Card>
          </Col>

          {/* DETAILS */}
          <Col xl={7} lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <CardBody>
                {/* BASIC INFO */}
                <Row className="mb-3">
                  <Col sm={4} className="fw-semibold">
                    Valid Till
                  </Col>
                  <Col sm={8}>
                    {new Date(announcement.end_date).toLocaleDateString()}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} className="fw-semibold">
                    Link
                  </Col>
                  <Col sm={8}>
                    {announcement.link ? (
                      <a
                        href={announcement.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open link →
                      </a>
                    ) : (
                      <span className="text-muted">Not available</span>
                    )}
                  </Col>
                </Row>

                {/* DESCRIPTION LAST */}
                <hr />

                <div>
                  <h6 className="fw-semibold mb-2">Description</h6>
                  <p className="text-muted mb-0">
                    {announcement.description || "No description available"}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ViewAnnouncement;
