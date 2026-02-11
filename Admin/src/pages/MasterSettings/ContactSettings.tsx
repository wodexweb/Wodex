import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
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
  Spinner,
} from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api = new APIClient();

/* ================= TYPES ================= */

interface ContactSettingsForm {
  contact_number: string;
  contact_number_1: string;
  whatsapp_number: string;
  email: string;
  working_hours: string;
  address: string;
  google_map_link: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  linkedin_url: string;
  x_url: string;
  custom_url: string;
}

/* ================= COMPONENT ================= */

const ContactSettings: React.FC = () => {
  const [formData, setFormData] = useState<ContactSettingsForm | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api
      .get("/api/admin/contact-settings")
      .then((res: any) => {
        // supports both wrapped & direct responses
        const data = res?.data ?? res;

        setFormData({
          contact_number: data?.contact_number ?? "",
          contact_number_1: data?.contact_number_1 ?? "",
          whatsapp_number: data?.whatsapp_number ?? "",
          email: data?.email ?? "",
          working_hours: data?.working_hours ?? "",
          address: data?.address ?? "",
          google_map_link: data?.google_map_link ?? "",
          facebook_url: data?.facebook_url ?? "",
          instagram_url: data?.instagram_url ?? "",
          youtube_url: data?.youtube_url ?? "",
          linkedin_url: data?.linkedin_url ?? "",
          x_url: data?.x_url ?? "",
          custom_url: data?.custom_url ?? "",
        });
      })
      .catch(() =>
        setFormData({
          contact_number: "",
          contact_number_1: "",
          whatsapp_number: "",
          email: "",
          working_hours: "",
          address: "",
          google_map_link: "",
          facebook_url: "",
          instagram_url: "",
          youtube_url: "",
          linkedin_url: "",
          x_url: "",
          custom_url: "",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  /* ================= HANDLERS ================= */

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "").slice(0, 10);

    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      await api.create("/api/admin/contact-settings", formData);
      toast.success("Contact settings updated successfully");
    } catch (error: any) {
      console.error("CONTACT SETTINGS ERROR 👉", error);
      toast.error("Failed to update contact settings");
    }
  };

  /* ================= UI ================= */

  return (
    <div className="page-content">
      <Container fluid>
        {loading && (
          <div className="d-flex justify-content-center py-5">
            <Spinner color="primary" />
          </div>
        )}

        {!loading && formData && (
          <Row className="justify-content-center">
            <Col xl={12}>
              <Card>
                <CardBody>
                  <h4 className="mb-4">Contact Settings</h4>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Contact Number</Label>
                          <Input
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handlePhoneChange}
                            inputMode="numeric"
                            maxLength={10}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Contact Number 2</Label>
                          <Input
                            name="contact_number_1"
                            value={formData.contact_number_1}
                            onChange={handlePhoneChange}
                            inputMode="numeric"
                            maxLength={10}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>WhatsApp Number</Label>
                          <Input
                            name="whatsapp_number"
                            value={formData.whatsapp_number}
                            onChange={handlePhoneChange}
                            inputMode="numeric"
                            maxLength={10}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Email</Label>
                          <Input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Working Hours</Label>
                          <Input
                            name="working_hours"
                            value={formData.working_hours}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Google Map Link</Label>
                          <Input
                            name="google_map_link"
                            value={formData.google_map_link}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={12}>
                        <FormGroup>
                          <Label>Address</Label>
                          <Input
                            type="textarea"
                            rows={3}
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Facebook URL</Label>
                          <Input
                            name="facebook_url"
                            value={formData.facebook_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Instagram URL</Label>
                          <Input
                            name="instagram_url"
                            value={formData.instagram_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>YouTube URL</Label>
                          <Input
                            name="youtube_url"
                            value={formData.youtube_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>LinkedIn URL</Label>
                          <Input
                            name="linkedin_url"
                            value={formData.linkedin_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>X (Twitter) URL</Label>
                          <Input
                            name="x_url"
                            value={formData.x_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label>Custom URL</Label>
                          <Input
                            name="custom_url"
                            value={formData.custom_url}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <Button color="primary" type="submit">
                        Update Settings
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
      <ToastContainer />

    </div>
  );
};

export default ContactSettings;
