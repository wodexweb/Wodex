import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Input,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

/* ================= ROLE LABEL ================= */

const roleLabel = (id: number) => {
  if (id === 1) return "ADMIN";
  if (id === 2) return "EDITOR";
  return "SECRETARY";
};

/* ================= COMPONENT ================= */

const AdminList = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* ================= FETCH ================= */

  const fetchAdmins = async () => {
    try {
      const res: any = await api.get("/api/admins");
      setAdmins(res || []);
    } catch {
      alert("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */

  const filteredAdmins = useMemo(() => {
    if (!search) return admins;
    return admins.filter(
      (a) =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()),
    );
  }, [admins, search]);

  /* ================= CHECKBOX ================= */

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAdmins.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAdmins.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this admin permanently?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/admins/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch (err) {
      alert(err || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  /* ================= BULK DELETE ================= */

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Delete ${selectedIds.length} selected admins permanently?`,
      )
    )
      return;

    try {
      setBulkDeleting(true);

      for (const id of selectedIds) {
        await api.delete(`/api/admins/${id}`);
      }

      setAdmins((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
      setSelectedIds([]);
    } catch {
      alert("Bulk delete failed");
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
          <span className="ms-2">Loading Roles...</span>
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
            <Card>
              {/* ================= HEADER ================= */}
              <CardHeader className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-0">Admins</h5>

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

                  <Link to="/admins/create">
                    <Button color="success">+ Add</Button>
                  </Link>

                  <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 220 }}
                  />
                </div>
              </CardHeader>

              {/* ================= TABLE ================= */}
              <CardBody className="p-0">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>
                          <Input
                            type="checkbox"
                            checked={
                              filteredAdmins.length > 0 &&
                              selectedIds.length === filteredAdmins.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Created</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAdmins.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedIds.includes(a.id)}
                              onChange={() => toggleSelectOne(a.id)}
                            />
                          </td>

                          <td>#{a.id}</td>
                          <td>{a.name}</td>
                          <td>{a.email}</td>

                          <td>
                            <span
                              className="badge badge-soft-primary text-uppercase"
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "6px 10px",
                                borderRadius: "6px",
                              }}
                            >
                              {roleLabel(a.role_id)}
                            </span>
                          </td>

                          <td>
                            {new Date(a.created_at).toLocaleDateString()}
                          </td>

                          {/* ACTIONS */}
                          <td className="text-end">
                            <Link
                              to={`/admins/edit/${a.id}`}
                              className="btn btn-success btn-sm me-2"
                            >
                              Edit
                            </Link>

                            <Button
                              color="danger"
                              size="sm"
                              disabled={deletingId === a.id}
                              onClick={() => handleDelete(a.id)}
                            >
                              {deletingId === a.id
                                ? "Deleting..."
                                : "Remove"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredAdmins.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No Roles found
                          </td>
                        </tr>
                      )}
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

export default AdminList;
