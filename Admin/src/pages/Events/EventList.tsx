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

/* ================= TYPES ================= */

interface EventItem {
  id: number;
  title: string;
  end_date: string;
  status: "upcoming" | "recent" | "past";
  photo_url?: string | null;
}

/* ================= STATUS UI CONFIG ================= */

const statusUI = {
  upcoming: { label: "UPCOMING", className: "badge-soft-info" },
  recent: { label: "RECENT", className: "badge-soft-success" },
  past: { label: "PAST", className: "badge-soft-danger" },
};

/* ================= COMPONENT ================= */

const EventList = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  /* ================= FETCH ================= */

  const fetchEvents = async () => {
    try {
      const res: any = await api.get("/api/admin/events");

      const all = [
        ...(res.upcoming || []),
        ...(res.recent || []),
        ...(res.past || []),
      ].sort(
        (a: EventItem, b: EventItem) =>
          new Date(b.end_date).getTime() - new Date(a.end_date).getTime(),
      );

      setEvents(all);
    } catch {
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH ================= */

  const filteredEvents = useMemo(() => {
    if (!search) return events;
    return events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [events, search]);

  /* ================= CHECKBOX ================= */

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredEvents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEvents.map((e) => e.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  /* ================= SINGLE DELETE ================= */

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setDeletingId(id);
      await api.delete(`/api/admin/events/${id}`);
      setEvents((prev) => prev.filter((e) => e.id !== id));
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
        `Delete ${selectedIds.length} selected events permanently?`,
      )
    )
      return;

    try {
      setBulkDeleting(true);

      // sequential delete (safe)
      for (const id of selectedIds) {
        await api.delete(`/api/admin/events/${id}`);
      }

      setEvents((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
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
          <span className="ms-2">Loading events...</span>
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
                  <h5 className="mb-0">Events</h5>

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

                  <Link to="/events/create">
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
                              filteredEvents.length > 0 &&
                              selectedIds.length === filteredEvents.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>ID</th>
                        <th className="text-center">Image</th>
                        <th>Title</th>
                        <th>End Date</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEvents.map((e) => (
                        <tr key={e.id}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedIds.includes(e.id)}
                              onChange={() => toggleSelectOne(e.id)}
                            />
                          </td>

                          <td>#{e.id}</td>

                          <td className="text-center">
                            {e.photo_url ? (
                              <img
                                src={e.photo_url}
                                alt=""
                                className="rounded"
                                style={{
                                  width: 40,
                                  height: 40,
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "—"
                            )}
                          </td>

                          <td>{e.title}</td>
                          <td>{new Date(e.end_date).toLocaleDateString()}</td>

                          <td>
                            <span
                              className={`badge ${
                                statusUI[e.status].className
                              } text-uppercase`}
                              style={{
                                fontSize: "11px",
                                fontWeight: 600,
                                padding: "6px 10px",
                                borderRadius: "6px",
                              }}
                            >
                              {statusUI[e.status].label}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="text-end">
                            <Link
                              to={`/events/view/${e.id}`}
                              className="btn btn-light btn-sm me-2"
                            >
                              View
                            </Link>

                            <Link
                              to={`/events/edit/${e.id}`}
                              className="btn btn-success btn-sm me-2"
                            >
                              Edit
                            </Link>

                            <Button
                              color="danger"
                              size="sm"
                              disabled={deletingId === e.id}
                              onClick={() => handleDelete(e.id)}
                            >
                              {deletingId === e.id ? "Deleting..." : "Remove"}
                            </Button>
                          </td>
                        </tr>
                      ))}

                      {filteredEvents.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            No events found
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

export default EventList;
