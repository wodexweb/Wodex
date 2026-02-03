import React, { useRef, useState } from "react";
import { APIClient } from "../../helpers/api_helper";
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

const api = new APIClient();

/* ================= PREDEFINED OPTIONS ================= */

const POSITIONS = [
  "President",
  "Hon. Secretary",
  "Treasurer",
  "President Elect",
  "Past President",
  "Executive Committee Member",
  "Advisory Board",
];

const CATEGORIES = ["Core Committee", "Executive Committee", "Advisory Council", "General Member"];

/* ================= TYPES ================= */

interface MemberFormData {
  name: string;
  position: string;
  rank: string;
  category: string;
  photo: File | null;
}

const MemberForm: React.FC = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<MemberFormData>({
    name: "",
    position: "", // Will be set by dropdown
    rank: "",
    category: "", // Will be set by dropdown
    photo: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* ================= INPUT CHANGE ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= PHOTO CHANGE ================= */

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("position", formData.position);
      payload.append("rank", formData.rank);
      payload.append("category", formData.category);

      if (formData.photo) {
        payload.append("photo", formData.photo);
      }

      await api.create("/api/members", payload);

      alert("Member added successfully ✅");

      // reset
      setFormData({
        name: "",
        position: "",
        rank: "",
        category: "",
        photo: null,
      });

      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error(err);
      alert("Failed to add member ❌");
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
                <h4 className="mb-4 border-bottom pb-3">Add Member</h4>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Name</Label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Position</Label>
                        {/* ✅ DROPDOWN FOR POSITION */}
                        <Input
                          type="select"
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Position --</option>
                          {POSITIONS.map((pos) => (
                            <option key={pos} value={pos}>
                              {pos}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Rank (Order of Appearance)</Label>
                        <Input
                          type="number"
                          name="rank"
                          placeholder="e.g. 1, 2, 3"
                          value={formData.rank}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Category</Label>
                        {/* ✅ DROPDOWN FOR CATEGORY */}
                        <Input
                          type="select"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Category --</option>
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  {/* PHOTO PREVIEW SECTION */}
                  <Row className="align-items-center mt-3">
                    <Col md={6}>
                      <FormGroup className="mb-3">
                        <Label>Photo</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          innerRef={fileRef}
                          onChange={handlePhotoChange}
                        />
                        <small className="text-muted">Recommended: Square image (1:1)</small>
                      </FormGroup>
                    </Col>

                    <Col md={6} className="text-center">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="rounded-circle border shadow-sm"
                          style={{
                            width: 140,
                            height: 140,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="border rounded-circle d-flex align-items-center justify-content-center text-muted mx-auto"
                          style={{ width: 140, height: 140, background: "#f8f9fa" }}
                        >
                          No image
                        </div>
                      )}
                    </Col>
                  </Row>

                  <div className="text-end mt-4">
                    <Button color="primary" size="lg" disabled={loading} className="px-5">
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" /> Saving...
                        </>
                      ) : (
                        "Save Member"
                      )}
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

export default MemberForm;