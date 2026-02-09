import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Row,
  Spinner,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const AddAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "1",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.create("/api/admin/admins", formData);
      alert("Role created successfully ✅");
      navigate("/admins");
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row className="justify-content-center">
          <Col xl={12} lg={11}>
            <Card className="shadow-sm">
              <CardBody className="p-4 p-lg-5">
                <h4 className="mb-4 border-bottom pb-3">Create New Role</h4>

                <Form onSubmit={handleSubmit}>
                  {/* ROW 1 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Full Name</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Email Address</Label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 2 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Password</Label>
                        <Input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Role</Label>
                        <Input
                          type="select"
                          name="role_id"
                          value={formData.role_id}
                          onChange={handleChange}
                        >
                          <option value="1">Admin</option>
                          <option value="2">Editor</option>
                          <option value="3">Secretary</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* SUBMIT */}
                  <div className="text-center mt-4">
                    <Button color="primary" disabled={loading}>
                      {loading && <Spinner size="sm" className="me-2" />}
                      Create Role
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AddAdmin;
