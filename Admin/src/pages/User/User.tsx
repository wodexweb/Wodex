import React, { useEffect, useState, useCallback } from "react";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Badge,
  Spinner,
  Pagination,
  PaginationItem,
  PaginationLink,
  Button,
} from "reactstrap";
import { useNavigate } from "react-router-dom";

const api = new APIClient();

/* ================= TYPES ================= */

interface Registration {
  id: number;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  city: string;
  status?: "paid" | "pending";
}

/* ================= COMPONENT ================= */

const UserMembershipPurchases: React.FC = () => {
  const [data, setData] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  /* ================= FETCH ================= */

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await api.get("/api/registration");
      setData(res?.data ?? []);
    } catch (e) {
      setError("Failed to load membership data ❌");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  /* ================= ACTIONS ================= */

  // ✅ Approve
  const approveMembership = async (id: number) => {
    if (!window.confirm("Approve this membership?")) return;

    try {
      await api.put(`/api/registration/${id}`);
      fetchPurchases();
    } catch {
      alert("Failed to approve membership ❌");
    }
  };

  // ❌ Delete (fraud)
  const deleteMember = async (id: number) => {
    if (!window.confirm("Delete this user? This cannot be undone!")) return;

    try {
      await api.delete(`/api/registration/${id}`);
      fetchPurchases();
    } catch {
      alert("Failed to delete member ❌");
    }
  };

  // ✏️ Edit
  const editMember = (id: number) => {
    navigate(`/admin/registration/edit/${id}`);
  };

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = data.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-3">
                  <h4>User Membership Purchases</h4>
                  <Badge color="info">Total: {data.length}</Badge>
                </div>

                {loading ? (
                  <div className="text-center py-5">
                    <Spinner />
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">{error}</div>
                ) : (
                  <>
                    <Table hover responsive a lign="middle" className="table-nowrap">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>User</th>
                          <th>Contact</th>
                          <th>City</th>
                          <th>Membership</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={item.id}>
                            <td>
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </td>

                            <td>
                              <strong>
                                {item.name} {item.surname}
                              </strong>
                              <br />
                              <small>{item.email}</small>
                            </td>

                            <td>{item.mobile}</td>
                            <td>{item.city}</td>

                            <td>
                              <span className="fw-bold text-primary">
                                Lifetime
                              </span>
                              <Badge color="success" pill className="ms-2">
                                ∞
                              </Badge>
                            </td>

                            <td>
                              <Badge
                                color={item.status === "paid" ? "success" : "warning"}
                                pill
                              >
                                {item.status === "paid" ? "Approved" : "Pending"}
                              </Badge>
                            </td>

                            <td className="d-flex gap-2">
                              {item.status !== "paid" && (
                                <Button
                                  color="success"
                                  size="sm"
                                  onClick={() => approveMembership(item.id)}
                                >
                                  Approve
                                </Button>
                              )}

                              <Button
                                color="primary"
                                size="sm"
                                onClick={() => editMember(item.id)}
                              >
                                Edit
                              </Button>

                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => deleteMember(item.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}

                        {currentItems.length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center text-muted">
                              No records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <Pagination className="justify-content-center">
                        <PaginationItem disabled={currentPage === 1}>
                          <PaginationLink
                            previous
                            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                          />
                        </PaginationItem>

                        {Array.from({ length: totalPages }).map((_, i) => (
                          <PaginationItem key={i} active={currentPage === i + 1}>
                            <PaginationLink onClick={() => setCurrentPage(i + 1)}>
                              {i + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem disabled={currentPage === totalPages}>
                          <PaginationLink
                            next
                            onClick={() =>
                              setCurrentPage(p => Math.min(p + 1, totalPages))
                            }
                          />
                        </PaginationItem>
                      </Pagination>
                    )}
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserMembershipPurchases;