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
      .get("/api/members")
      .then((res: any) => {
        let list: Member[] = [];

        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;

        setMembers(list);
      })
      .catch(() => {
        alert("Failed to load members ❌");
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

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      const payload = new FormData();
      payload.append("_method", "DELETE");

      await api.create(`/api/members/${id}`, payload);

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch {
      alert("Delete failed ❌");
    }
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} selected members?`))
      return;

    try {
      setBulkDeleting(true);

      for (const id of selectedIds) {
        const payload = new FormData();
        payload.append("_method", "DELETE");
        await api.create(`/api/members/${id}`, payload);
      }

      setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
    } catch {
      alert("Bulk delete failed ❌");
    } finally {
      setBulkDeleting(false);
    }
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
    </div>
  );
};

export default MemberList;
