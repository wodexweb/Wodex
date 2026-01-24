import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

// Auth pages
import Login from "../pages/Authentication/Login";
import VerifyOtp from "../pages/Authentication/VerifyOtp";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";

// User
import UserProfile from "../pages/Authentication/user-profile";

// EVENTS
import EventList from "../pages/Events/EventList";
import CreateEvent from "../pages/Events/EventForm";
import EditEvent from "../pages/Events/EditEvent";
import ViewEvent from "../pages/Events/ViewEvent";

// ANNOUNCEMENTS
import AnnouncementList from "../pages/Announcement/AnnouncementList";
import CreateAnnouncement from "../pages/Announcement/AnnouncementForm";
import EditAnnouncement from "../pages/Announcement/EditAnnouncement";
import ViewAnnouncement from "../pages/Announcement/AnnouncementView";

// MEMBERS
import MemberList from "../pages/Members/MemberList";
import MemberForm from "../pages/Members/MemberForm";
import EditMember from "../pages/Members/EditMember";
import MemberView from "../pages/Members/MemberView";

/* ================= PUBLIC ROUTES ================= */

const publicRoutes = [
  { path: "/", component: <Navigate to="/login" replace /> },
  { path: "/login", component: <Login /> },
  { path: "/verify-otp", component: <VerifyOtp /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/logout", component: <Logout /> },
];

/* ================= PROTECTED ROUTES ================= */

const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardEcommerce /> },
  { path: "/index", component: <DashboardEcommerce /> },

  { path: "/profile", component: <UserProfile /> },

  // EVENTS
  { path: "/events/list", component: <EventList /> },
  { path: "/events/create", component: <CreateEvent /> },
  { path: "/events/edit/:id", component: <EditEvent /> },
  { path: "/events/view/:id", component: <ViewEvent /> },

  // ANNOUNCEMENTS
  { path: "/announcements/list", component: <AnnouncementList /> },
  { path: "/announcements/create", component: <CreateAnnouncement /> },
  { path: "/announcements/edit/:id", component: <EditAnnouncement /> },
  { path: "/announcements/view/:id", component: <ViewAnnouncement /> },

  // MEMBERS
  { path: "/members/list", component: <MemberList /> },
  { path: "/members/create", component: <MemberForm /> },
  { path: "/members/edit/:id", component: <EditMember /> },
  { path: "/members/view/:id", component: <MemberView /> },

  { path: "*", component: <Navigate to="/dashboard" replace /> },
];

export { publicRoutes, authProtectedRoutes };
