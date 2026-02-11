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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // View Modal State
  const [viewModal, setViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Registration | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const toggleViewModal = () => setViewModal(!viewModal);

  /* ================= FETCH LIST ================= */

  const fetchPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await api.get("/api/registration");
      setData(res?.data ?? []);
    } catch (e) {
      toast.error("Failed to load membership data ❌");
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
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Approve this membership?</p>
          <div className="d-flex gap-2 mt-2">
            <Button
              size="sm"
              color="success"
              onClick={async () => {
                try {
                  await api.put(`/api/registration/${id}/approve`);
                  toast.success("Membership approved ✅");
                  fetchPurchases();
                } catch {
                  toast.error("Failed to approve ❌");
                }
                closeToast();
              }}
            >
              Yes
            </Button>

            <Button size="sm" color="secondary" onClick={closeToast}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ❌ Delete with Toast Confirmation
  const deleteMember = (id: number) => {
    toast.error(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this user?</p>
          <div className="d-flex gap-2 mt-2">
            <Button
              size="sm"
              color="danger"
              onClick={async () => {
                try {
                  await api.delete(`/api/registration/${id}`);
                  toast.success("User deleted successfully 🗑️");
                  fetchPurchases();
                } catch {
                  toast.error("Failed to delete member ❌");
                }
                closeToast();
              }}
            >
              Yes, Delete
            </Button>

            <Button size="sm" color="secondary" onClick={closeToast}>
              Cancel
            </Button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };

  // ✏️ Edit
  const editMember = (id: number) => {
    navigate(`/users/edit/${id}`);
  };

  // 👁 View
  const viewMember = async (id: number) => {
    try {
      setViewLoading(true);
      const res: any = await api.get(`/api/registration/${id}`);
      setSelectedUser(res?.data);
      setViewModal(true);
    } catch {
      toast.error("Failed to fetch user details ❌");
    } finally {
      setViewLoading(false);
    }
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
                              <Badge
                                color={item.status === "paid" ? "success" : "warning"}
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
                                color="info"
                                size="sm"
                                onClick={() => viewMember(item.id)}
                              >
                                View
                              </Button>

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
                      </tbody>
                    </Table>
                  </>
                )}

                {/* View Modal */}
                <Modal isOpen={viewModal} toggle={toggleViewModal}>
                  <ModalHeader toggle={toggleViewModal}>
                    User Details
                  </ModalHeader>
                  <ModalBody>
                    {viewLoading ? (
                      <Spinner />
                    ) : selectedUser ? (
                      <>
                        <p><strong>Name:</strong> {selectedUser.name} {selectedUser.surname}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
                        <p><strong>City:</strong> {selectedUser.city}</p>
                      </>
                    ) : (
                      <p>No user data found</p>
                    )}
                  </ModalBody>
                  <ModalFooter>
                    <Button color="secondary" onClick={toggleViewModal}>
                      Close
                    </Button>
                  </ModalFooter>
                </Modal>

              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default UserMembershipPurchases;