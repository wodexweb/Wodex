import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api = new APIClient();

interface Registration {
  id: number;
  name: string;
  surname: string;
  email: string;
  mobile: string;
  city: string;
  status?: "paid" | "pending";
}

const EditRegistration: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH USER ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res: any = await api.get(`/api/registration/${id}`);
        setFormData(res?.data);
      } catch {
        toast.error("Failed to load user ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  /* ================= HANDLE CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= SUBMIT UPDATE ================= */

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!formData) return;

  try {
    setSaving(true);

    await api.put(`/api/registration/${id}`, formData);

    toast.success("User updated successfully ✅");

    // ✅ CORRECT ROUTE
   setTimeout(() => {
  navigate("/users");
}, 1500);

  } catch {
    toast.error("Failed to update user ❌");
  } finally {
    setSaving(false);
  }
};

  /* ================= UI ================= */

  if (loading) {
    return (
      <div className="page-content text-center py-5">
        <Spinner />
      </div>
    );
  }

  return (
  <div className="page-content">
    <Container fluid>
      <Row className="justify-content-center">
        <Col xl={12} lg={11}>
          <Card className="shadow-sm">
            <CardBody className="p-4 p-lg-5">
              <h4 className="mb-4 border-bottom pb-3">
                Edit Registration
              </h4>

              {formData && (
                <Form onSubmit={handleSubmit}>
                  {/* ROW 1 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>First Name</Label>
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
                        <Label>Surname</Label>
                        <Input
                          name="surname"
                          value={formData.surname}
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

                    <Col md={6}>
                      <FormGroup>
                        <Label>Mobile Number</Label>
                        <Input
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* ROW 3 */}
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>City</Label>
                        <Input
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Status</Label>
                        <Input
                          type="select"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Approved</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* SUBMIT BUTTON */}
                  <div className="text-center mt-4">
                    <Button
                      type="submit"
                      color="success"
                      className="px-5"
                      disabled={saving}
                    >
                      {saving && (
                        <Spinner size="sm" className="me-2" />
                      )}
                      Update Registration
                    </Button>

                    <Button
                      type="button"
                      color="light"
                      className="ms-3 px-4"
                      onClick={() => navigate("/User/User")}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
    <ToastContainer/>
  </div>
);
};

export default EditRegistration;