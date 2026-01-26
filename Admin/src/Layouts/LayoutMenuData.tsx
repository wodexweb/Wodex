import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navdata = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMasterSettings, setIsMasterSettings] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [isPages, setIsPages] = useState(false);
  const [isEvents, setIsEvents] = useState(false);
  const [isAnnouncements, setIsAnnouncements] = useState(false);
  const [isMembers, setIsMembers] = useState(false);

  const [isMediaLibrary, setIsMediaLibrary] = useState(false);
  const [isMembership, setIsMembership] = useState(false);
  const [isNotices, setIsNotices] = useState(false);
  const [isPdfPages, setIsPdfPages] = useState(false);
  const [isAchievements, setIsAchievements] = useState(false);

  /* ===== AUTO OPEN FROM URL ===== */
  useEffect(() => {
    const path = location.pathname;

    setIsMasterSettings(path.startsWith("/master-settings"));
    setIsMenu(path.startsWith("/menu"));
    setIsPages(path.startsWith("/pages"));
    setIsEvents(path.startsWith("/events"));
    setIsAnnouncements(path.startsWith("/announcements"));
    setIsMembers(path.startsWith("/members"));

    setIsMediaLibrary(path.startsWith("/media-library"));
    setIsMembership(path.startsWith("/membership"));
    setIsNotices(path.startsWith("/notices"));
    setIsPdfPages(path.startsWith("/pdf-pages"));
    setIsAchievements(path.startsWith("/achievements"));
  }, [location.pathname]);

  const menuItems = [
    { label: "Menu", isHeader: true },

    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      link: "/dashboard",
      click: () => navigate("/dashboard"),
    },

    {
      id: "master-settings",
      label: "Master Settings",
      icon: "ri-settings-3-line",
      link: "/#",
      stateVariables: isMasterSettings,
      click: (e: any) => {
        e.preventDefault();
        setIsMasterSettings(!isMasterSettings);
        setIsMenu(false);
        setIsPages(false);
        setIsEvents(false);
        setIsAnnouncements(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "general-settings",
          label: "General Settings",
          link: "/master-settings/general",
          click: () => navigate("/master-settings/general"),
        },
        {
          id: "contact-settings",
          label: "Contact Settings",
          link: "/master-settings/contact",
          click: () => navigate("/master-settings/contact"),
        },
        {
          id: "header-settings",
          label: "Header Settings",
          link: "/master-settings/header",
          click: () => navigate("/master-settings/header"),
        },
      ],
    },

    /* ================= MENU BUILDER ================= */

    {
      id: "menu",
      label: "Menus",
      icon: "ri-menu-3-line",
      link: "/#",
      stateVariables: isMenu,
      click: (e: any) => {
        e.preventDefault();
        setIsMenu(!isMenu);
        setIsMasterSettings(false);
        setIsPages(false);
        setIsEvents(false);
        setIsAnnouncements(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "add-menu",
          label: "Add Menu",
          link: "/menu/addmenu",
          click: () => navigate("/menu/addmenu"),
        },
        {
          id: "header-menu",
          label: "Header Menu",
          link: "/menu/header",
          click: () => navigate("/menu/header"),
        },
        {
          id: "footer-menu",
          label: "Footer Menu",
          link: "/menu/footer",
          click: () => navigate("/menu/footer"),
        },
      ],
    },

    /* ================= PAGES ================= */

    {
      id: "pages",
      label: "Pages",
      icon: "ri-file-text-line",
      link: "/#",
      stateVariables: isPages,
      click: (e: any) => {
        e.preventDefault();
        setIsPages(!isPages);
        setIsMasterSettings(false);
        setIsMenu(false);
        setIsEvents(false);
        setIsAnnouncements(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "page-add",
          label: "Add Page",
          link: "/pages/add",
          click: () => navigate("/pages/add"),
        },
        {
          id: "page-manage",
          label: "Manage Pages",
          link: "/pages/manage",
          click: () => navigate("/pages/manage"),
        },
      ],
    },

    {
      id: "media-library",
      label: "Media Library",
      icon: "ri-image-2-line",
      link: "/#",
      stateVariables: isMediaLibrary,
      click: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMediaLibrary(!isMediaLibrary);
      },
      subItems: [
        {
          id: "media-manage",
          label: "Manage Media",
          link: "/media-library",
          click: () => navigate("/media-library"),
        },
      ],
    },

    {
      id: "membership",
      label: "Membership",
      icon: "ri-vip-crown-line",
      link: "/#",
      stateVariables: isMembership,
      click: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsMembership(!isMembership);
      },
      subItems: [
        {
          id: "membership-plans",
          label: "Membership Plans",
          link: "/membership/plans",
          click: () => navigate("/membership/plans"),
        },
      ],
    },

    {
      id: "notices",
      label: "Notice Board",
      icon: "ri-feedback-line",
      link: "/#",
      stateVariables: isNotices,
      click: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsNotices(!isNotices);
      },
      subItems: [
        {
          id: "notice-manage",
          label: "Manage Notices",
          link: "/notices",
          click: () => navigate("/notices"),
        },
      ],
    },

    {
      id: "pdf-pages",
      label: "PDF Pages",
      icon: "ri-file-pdf-line",
      link: "/#",
      stateVariables: isPdfPages,
      click: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsPdfPages(!isPdfPages);
      },
      subItems: [
        {
          id: "pdf-manage",
          label: "Manage PDFs",
          link: "/pdf-pages",
          click: () => navigate("/pdf-pages"),
        },
      ],
    },

    {
      id: "achievements",
      label: "Achievements",
      icon: "ri-medal-line",
      link: "/#",
      stateVariables: isAchievements,
      click: (e: React.MouseEvent) => {
        e.preventDefault();
        setIsAchievements(!isAchievements);
      },
      subItems: [
        {
          id: "achievement-manage",
          label: "Manage Achievements",
          link: "/achievements",
          click: () => navigate("/achievements"),
        },
      ],
    },

    {
      id: "events",
      label: "Events",
      icon: "ri-calendar-event-line",
      link: "/#",
      stateVariables: isEvents,
      click: (e: any) => {
        e.preventDefault();
        setIsEvents(!isEvents);
        setIsAnnouncements(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "event-create",
          label: "Create Event",
          link: "/events/create",
          click: () => navigate("/events/create"),
        },
        {
          id: "event-list",
          label: "Event List",
          link: "/events/list",
          click: () => navigate("/events/list"),
        },
      ],
    },

    {
      id: "announcements",
      label: "Announcements",
      icon: "ri-notification-3-line",
      link: "/#",
      stateVariables: isAnnouncements,
      click: (e: any) => {
        e.preventDefault();
        setIsAnnouncements(!isAnnouncements);
        setIsEvents(false);
        setIsMembers(false);
      },
      subItems: [
        {
          id: "announcement-create",
          label: "Create Announcement",
          link: "/announcements/create",
          click: () => navigate("/announcements/create"),
        },
        {
          id: "announcement-list",
          label: "Announcement List",
          link: "/announcements/list",
          click: () => navigate("/announcements/list"),
        },
      ],
    },

    {
      id: "members",
      label: "Members",
      icon: "ri-team-line",
      link: "/#",
      stateVariables: isMembers,
      click: (e: any) => {
        e.preventDefault();
        setIsMembers(!isMembers);
        setIsEvents(false);
        setIsAnnouncements(false);
      },
      subItems: [
        {
          id: "member-create",
          label: "Add Member",
          link: "/members/create",
          click: () => navigate("/members/create"),
        },
        {
          id: "member-list",
          label: "Member List",
          link: "/members/list",
          click: () => navigate("/members/list"),
        },
      ],
    },
  ];

  return <>{menuItems}</>;
};

export default Navdata;
