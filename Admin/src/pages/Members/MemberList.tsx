import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Table,
  Button,
  Spinner,
  Input,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api = new APIClient();

/* ================= TYPES ================= */

interface Member {
  id: number;
  name: string;
  position: string;
  rank?: number | null;
  photo_url?: string | null;
}

/* ================= COMPONENT ================= */

const MemberList: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  /* ================= LOAD MEMBERS ================= */

  useEffect(() => {
    api
      .get("/api/admin/members")
      .then((res: any) => {
        let list: Member[] = [];

        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;

        setMembers(list);
      })
      .catch(() => {
       toast.error("Failed to load members ❌");
        setMembers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEARCH ================= */

  const filteredMembers = useMemo(() => {
    if (!search) return members;

    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.position.toLowerCase().includes(search.toLowerCase())
    );
  }, [members, search]);

  /* ================= CHECKBOX ================= */

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMembers.map((m) => m.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

 const handleDelete = (id: number) => {
  toast(
    () => (
      <div>
        <p>Are you sure you want to delete this member?</p>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button
            size="sm"
            color="secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            color="danger"
            onClick={async () => {
              try {
                const payload = new FormData();
                payload.append("_method", "DELETE");

                await api.create(`/api/admin/members/${id}`, payload);

                setMembers((prev) =>
                  prev.filter((m) => m.id !== id)
                );

                setSelectedIds((prev) =>
                  prev.filter((x) => x !== id)
                );

                toast.dismiss();
                toast.success("Member deleted successfully ✅");
              } catch (error: any) {
                toast.dismiss();
                toast.error(
                  error?.response?.data?.message ||
                    "Delete failed ❌"
                );
              }
            }}
          >
            Yes, Delete
          </Button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};

 const handleBulkDelete = () => {
  toast(
    () => (
      <div>
        <p>
          Delete {selectedIds.length} selected members?
        </p>

        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button
            size="sm"
            color="secondary"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            color="danger"
            onClick={async () => {
              try {
                setBulkDeleting(true);

                await Promise.all(
                  selectedIds.map((id) => {
                    const payload = new FormData();
                    payload.append("_method", "DELETE");
                    return api.create(
                      `/api/admin/members/${id}`,
                      payload
                    );
                  })
                );

                setMembers((prev) =>
                  prev.filter(
                    (m) => !selectedIds.includes(m.id)
                  )
                );

                setSelectedIds([]);

                toast.dismiss();
                toast.success(
                  "Selected members deleted successfully ✅"
                );
              } catch (error: any) {
                toast.dismiss();
                toast.error(
                  error?.response?.data?.message ||
                    "Bulk delete failed ❌"
                );
              } finally {
                setBulkDeleting(false);
              }
            }}
          >
            Yes, Delete All
          </Button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
    }
  );
};

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading members...</span>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                {/* HEADER */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-0">Members</h4>
                    {selectedIds.length > 0 && (
                      <small className="text-muted">
                        {selectedIds.length} selected
                      </small>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    {selectedIds.length > 0 && (
                      <Button
                        color="danger"
                        size="sm"
                        disabled={bulkDeleting}
                        onClick={handleBulkDelete}
                      >
                        {bulkDeleting
                          ? "Deleting..."
                          : `Delete (${selectedIds.length})`}
                      </Button>
                    )}

                    <Button
                      color="success"
                      size="sm"
                      onClick={() => navigate("/members/create")}
                    >
                      + Add
                    </Button>

                    <Input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{ width: 200 }}
                    />
                  </div>
                </div>

                {/* TABLE */}
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>
                          <Input
                            type="checkbox"
                            checked={
                              filteredMembers.length > 0 &&
                              selectedIds.length === filteredMembers.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th style={{ width: 80 }}>Rank</th>
                        <th style={{ width: 100 }} className="text-center">
                          Photo
                        </th>
                        <th>Name</th>
                        <th>Position</th>
                        <th style={{ width: 220 }} className="text-end">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredMembers.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-center text-muted py-4"
                          >
                            No members found
                          </td>
                        </tr>
                      )}

                      {filteredMembers.map((m) => (
                        <tr key={m.id}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedIds.includes(m.id)}
                              onChange={() => toggleSelectOne(m.id)}
                            />
                          </td>

                          <td>{m.rank ?? "-"}</td>

                          <td className="text-center">
                            {m.photo_url ? (
                              <img
                                src={m.photo_url}
                                alt={m.name}
                                className="rounded-circle"
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <div
                                className="border rounded-circle text-muted d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                              >
                                N/A
                              </div>
                            )}
                          </td>

                          <td className="fw-medium">{m.name}</td>

                          <td>{m.position}</td>

                          <td className="text-end">
                            <Button
                              size="sm"
                              color="light"
                              className="me-2"
                              onClick={() => navigate(`/members/view/${m.id}`)}
                            >
                              View
                            </Button>

                            <Button
                              size="sm"
                              color="success"
                              className="me-2"
                              onClick={() => navigate(`/members/edit/${m.id}`)}
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => handleDelete(m.id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer/>
    </div>
  );
};

export default MemberList;
