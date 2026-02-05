import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import avatarFallback from "../../assets/images/users/user-dummy-img.jpg";
import { editProfile, fetchProfile } from "../../slices/auth/profile/thunk";
import { clearProfileStatus } from "../../slices/auth/profile/reducer";

const UserProfile = () => {
  const dispatch: any = useDispatch();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const hasChangesRef = useRef(false);

  const selectProfile = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      user: profile.user,
      success: profile.success,
      error: profile.error,
    }),
  );

  const { user, success, error } = useSelector(selectProfile);

  useEffect(() => {
    if (!user) dispatch(fetchProfile());
  }, [dispatch, user]);

  useEffect(() => {
    if (success || error) {
      const t = setTimeout(() => dispatch(clearProfileStatus()), 2500);
      return () => clearTimeout(t);
    }
  }, [success, error, dispatch]);

  useEffect(() => {
    if (success) {
      setAvatarFile(null);
      setAvatarPreview(null);
      hasChangesRef.current = false;
    }
  }, [success]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
    }),
    onSubmit: (values) => {
      const formData = new FormData();
      let changed = false;

      if (values.name !== user?.name) {
        formData.append("name", values.name);
        changed = true;
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
        changed = true;
      }

      if (!changed) return;
      hasChangesRef.current = true;
      dispatch(editProfile(formData));
    },
  });

  document.title = "Profile | Admin Panel";

  return (
    <div className="page-content mt-lg-5">
      <Container fluid style={{ maxWidth: 1100 }}>
        {error && <Alert color="danger">{error}</Alert>}
        {success && hasChangesRef.current && (
          <Alert color="success">Profile updated successfully</Alert>
        )}

        {/* PROFILE CARD */}
        <Card
          style={{
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            marginBottom: 30,
            animation: "fadeIn 0.6s ease",
          }}
        >
          <CardBody
            style={{
              display: "flex",
              alignItems: "center",
              gap: 30,
              flexWrap: "wrap",
            }}
          >
            {/* AVATAR */}
            <div style={{ position: "relative" }}>
              <img
                src={
                  avatarPreview ||
                  (user?.avatar
                    ? `${user.avatar}?t=${Date.now()}`
                    : avatarFallback)
                }
                alt="avatar"
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 22,
                  objectFit: "cover",
                  transition: "all .3s ease",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "center",
                  marginTop: 14,
                }}
              >
                <Button
                  size="sm"
                  color="dark"
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                >
                  {user?.avatar ? "Update Image" : "Set Image"}
                </Button>

                <Button
                  size="sm"
                  color="secondary"
                  outline
                  onClick={() =>
                    document.getElementById("avatarInput")?.click()
                  }
                >
                  Choose
                </Button>

                <Input
                  id="avatarInput"
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>

            {/* INFO */}
            <div style={{ flex: 1 }}>
              <h2 style={{ fontWeight: 600, marginBottom: 6 }}>{user?.name}</h2>
              <p style={{ margin: 0, color: "#6c757d" }}>{user?.email}</p>
            </div>
          </CardBody>
        </Card>

        {/* EDIT FORM */}
        <Card
          style={{
            borderRadius: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
          }}
        >
          <CardBody>
            <h5 style={{ marginBottom: 20 }}>Edit Profile</h5>

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
              }}
            >
              <div className="mb-3">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={validation.values.name}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={Boolean(
                    validation.touched.name && validation.errors.name,
                  )}
                />
                <FormFeedback>
                  {typeof validation.errors.name === "string"
                    ? validation.errors.name
                    : ""}
                </FormFeedback>
              </div>

              <div className="mb-4">
                <Label>Email</Label>
                <p className="form-control-plaintext">
                  {validation.values.email}
                </p>
              </div>

              <div style={{ textAlign: "right" }}>
                <Button color="primary" size="md">
                  Update Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>

      {/* SIMPLE ANIMATION */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default UserProfile;
