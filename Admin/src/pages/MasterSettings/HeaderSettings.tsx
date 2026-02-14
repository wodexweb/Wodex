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
import { SketchPicker } from "react-color";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= API ================= */
const api = new APIClient();

/* ================= TYPES ================= */

interface HeaderSettingsForm {
  header_title: string;
  drive_link: string;
  title_color: string;
  showPicker: boolean;
}

/* ================= COMPONENT ================= */

const HeaderSettings: React.FC = () => {
  const [formData, setFormData] = useState<HeaderSettingsForm | null>(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    api
      .get("/api/admin/header")
      .then((res: any) => {
        // supports both wrapped & direct responses
        const data = res?.data ?? res;

        setFormData({
          header_title: data?.header_title ?? "",
          drive_link: data?.drive_link ?? "",
          title_color: data?.title_color ?? "#000000",
          showPicker: false,
        });
      })
      .catch(() =>
        setFormData({
          header_title: "",
          drive_link: "",
          title_color: "#000000",
          showPicker: false,
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!formData) return;

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const payload = {
        header_title: formData.header_title,
        drive_link: formData.drive_link,
        title_color: formData.title_color,
      };

      await api.create("/api/admin/header", payload);
      toast.success("Header settings updated successfully");
    } catch (error: any) {
      console.error("HEADER SETTINGS ERROR 👉", error);
      toast.error("Failed to update header settings");
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
                  <h4 className="mb-4">Header Settings</h4>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* Header Title */}
                      <Col md={6}>
                        <FormGroup>
                          <Label>Header Title</Label>
                          <Input
                            name="header_title"
                            value={formData.header_title}
                            onChange={handleChange}
                            placeholder="Top bar / header text"
                          />
                        </FormGroup>
                      </Col>

                      {/* Drive Link */}
                      <Col md={6}>
                        <FormGroup>
                          <Label>Drive Link</Label>
                          <Input
                            name="drive_link"
                            value={formData.drive_link}
                            onChange={handleChange}
                            placeholder="https://drive.google.com/..."
                          />
                        </FormGroup>
                      </Col>

                      {/* Title Color */}
                      <Col md={6}>
                        <FormGroup>
                          <Label>Title Color</Label>

                          <div className="d-flex align-items-center gap-2">
                            <Input
                              name="title_color"
                              value={formData.title_color}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title_color: e.target.value,
                                })
                              }
                              placeholder="#000000"
                            />

                            <div
                              onClick={() =>
                                setFormData({
                                  ...formData,
                                  showPicker: !formData.showPicker,
                                })
                              }
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 6,
                                backgroundColor: formData.title_color,
                                cursor: "pointer",
                                border: "1px solid #ced4da",
                              }}
                            />
                          </div>

                          {formData.showPicker && (
                            <div
                              style={{
                                position: "relative",
                                marginTop: 10,
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: 20,
                                }}
                              >
                                <SketchPicker
                                  color={formData.title_color}
                                  onChangeComplete={(color: { hex: string }) =>
                                    setFormData({
                                      ...formData,
                                      title_color: color.hex,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <Button color="primary" type="submit">
                        Update Header Settings
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

export default HeaderSettings;
