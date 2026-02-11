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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = new APIClient();

/* ================= TYPES ================= */

interface PageItem {
  id: number;
  title: string;
  slug: string;
  status: "published" | "draft";
  created_at: string;
}

/* ================= STATUS UI ================= */

const statusUI = {
  published: { label: "PUBLISHED", className: "badge-soft-success" },
  draft: { label: "DRAFT", className: "badge-soft-warning" },
};

/* ================= COMPONENT ================= */

const ManagePages = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  /* ================= FETCH ================= */

  const fetchPages = async () => {
    try {
      const res: any = await api.get("/api/admin/pages");
      setPages(res || []);
    } catch {
      toast.error("Failed to load pages");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */

  const filteredPages = useMemo(() => {
    if (!search) return pages;
    return pages.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [pages, search]);

  /* ================= CHECKBOX ================= */

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredPages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPages.map((p) => p.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/pages/${id}`);
      setPages((prev) => prev.filter((p) => p.id !== id));
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
        `Delete ${selectedIds.length} selected pages permanently?`,
      )
    )
      return;

    try {
      setBulkDeleting(true);

      for (const id of selectedIds) {
        await api.delete(`/api/pages/${id}`);
      }

      setPages((prev) => prev.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } catch {
      toast.error("Bulk delete failed");
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
          <span className="ms-2">Loading pages...</span>
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
                  <h5 className="mb-0">Pages</h5>

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

                  <Link to="/pages/add">
                    <Button color="success" size="md">
                      + Add
                    </Button>
                  </Link>

                  <Input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ width: 200 }}
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
                              filteredPages.length > 0 &&
                              selectedIds.length === filteredPages.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPages.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedIds.includes(p.id)}
                              onChange={() => toggleSelectOne(p.id)}
                            />
                          </td>

                          <td>#{p.id}</td>
                          <td>{p.title}</td>
                          <td>/{p.slug}</td>

                          <td>
                            <span
                              className={`badge ${
                                statusUI[p.status].className
                              } text-uppercase`}
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "6px 10px",
                                borderRadius: "6px",
                              }}
                            >
                              {statusUI[p.status].label}
                            </span>
                          </td>

                          <td>{new Date(p.created_at).toLocaleDateString()}</td>

                          {/* ACTIONS */}
                          <td className="text-end">
                            <Link
                              to={`/pages/view/${p.id}`}
                              className="btn btn-light btn-sm me-2"
                            >
                              View
                            </Link>

                            <Link
                              to={`/pages/edit/${p.id}`}
                              className="btn btn-success btn-sm me-2"
                            >
                              Edit
                            </Link>

                            <Button
                              color="danger"
                              size="sm"
                              disabled={deletingId === p.id}
                              onClick={() => handleDelete(p.id)}
                            >
                              {deletingId === p.id ? "Deleting..." : "Remove"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredPages.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No pages found
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
      <ToastContainer/>
    </div>
  );
};

export default ManagePages;
