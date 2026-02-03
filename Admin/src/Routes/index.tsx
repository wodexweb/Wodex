import React from "react";
import { Routes, Route } from "react-router-dom";

import NonAuthLayout from "../Layouts/NonAuthLayout";
import VerticalLayout from "../Layouts";
import AuthProtected from "./AuthProtected";
import DocumentTitle from "../Components/DocumentTitle/DocumentTitle"; // ✅ added

import { publicRoutes, authProtectedRoutes } from "./allRoutes";

const Index = () => {
  return (
    <>
      <DocumentTitle /> {/* ✅ added */}
      <Routes>
        {/* PUBLIC */}
        {publicRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
          />
        ))}

        {/* PROTECTED */}
        {authProtectedRoutes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={
              <AuthProtected>
                <VerticalLayout>{route.component}</VerticalLayout>
              </AuthProtected>
            }
          />
        ))}
      </Routes>
    </>
  );
};

export default Index;
