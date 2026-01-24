// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { setAuthorization } from "../helpers/api_helper";

// const AuthProtected = ({ children }: any) => {
//   const location = useLocation();

//   const authUser = sessionStorage.getItem("authUser");
//   const token = authUser ? JSON.parse(authUser)?.token : null;

//   useEffect(() => {
//     if (token) {
//       setAuthorization(token);
//     }
//   }, [token]);

//   // ✅ ALLOW OTP PAGE ALWAYS
//   if (location.pathname === "/verify-otp") {
//     return <>{children}</>;
//   }

//   // ✅ TEMP: DO NOT FORCE LOGIN REDIRECT
//   // (abhi ke liye route lock completely band)
//   return <>{children}</>;
// };

// export default AuthProtected;

import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { setAuthorization } from "../helpers/api_helper";

const AuthProtected = ({ children }: any) => {
  const location = useLocation();

  const authUser = sessionStorage.getItem("authUser");
  const otpEmail = sessionStorage.getItem("otp_email");

  const token = authUser ? JSON.parse(authUser)?.token : null;

  // attach token
  useEffect(() => {
    if (token) {
      setAuthorization(token);
    }
  }, [token]);

  /* ================= RULES ================= */

  // already logged in → block login & otp
  if (
    token &&
    (location.pathname === "/login" || location.pathname === "/verify-otp")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  // OTP page allowed only if otp_email exists
  if (location.pathname === "/verify-otp") {
    if (!otpEmail) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  // protected routes → need token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default AuthProtected;
