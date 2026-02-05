// import { profileSuccess, profileError } from "./reducer";
// import { APIClient } from "../../../helpers/api_helper";

// const api = new APIClient();

// /* ================= FETCH PROFILE ================= */

// export const fetchProfile = () => async (dispatch: any) => {
//   try {
//     const res: any = await api.get("/api/admin/profile");

//     const stored = JSON.parse(localStorage.getItem("authUser") || "{}");

//     localStorage.setItem(
//       "authUser",
//       JSON.stringify({
//         ...stored,
//         user: res.user,
//       }),
//     );

//     dispatch(profileSuccess(res.user));
//   } catch (error) {
//     dispatch(profileError("Failed to load profile"));
//   }
// };

// /* ================= UPDATE PROFILE ================= */

// export const editProfile = (formData: FormData) => async (dispatch: any) => {
//   try {
//     const res: any = await api.create("/api/admin/profile", formData);

//     const stored = JSON.parse(localStorage.getItem("authUser") || "{}");

//     localStorage.setItem(
//       "authUser",
//       JSON.stringify({
//         ...stored,
//         user: res.user,
//       }),
//     );

//     dispatch(profileSuccess(res.user));
//   } catch (error) {
//     dispatch(profileError("Profile update failed"));
//   }
// };
import { profileSuccess, profileError } from "./reducer";
import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

/* ================= FETCH PROFILE ================= */

export const fetchProfile = () => async (dispatch: any) => {
  try {
    const res: any = await api.get("/api/admin/profile");

    const stored = JSON.parse(sessionStorage.getItem("authUser") || "{}");

    // ✅ update sessionStorage user
    sessionStorage.setItem(
      "authUser",
      JSON.stringify({
        ...stored,
        user: res.user,
      }),
    );

    dispatch(profileSuccess(res.user));
  } catch (error) {
    dispatch(profileError("Failed to load profile"));
  }
};

/* ================= UPDATE PROFILE ================= */

export const editProfile = (formData: FormData) => async (dispatch: any) => {
  try {
    const res: any = await api.create("/api/admin/profile", formData);

    const stored = JSON.parse(sessionStorage.getItem("authUser") || "{}");

    // ✅ update sessionStorage user
    sessionStorage.setItem(
      "authUser",
      JSON.stringify({
        ...stored,
        user: res.user,
      }),
    );

    dispatch(profileSuccess(res.user));
  } catch (error) {
    dispatch(profileError("Profile update failed"));
  }
};
