import React, { useEffect } from "react";
import SimpleBar from "simplebar-react";
import {
  Container,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

// images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
import avatar1 from "../assets/images/users/avatar-1.jpg";

// layouts
import VerticalLayout from "./VerticalLayouts";
import TwoColumnLayout from "./TwoColumnLayout";
import HorizontalLayout from "./HorizontalLayout";

const Sidebar = ({ layoutType }: any) => {
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

  return (
    <>
      <div className="app-menu navbar-menu">
        {/* ================= LOGO ================= */}
        <div
          className="navbar-brand-box"
          style={{
            userSelect: "none",
            pointerEvents: "none", // 🔥 disables click completely
          }}
        >
          <div className="logo logo-dark">
            <span className="logo-sm">
              <img src={logoSm} alt="logo" height="22" draggable={false} />
            </span>
            <span className="logo-lg">
              <img src={logoDark} alt="logo" height="17" draggable={false} />
            </span>
          </div>

          <div className="logo logo-light">
            <span className="logo-sm">
              <img src={logoSm} alt="logo" height="22" draggable={false} />
            </span>
            <span className="logo-lg">
              <img src={logoLight} alt="logo" height="17" draggable={false} />
            </span>
          </div>
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
            id="page-header-user-dropdown"
          >
            <span className="d-flex align-items-center gap-2">
              <img
                className="rounded header-profile-user"
                src={avatar1}
                alt="Avatar"
                draggable={false}
              />
              <span className="text-start">
                <span className="d-block fw-medium sidebar-user-name-text">
                  Anna Adame
                </span>
                <span className="d-block fs-14 sidebar-user-name-sub-text">
                  <i className="ri ri-circle-fill fs-10 text-success align-baseline"></i>
                  <span className="align-middle ms-1">Online</span>
                </span>
              </span>
            </span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu-end">
            <h6 className="dropdown-header">Welcome Anna!</h6>
            <a className="dropdown-item" href="/profile">
              Profile
            </a>
            <a className="dropdown-item" href="/apps-chat">
              Messages
            </a>
            <a className="dropdown-item" href="/apps-tasks-kanban">
              Taskboard
            </a>
            <a className="dropdown-item" href="/pages-faqs">
              Help
            </a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="/pages-profile">
              Balance : <b>$5971.67</b>
            </a>
            <a className="dropdown-item" href="/pages-profile-settings">
              <span className="badge bg-success-subtle text-success float-end">
                New
              </span>
              Settings
            </a>
            <a className="dropdown-item" href="/auth-lockscreen-basic">
              Lock screen
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
