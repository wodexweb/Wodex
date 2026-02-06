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
} from "reactstrap";

/* ================= API ================= */
const api = new APIClient();

/* ================= TYPES ================= */
interface SettingsForm {
  system_name: string;
  application_title: string;
  website_title: string;
  website_description: string;
  website_keywords: string;
  website_url: string;
  site_copyright: string;
  website_logo: File | null;
  admin_logo: File | null;
}

interface PreviewState {
  website_logo: string;
  admin_logo: string;
}

/* ================= COMPONENT ================= */
const Settings: React.FC = () => {
  const [formData, setFormData] = useState<SettingsForm>({
    system_name: "",
    application_title: "",
    website_title: "",
    website_description: "",
    website_keywords: "",
    website_url: "",
    site_copyright: "",
    website_logo: null,
    admin_logo: null,
  });

  const [preview, setPreview] = useState<PreviewState>({
    website_logo: "",
    admin_logo: "",
  });

  /* ================= FETCH EXISTING DATA ================= */
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res: any = await api.get("/api/admin/settings");
      // ✅ handle both response shapes
      const data = res.data ?? res;

      if (!data) return;

      setFormData((prev) => ({
        ...prev,
        system_name: data.system_name ?? "",
        application_title: data.application_title ?? "",
        website_title: data.website_title ?? "",
        website_description: data.website_description ?? "",
        website_keywords: data.website_keywords ?? "",
        website_url: data.website_url ?? "",
        site_copyright: data.site_copyright ?? "",
      }));

      setPreview({
        website_logo: data.website_logo
          ? `${process.env.REACT_APP_API_URL}/storage/${data.website_logo}`
          : "",
        admin_logo: data.admin_logo
          ? `${process.env.REACT_APP_API_URL}/storage/${data.admin_logo}`
          : "",
      });
    } catch (error) {
      console.error("FETCH SETTINGS ERROR 👉", error);
    }
  };
  /* ================= HANDLERS ================= */
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));

      setPreview((prev) => ({
        ...prev,
        [name]: URL.createObjectURL(files[0]),
      }));
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          payload.append(key, value as any);
        }
      });

      await api.create("/api/admin/settings", payload);
      alert("Settings updated successfully");
      fetchSettings();
    } catch (error) {
      console.error("UPDATE SETTINGS ERROR 👉", error);
      alert("Failed to update settings");
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
                <h4 className="mb-4">System Settings</h4>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label>System Name</Label>
                        <Input
                          name="system_name"
                          value={formData.system_name}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Application Title</Label>
                        <Input
                          name="application_title"
                          value={formData.application_title}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Website Title</Label>
                        <Input
                          name="website_title"
                          value={formData.website_title}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Website URL</Label>
                        <Input
                          name="website_url"
                          value={formData.website_url}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup>
                        <Label>Website Description</Label>
                        <Input
                          type="textarea"
                          name="website_description"
                          value={formData.website_description}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={12}>
                      <FormGroup>
                        <Label>Website Keywords</Label>
                        <Input
                          name="website_keywords"
                          value={formData.website_keywords}
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Website Logo</Label>
                        {preview.website_logo && (
                          <div className="mb-2">
                            <img
                              src={preview.website_logo}
                              height={50}
                              alt="Website Logo"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          name="website_logo"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup>
                        <Label>Admin Logo</Label>
                        {preview.admin_logo && (
                          <div className="mb-2">
                            <img
                              src={preview.admin_logo}
                              height={50}
                              alt="Admin Logo"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          name="admin_logo"
                          onChange={handleFileChange}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Button color="primary" type="submit" className="mt-3">
                    Update Settings
                  </Button>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;
