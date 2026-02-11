import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { APIClient } from "../../helpers/api_helper";
import {
  Card,
  CardBody,
  Button,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Container,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= API ================= */
const api = new APIClient();

/* ================= COMPONENT ================= */
const AddMenu: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      alert("All fields are required");
      return;
    }

    try {
      await api.create("/api/admin/menus", formData);
      toast.success("Menu created successfully");
      setTimeout(() => {
        navigate(`/menu/${formData.location}`);
      }, 1500);
    } catch (error) {
      console.error("ADD MENU ERROR 👉", error);
      toast.error("Failed to create menu");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <CardBody>
                <h4 className="mb-4">Add Menu</h4>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>Menu Name</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Header Menu / Footer Menu"
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Menu Location</Label>
                        <Input
                          type="select"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                        >
                          <option value="">Select location</option>
                          <option value="header">Header</option>
                          <option value="footer">Footer</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Create Menu
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer />

    </div>
  );
};

export default AddMenu;
