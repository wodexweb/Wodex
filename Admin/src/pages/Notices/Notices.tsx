import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Card, CardBody, Col, Container, Form, FormGroup, Input,
  Label, Button, Row, Table, Badge, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const Notices = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // --- NEW STATE FOR CHECKBOXES ---
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    notice_title: "",
    notice_description: "",
    publish_date: "",
    visibility: "public",
    status: "active",
  });

  const fetchNotices = useCallback(async () => {
    try {
      const response: any = await api.get("api/admin/notices");
      
      // FIX: Check for the 'data' property in the response object
      if (response && response.data) {
        setNotices(response.data);
      } else if (Array.isArray(response)) {
        setNotices(response);
      }
    } catch (error: any) {
      console.error("Fetch Error:", error.response?.data || error.message);
    }
  }, []);

  useEffect(() => { fetchNotices(); }, [fetchNotices]);

  // --- CHECKBOX LOGIC ---
  const handleSelectAll = (e: any) => {
    if (e.target.checked) {
      const allIds = notices.map((item) => item.id);
      setSelectedNotices(allIds);
    } else {
      setSelectedNotices([]);
    }
  };

  const handleSelectItem = (id: number) => {
    if (selectedNotices.includes(id)) {
      setSelectedNotices(selectedNotices.filter((item) => item !== id));
    } else {
      setSelectedNotices([...selectedNotices, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedNotices.length} notices?`)) {
      try {
        // Option 1: Loop through and delete (Simple)
        // Option 2: Create a bulk delete endpoint in Laravel (Better performance)
        await Promise.all(selectedNotices.map(id => api.delete(`api/admin/notices/${id}`)));
        
        alert("Selected notices deleted successfully");
        setSelectedNotices([]);
        fetchNotices();
      } catch (error) {
        alert("Error during bulk delete");
      }
    }
  };

  // --- FORM LOGIC ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusToggle = async (item: any) => {
    const newStatus = item.status === "active" ? "inactive" : "active";
    try {
      await api.update(`api/admin/notices/${item.id}`, { 
        ...item, 
        status: newStatus,
        _method: "PUT" 
      });
      fetchNotices();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => payload.append(key, value));
      if (fileRef.current?.files?.[0]) payload.append("attachment", fileRef.current.files[0]);

      if (isEditing && selectedId) {
        payload.append("_method", "PUT");
        await api.create(`api/admin/notices/${selectedId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.create("api/admin/notices", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      alert("Success!");
      resetForm();
      fetchNotices();
    } catch (error: any) {
      alert("Server Error 500: Check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ notice_title: "", notice_description: "", publish_date: "", visibility: "public", status: "active" });
    setIsEditing(false);
    setSelectedId(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleEdit = (item: any) => {
    setIsEditing(true);
    setSelectedId(item.id);
    setFormData({
      notice_title: item.notice_title,
      notice_description: item.notice_description,
      publish_date: item.publish_date,
      visibility: item.visibility,
      status: item.status,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure?")) {
      try {
        await api.delete(`api/admin/notices/${id}`);
        fetchNotices();
      } catch (error) {
        alert("Delete failed");
      }
    }
  }

  const filteredNotices = notices.filter(item => 
    item.notice_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={4}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">{isEditing ? "Edit Notice" : "New Notice"}</h4>
                <Form onSubmit={handleSubmit}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input name="notice_title" value={formData.notice_title} onChange={handleChange} required />
                  </FormGroup>
                  <FormGroup>
                    <Label>Description</Label>
                    <Input type="textarea" name="notice_description" rows={3} value={formData.notice_description} onChange={handleChange} required />
                  </FormGroup>
                  <Row>
                    <Col md={6}><FormGroup><Label>Date</Label><Input type="date" name="publish_date" value={formData.publish_date} onChange={handleChange} required /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Status</Label><Input type="select" name="status" value={formData.status} onChange={handleChange}><option value="active">Active</option><option value="inactive">Inactive</option></Input></FormGroup></Col>
                  </Row>
                  <FormGroup>
                    <Label>Visibility</Label>
                    <Input type="select" name="visibility" value={formData.visibility} onChange={handleChange}>
                      <option value="public">Public</option>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </Input>
                  </FormGroup>
                  <FormGroup>
                    <Label>Attachment</Label>
                    <Input type="file" innerRef={fileRef} accept=".pdf,image/*" />
                  </FormGroup>
                  <Button color="primary" type="submit" className="w-100" disabled={loading}>{loading ? "Saving..." : "Save Notice"}</Button>
                  {isEditing && <Button color="soft-secondary" onClick={resetForm} className="w-100 mt-2">Cancel</Button>}
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col xl={8}>
            <Card>
              <CardBody>
                <div className="d-flex align-items-center mb-4">
                  <h4 className="card-title flex-grow-1">Manage Notices</h4>
                  
                  {/* BULK DELETE BUTTON */}
                  {selectedNotices.length > 0 && (
                    <Button color="danger" className="me-2" onClick={handleBulkDelete}>
                      <i className="ri-delete-bin-line me-1"></i> Delete ({selectedNotices.length})
                    </Button>
                  )}
                  
                  <Input type="text" placeholder="Search..." style={{ width: "200px" }} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="table-responsive">
                  <Table className="align-middle table-nowrap mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: "40px" }}>
                          <div className="form-check">
                            <Input 
                              type="checkbox" 
                              className="form-check-input" 
                              onChange={handleSelectAll} 
                              checked={selectedNotices.length === notices.length && notices.length > 0}
                            />
                          </div>
                        </th>
                        <th>ID</th>
                        <th>Notice Details</th>
                        <th>Publish Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotices.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="form-check">
                              <Input 
                                type="checkbox" 
                                className="form-check-input" 
                                checked={selectedNotices.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                              />
                            </div>
                          </td>
                          <td>{item.id}</td>
                          <td>
                            <div className="fw-medium">{item.notice_title}</div>
                            <small className="text-muted">{item.visibility}</small>
                          </td>
                          <td>{item.publish_date}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                                <Badge color={item.status === 'active' ? 'success' : 'danger'}>{item.status}</Badge>
                                <Button 
                                    size="sm" 
                                    color={item.status === 'active' ? 'soft-danger' : 'soft-success'}
                                    onClick={() => handleStatusToggle(item)}
                                >
                                    {item.status === 'active' ? 'Inactivate' : 'Activate'}
                                </Button>
                            </div>
                          </td>
                          <td>
                            <UncontrolledDropdown>
                              <DropdownToggle tag="button" className="btn btn-soft-secondary btn-sm"><i className="ri-more-fill"></i></DropdownToggle>
                              <DropdownMenu end>
                                <DropdownItem onClick={() => handleEdit(item)}>Edit</DropdownItem>
                                <DropdownItem className="text-danger" onClick={() => handleDelete(item.id)}>Delete</DropdownItem>
                                {item.attachment_path && (
                                    <DropdownItem href={`${process.env.REACT_APP_API_URL}/storage/${item.attachment_path}`} target="_blank">View File</DropdownItem>
                                )}
                              </DropdownMenu>
                            </UncontrolledDropdown>
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

export default Notices;