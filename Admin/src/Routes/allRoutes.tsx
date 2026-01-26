import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";

// Notices
import Notices from "../pages/Notices/Notices";

// PDF Pages
import PdfPages from "../pages/PdfPages/PdfPages";

// Achievements
import Achievements from "../pages/Achievements/Achievements";

// Membership
import MembershipPlans from "../pages/Membership/MembershipPlans";

// Media Files
import MediaLibrary from "../pages/Media/MediaLibrary"; // Added Import

// Errors
// import Basic404 from "../pages/AuthenticationInner/Errors/Basic404";
// import Cover404 from "../pages/AuthenticationInner/Errors/Cover404";
// import Alt404 from "../pages/AuthenticationInner/Errors/Alt404";
// import Error500 from "../pages/AuthenticationInner/Errors/Error500";
// import Offlinepage from "../pages/AuthenticationInner/Errors/Offlinepage";

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

// Master settings
import GenralSettings from "../pages/MasterSettings/GenaralSettings";
import ContactSettings from "../pages/MasterSettings/ContactSettings";
import HeaderSettings from "../pages/MasterSettings/HeaderSettings";
// import MenuSettings from "../pages/MasterSettings/MenuSettings";

// menu
import MenuBuilder from "../pages/Menu/MenuBuilder";
import HeaderMenu from "../pages/Menu/HeaderMenu";
import FooterMenu from "../pages/Menu/FooterMenu";
import AddMenu from "../pages/Menu/AddMenu";

// pages

import AddPage from "../pages/Pages/AddPage";
import ManagePages from "../pages/Pages/ManagePages";

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

  // NOTICES
  { path: "/notices", component: <Notices /> },

  // PDF PAGES
  { path: "/pdf-pages", component: <PdfPages /> },

  // ACHIEVEMENTS
  { path: "/achievements", component: <Achievements /> },

  // MEMBERSHIP PLANS
  { path: "/membership/plans", component: <MembershipPlans /> },

  // MEDIA FILES
  { path: "/media-library", component: <MediaLibrary /> }, // Added Route

  // Master Settings
  { path: "/master-settings/general", component: <GenralSettings /> },
  { path: "/master-settings/contact", component: <ContactSettings /> },
  { path: "/master-settings/header", component: <HeaderSettings /> },
  // { path: "/master-settings/menu", component: <MenuSettings /> },

  // Master Settings
  // { path: "/add-menu/menubuilder", component: <MenuBuilder /> },
  { path: "/menu/header", component: <HeaderMenu /> },
  { path: "/menu/footer", component: <FooterMenu /> },
  { path: "/menu/addmenu", component: <AddMenu /> },

  // pages
  // <Route path="/pages/add" element={<AddPage />} />,
  { path: "/pages/add", component: <AddPage /> },
  { path: "/pages/manage", component: <ManagePages /> },

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
