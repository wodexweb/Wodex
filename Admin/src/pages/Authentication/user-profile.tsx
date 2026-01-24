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

  /* ================= LOCAL STATE ================= */
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // 🔥 Track if anything actually changed
  const hasChangesRef = useRef(false);

  /* ================= REDUX ================= */
  const selectProfile = createSelector(
    (state: any) => state.Profile,
    (profile) => ({
      user: profile.user,
      success: profile.success,
      error: profile.error,
    })
  );

  const { user, success, error } = useSelector(selectProfile);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  /* ================= AUTO CLEAR SUCCESS / ERROR ================= */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearProfileStatus());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  /* ================= RESET AVATAR PREVIEW AFTER UPDATE ================= */
  useEffect(() => {
    if (success) {
      setAvatarFile(null);
      setAvatarPreview(null);
      hasChangesRef.current = false; // reset change tracker
    }
  }, [success]);

  /* ================= FORMIK ================= */
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
      let hasChanges = false;

      // name changed
      if (values.name !== user?.name) {
        formData.append("name", values.name);
        hasChanges = true;
      }

      // email changed (even though readonly, still safe)
      if (values.email !== user?.email) {
        formData.append("email", values.email);
        hasChanges = true;
      }

      // avatar changed
      if (avatarFile) {
        formData.append("avatar", avatarFile);
        hasChanges = true;
      }

      // ❌ nothing changed → do nothing
      if (!hasChanges) {
        return;
      }

      hasChangesRef.current = true;
      dispatch(editProfile(formData));
    },
  });

  document.title = "Profile | Admin Panel";

  return (
    <div className="page-content mt-lg-5">
      <Container fluid>
        <Row>
          <Col lg="12">
            {/* ❌ show error always */}
            {error && <Alert color="danger">{error}</Alert>}

            {/* ✅ show success ONLY if something was updated */}
            {success && hasChangesRef.current && (
              <Alert color="success">Profile updated successfully</Alert>
            )}

            {/* PROFILE CARD */}
            <Card>
              <CardBody className="d-flex align-items-center">
                <div className="me-3">
                  <img
                    src={
                      avatarPreview ||
                      (user?.avatar
                        ? `${user.avatar}?t=${Date.now()}`
                        : avatarFallback)
                    }
                    className="avatar-md rounded-circle img-thumbnail"
                    alt="avatar"
                  />
                </div>
                <div>
                  <h5 className="mb-1">{user?.name || "Admin"}</h5>
                  <p className="mb-0 text-muted">{user?.email}</p>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <h4 className="card-title my-4">Edit Profile</h4>

        {/* EDIT FORM */}
        <Card>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
              }}
            >
              {/* NAME */}
              <div className="mb-3">
                <Label>Name</Label>
                <Input
                  name="name"
                  value={validation.values.name}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  invalid={Boolean(
                    validation.touched.name && validation.errors.name
                  )}
                />
                <FormFeedback>
                  {typeof validation.errors.name === "string"
                    ? validation.errors.name
                    : ""}
                </FormFeedback>
              </div>

              {/* EMAIL (READ ONLY) */}
              <div className="mb-3">
                <Label>Email</Label>
                <Input name="email" value={validation.values.email} disabled />
              </div>

              {/* AVATAR */}
              <div className="mb-3">
                <Label>Avatar</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div className="text-center mt-4">
                <Button type="submit" color="primary">
                  Update Profile
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default UserProfile;

// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Card,
//   CardBody,
//   Button,
//   Input,
//   Label,
//   Alert,
//   Form,
// } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// import avatarFallback from "../../assets/images/users/avatar-1.jpg";
// import { fetchProfile, editProfile } from "../../slices/auth/profile/thunk";

// const UserProfile = () => {
//   const dispatch: any = useDispatch();
//   const { user, success, error } = useSelector((s: any) => s.Profile);

//   const [avatarFile, setAvatarFile] = useState<File | null>(null);
//   const [preview, setPreview] = useState<string | null>(null);

//   useEffect(() => {
//     dispatch(fetchProfile());
//   }, [dispatch]);

//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       name: user?.name || "",
//       email: user?.email || "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required(),
//     }),
//     onSubmit: (values) => {
//       const fd = new FormData();
//       fd.append("name", values.name);
//       fd.append("email", values.email);
//       if (avatarFile) fd.append("avatar", avatarFile);
//       dispatch(editProfile(fd));
//     },
//   });

//   return (
//     <Container className="mt-5">
//       {error && <Alert color="danger">{error}</Alert>}
//       {success && <Alert color="success">Profile updated</Alert>}

//       <Card>
//         <CardBody>
//           <img
//             src={
//               preview ||
//               (user?.avatar ? `${user.avatar}?t=${Date.now()}` : avatarFallback)
//             }
//             width={100}
//             className="rounded-circle mb-3"
//             alt="avatar"
//           />

//           <Form onSubmit={formik.handleSubmit}>
//             <Label>Name</Label>
//             <Input
//               name="name"
//               value={formik.values.name}
//               onChange={formik.handleChange}
//             />

//             <Label className="mt-3">Email</Label>
//             <Input value={formik.values.email} disabled />

//             <Label className="mt-3">Avatar</Label>
//             <Input
//               type="file"
//               onChange={(e) => {
//                 const f = e.target.files?.[0];
//                 if (!f) return;
//                 setAvatarFile(f);
//                 setPreview(URL.createObjectURL(f));
//               }}
//             />

//             <Button type="submit" className="mt-4">
//               Update Profile
//             </Button>
//           </Form>
//         </CardBody>
//       </Card>
//     </Container>
//   );
// };

// export default UserProfile;
