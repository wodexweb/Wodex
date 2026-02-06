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

interface Member {
  id: number;
  name: string;
  position: string;
  rank?: number;
  photo_url?: string;
}

const api = new APIClient();

const MemberView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD MEMBER ================= */

  useEffect(() => {
    if (!id) return;

    api
      .get(`/api/admin/members/${id}`)
      .then((res: any) => {
        const data = res?.data?.data ?? res?.data ?? null;
        setMember(data);
      })
      .catch(() => setMember(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading member...</span>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */

  if (!member) {
    return (
      <div className="page-content">
        <div className="text-center mt-5 text-muted">Member not found</div>
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
            <h4 className="mb-1 fw-semibold">{member.name}</h4>
            <p className="text-muted mb-0">
              Complete information about this member
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
              onClick={() => navigate(`/members/edit/${member.id}`)}
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
                style={{ height: 320 }}
              >
                {member.photo_url ? (
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="rounded-circle"
                    style={{
                      width: 200,
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="rounded-circle border d-flex align-items-center justify-content-center text-muted"
                    style={{ width: 200, height: 200 }}
                  >
                    No Image
                  </div>
                )}
              </div>
            </Card>
          </Col>

          {/* DETAILS */}
          <Col xl={7} lg={6}>
            <Card className="border-0 shadow-sm h-100">
              <CardBody>
                <Row className="mb-3">
                  <Col sm={4} className="fw-semibold">
                    Name
                  </Col>
                  <Col sm={8}>{member.name}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} className="fw-semibold">
                    Position
                  </Col>
                  <Col sm={8}>{member.position}</Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} className="fw-semibold">
                    Rank
                  </Col>
                  <Col sm={8}>{member.rank ?? "-"}</Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MemberView;
