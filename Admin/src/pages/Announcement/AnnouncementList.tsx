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

interface Announcement {
  id: number;
  title: string;
  description?: string | null;
  link?: string | null;
  end_date: string;
  photo_url?: string | null;
}

const AnnouncementList: React.FC = () => {
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  /* ================= LOAD ================= */

  useEffect(() => {
    api
      .get("/api/admin/announcements")
      .then((res: any) => {
        let list: Announcement[] = [];

        if (Array.isArray(res)) list = res;
        else if (Array.isArray(res?.data)) list = res.data;
        else if (Array.isArray(res?.data?.data)) list = res.data.data;
        else if (Array.isArray(res?.announcements)) list = res.announcements;

        setAnnouncements(list);
      })
      .catch((error: any) => {
        toast.error(
          error?.data?.message ||
          error?.message ||
          "Failed to load announcements ❌"
        );
        setAnnouncements([]);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= SEARCH ================= */

  const filteredAnnouncements = useMemo(() => {
    if (!search) return announcements;
    return announcements.filter((a) =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [announcements, search]);

  /* ================= CHECKBOX ================= */

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAnnouncements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAnnouncements.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

const handleDelete = (id: number) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this announcement?</p>
        <div className="d-flex justify-content-end gap-2 mt-2">
          <Button
            size="sm"
            color="secondary"
            onClick={() => {
              toast.dismiss();
            }}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            color="danger"
            onClick={async () => {
              try {
                await api.delete(`/api/admin/announcements/${id}`);

                setAnnouncements((prev) =>
                  prev.filter((a) => a.id !== id)
                );

                setSelectedIds((prev) =>
                  prev.filter((x) => x !== id)
                );

                toast.dismiss();
                toast.success("Announcement deleted successfully ✅");
              } catch (error: any) {
                toast.dismiss();
                toast.error(
                  error?.data?.message || "Delete failed ❌"
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
    ({ closeToast }) => (
      <div>
        <p>
          Delete {selectedIds.length} selected announcements?
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
                  selectedIds.map((id) =>
                    api.delete(`/api/admin/announcements/${id}`)
                  )
                );

                setAnnouncements((prev) =>
                  prev.filter((a) => !selectedIds.includes(a.id))
                );

                setSelectedIds([]);

                toast.dismiss();
                toast.success("Bulk delete successful ✅");
              } catch (error: any) {
                toast.dismiss();
                toast.error(
                  error?.data?.message ||
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
          <span className="ms-2">Loading announcements...</span>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="mb-0">Announcements</h4>
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
                      onClick={() => navigate("/announcements/create")}
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

                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>
                          <Input
                            type="checkbox"
                            checked={
                              filteredAnnouncements.length > 0 &&
                              selectedIds.length ===
                                filteredAnnouncements.length
                            }
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th>ID</th>
                        <th>Title</th>
                        <th>End Date</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAnnouncements.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No announcements found
                          </td>
                        </tr>
                      )}

                      {filteredAnnouncements.map((a) => (
                        <tr key={a.id}>
                          <td>
                            <Input
                              type="checkbox"
                              checked={selectedIds.includes(a.id)}
                              onChange={() => toggleSelectOne(a.id)}
                            />
                          </td>

                          <td>#{a.id}</td>
                          <td>{a.title}</td>
                          <td>
                            {new Date(a.end_date).toLocaleDateString()}
                          </td>

                          <td className="text-end">
                            <Button
                              size="sm"
                              color="success"
                              className="me-2"
                              onClick={() =>
                                navigate(`/announcements/edit/${a.id}`)
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              color="danger"
                              onClick={() => handleDelete(a.id)}
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

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AnnouncementList;