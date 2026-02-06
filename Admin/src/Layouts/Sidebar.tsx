import React, { useEffect } from "react";
import SimpleBar from "simplebar-react";
import {
  Container,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import avatar1 from "../assets/images/users/avatar-1.jpg";

// layouts
import VerticalLayout from "./VerticalLayouts";
import TwoColumnLayout from "./TwoColumnLayout";
import HorizontalLayout from "./HorizontalLayout";

import { getStorageUrl } from "../helpers/api_helper";
// settings hook
import { useSettings } from "../Components/Hooks/useSettings";

const Sidebar = ({ layoutType }: any) => {
  const { settings, loading } = useSettings();

  useEffect(() => {
    const verticalOverlay = document.getElementsByClassName("vertical-overlay");
    if (verticalOverlay.length > 0) {
      verticalOverlay[0].addEventListener("click", () => {
        document.body.classList.remove("vertical-sidebar-enable");
      });
    }
  }, []);

  const addEventListenerOnSmHoverMenu = () => {
    const size = document.documentElement.getAttribute("data-sidebar-size");

    if (size === "sm-hover") {
      document.documentElement.setAttribute(
        "data-sidebar-size",
        "sm-hover-active",
      );
    } else {
      document.documentElement.setAttribute("data-sidebar-size", "sm-hover");
    }
  };

  const logoUrl = getStorageUrl(settings?.admin_logo);

  const logoText =
    settings?.system_name || settings?.website_title || "Admin Panel";

  return (
    <>
      <div className="app-menu navbar-menu">
        {/* ================= SINGLE LOGO ================= */}
        <div className="navbar-brand-box custom-sidebar-logo">
          {loading ? (
            <span className="sidebar-logo-text">{logoText}</span>
          ) : logoUrl ? (
            <img
              src={logoUrl}
              alt="Admin Logo"
              className="sidebar-logo-img"
              loading="eager"
            />
          ) : (
            <span className="sidebar-logo-text">{logoText}</span>
          )}
        </div>

        {/* Sidebar Hover Button */}
        <button
          onClick={addEventListenerOnSmHoverMenu}
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line"></i>
        </button>

        {/* ================= USER DROPDOWN ================= */}
        <UncontrolledDropdown className="sidebar-user m-1 rounded">
          <DropdownToggle
            tag="button"
            type="button"
            className="btn material-shadow-none"
          >
            <span className="d-flex align-items-center gap-2">
              <img
                className="rounded header-profile-user"
                src={avatar1}
                alt="Avatar"
                draggable={false}
              />
              <span className="text-start">
                <span className="d-block fw-medium">ayush</span>
                <span className="d-block fs-14 text-muted">Admin</span>
              </span>
            </span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-end">
            <a className="dropdown-item" href="/profile">
              Profile
            </a>
            <a className="dropdown-item" href="/auth-logout-basic">
              Logout
            </a>
          </DropdownMenu>
        </UncontrolledDropdown>

        {/* ================= MENU ================= */}
        {layoutType === "horizontal" ? (
          <div id="scrollbar">
            <Container fluid>
              <ul className="navbar-nav">
                <HorizontalLayout />
              </ul>
            </Container>
          </div>
        ) : layoutType === "twocolumn" ? (
          <>
            <TwoColumnLayout layoutType={layoutType} />
            <div className="sidebar-background"></div>
          </>
        ) : (
          <>
            <SimpleBar id="scrollbar" className="h-100">
              <Container fluid>
                <ul className="navbar-nav">
                  <VerticalLayout layoutType={layoutType} />
                </ul>
              </Container>
            </SimpleBar>
            <div className="sidebar-background"></div>
          </>
        )}
      </div>

      <div className="vertical-overlay"></div>
    </>
  );
};

export default Sidebar;
