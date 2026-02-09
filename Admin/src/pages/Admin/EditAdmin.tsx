import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

/* ================= TYPES ================= */

interface AdminType {
  id: number;
  name: string;
  email: string;
  role_id: number;
  created_at: string;
}

const EditAdmin = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<AdminType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("1");

  /* ================= LOAD ADMIN ================= */

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    api
      .get(`/api/admin/admins/${id}`) // ✅ MATCHES BACKEND ROUTE
      .then((res: any) => {
        const data = res?.data ?? res;

        if (!data || !data.id) {
          setAdmin(null);
          return;
        }

        setAdmin(data);
        setName(data.name);
        setEmail(data.email);
        setRoleId(String(data.role_id));
      })
      .catch(() => setAdmin(null))
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= UPDATE ADMIN ================= */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setSaving(true);

    const payload: any = {
      name,
      email,
      role_id: roleId,
    };

    // ✅ Only send password if user entered one
    if (password.trim()) {
      payload.password = password;
    }

    api
      .update(`/api/admin/admins/${id}`, payload)
      .then(() => {
        alert("Admin updated successfully ✅");
        navigate("/admins");
      })
      .catch(() => {
        alert("Failed to update admin ❌");
      })
      .finally(() => setSaving(false));
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="page-content">
        <div className="d-flex justify-content-center align-items-center mt-5">
          <Spinner />
          <span className="ms-2">Loading admin...</span>
        </div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="page-content">
        <div className="text-center mt-5 text-muted">
          Admin not found
        </div>
      </div>
    );
  }

  /* ================= FORM ================= */

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={10}>
            <Card className="border-0 shadow-sm">
              <CardBody>
                <div className="border-bottom pb-3 mb-4">
                  <h4 className="mb-1 fw-semibold">Edit Role</h4>
                  <p className="text-muted mb-0">
                    Update role details
                  </p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    {/* NAME */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Name</Label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* EMAIL */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">Email</Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </FormGroup>
                    </Col>

                    {/* PASSWORD (OPTIONAL) */}
                    <Col lg={6}>
                      <FormGroup className="mb-3">
                        <Label className="fw-semibold">
                          New Password (optional)
                        </Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Leave blank to keep current password"
                        />
                      </FormGroup>
                    </Col>

                    {/* ROLE */}
                    <Col lg={4}>
                      <FormGroup className="mb-4">
                        <Label className="fw-semibold">Role</Label>
                        <Input
                          type="select"
                          value={roleId}
                          onChange={(e) => setRoleId(e.target.value)}
                        >
                          <option value="1">Admin</option>
                          <option value="2">Editor</option>
                          <option value="3">Secretary</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {/* ACTIONS */}
                    <Col xs={12}>
                      <div className="d-flex gap-2">
                        <Button
                          color="secondary"
                          outline
                          type="button"
                          onClick={() => navigate(-1)}
                        >
                          Cancel
                        </Button>

                        <Button color="primary" disabled={saving}>
                          {saving ? "Saving..." : "Update Role"}
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EditAdmin;
