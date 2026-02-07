// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const Navdata = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [isMasterSettings, setIsMasterSettings] = useState(false);
//   const [isMenu, setIsMenu] = useState(false);
//   const [isPages, setIsPages] = useState(false);
//   const [isEvents, setIsEvents] = useState(false);
//   const [isAnnouncements, setIsAnnouncements] = useState(false);
//   const [isMembers, setIsMembers] = useState(false);

//   const [isMediaLibrary, setIsMediaLibrary] = useState(false);
//   const [isMembership, setIsMembership] = useState(false);
//   const [isNotices, setIsNotices] = useState(false);
//   const [isPdfPages, setIsPdfPages] = useState(false);
//   const [isAchievements, setIsAchievements] = useState(false);
//   const [isGallery, setIsGallery] = useState(false);

//   /* ===== AUTO OPEN FROM URL ===== */
//   useEffect(() => {
//     const path = location.pathname;

//     setIsMasterSettings(path.startsWith("/master-settings"));
//     setIsMenu(path.startsWith("/menu"));
//     setIsPages(path.startsWith("/pages"));
//     setIsEvents(path.startsWith("/events"));
//     setIsAnnouncements(path.startsWith("/announcements"));
//     setIsMembers(path.startsWith("/members"));

//     setIsMediaLibrary(path.startsWith("/media-library"));
//     setIsMembership(path.startsWith("/membership"));
//     setIsNotices(path.startsWith("/notices"));
//     setIsPdfPages(path.startsWith("/pdf-pages"));
//     setIsAchievements(path.startsWith("/achievements"));
//     setIsGallery(path.startsWith("/gallery"));
//   }, [location.pathname]);

//   const menuItems = [
//     { label: "Menu", isHeader: true },

//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: "ri-dashboard-line",
//       link: "/dashboard",
//       click: () => navigate("/dashboard"),
//     },

//     {
//       id: "master-settings",
//       label: "Master Settings",
//       icon: "ri-settings-3-line",
//       link: "/#",
//       stateVariables: isMasterSettings,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsMasterSettings(!isMasterSettings);
//         setIsMenu(false);
//         setIsPages(false);
//         setIsEvents(false);
//         setIsAnnouncements(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "general-settings",
//           label: "General Settings",
//           link: "/master-settings/general",
//           click: () => navigate("/master-settings/general"),
//         },
//         {
//           id: "contact-settings",
//           label: "Contact Settings",
//           link: "/master-settings/contact",
//           click: () => navigate("/master-settings/contact"),
//         },
//         {
//           id: "header-settings",
//           label: "Header Settings",
//           link: "/master-settings/header",
//           click: () => navigate("/master-settings/header"),
//         },
//       ],
//     },

//     /* ================= MENU BUILDER ================= */

//     {
//       id: "menu",
//       label: "Menus",
//       icon: "ri-menu-3-line",
//       link: "/#",
//       stateVariables: isMenu,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsMenu(!isMenu);
//         setIsMasterSettings(false);
//         setIsPages(false);
//         setIsEvents(false);
//         setIsAnnouncements(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "add-menu",
//           label: "Add Menu",
//           link: "/menu/addmenu",
//           click: () => navigate("/menu/addmenu"),
//         },
//         {
//           id: "header-menu",
//           label: "Header Menu",
//           link: "/menu/header",
//           click: () => navigate("/menu/header"),
//         },
//         {
//           id: "footer-menu",
//           label: "Footer Menu",
//           link: "/menu/footer",
//           click: () => navigate("/menu/footer"),
//         },
//       ],
//     },

//     /* ================= PAGES ================= */

//     {
//       id: "pages",
//       label: "Pages",
//       icon: "ri-file-text-line",
//       link: "/#",
//       stateVariables: isPages,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsPages(!isPages);
//         setIsMasterSettings(false);
//         setIsMenu(false);
//         setIsEvents(false);
//         setIsAnnouncements(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "page-add",
//           label: "Add Page",
//           link: "/pages/add",
//           click: () => navigate("/pages/add"),
//         },
//         {
//           id: "page-manage",
//           label: "Manage Pages",
//           link: "/pages/manage",
//           click: () => navigate("/pages/manage"),
//         },
//       ],
//     },

//     {
//       id: "media-library",
//       label: "Media Library",
//       icon: "ri-image-2-line",
//       link: "/#",
//       stateVariables: isMediaLibrary,
//       click: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsMediaLibrary(!isMediaLibrary);
//       },
//       subItems: [
//         {
//           id: "media-manage",
//           label: "Manage Media",
//           link: "/media-library",
//           click: () => navigate("/media-library"),
//         },
//       ],
//     },

//     {
//       id: "membership",
//       label: "Membership",
//       icon: "ri-vip-crown-line",
//       link: "/#",
//       stateVariables: isMembership,
//       click: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsMembership(!isMembership);
//       },
//       subItems: [
//         {
//           id: "membership-plans",
//           label: "Membership Plans",
//           link: "/membership/plans",
//           click: () => navigate("/membership/plans"),
//         },
//       ],
//     },

//     {
//       id: "notices",
//       label: "Notice Board",
//       icon: "ri-feedback-line",
//       link: "/#",
//       stateVariables: isNotices,
//       click: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsNotices(!isNotices);
//       },
//       subItems: [
//         {
//           id: "notice-manage",
//           label: "Manage Notices",
//           link: "/notices",
//           click: () => navigate("/notices"),
//         },
//       ],
//     },

//     {
//       id: "pdf-pages",
//       label: "PDF Pages",
//       icon: "ri-file-pdf-line",
//       link: "/#",
//       stateVariables: isPdfPages,
//       click: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsPdfPages(!isPdfPages);
//       },
//       subItems: [
//         {
//           id: "pdf-manage",
//           label: "Manage PDFs",
//           link: "/pdf-pages",
//           click: () => navigate("/pdf-pages"),
//         },
//       ],
//     },

//     {
//       id: "achievements",
//       label: "Achievements",
//       icon: "ri-medal-line",
//       link: "/#",
//       stateVariables: isAchievements,
//       click: (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsAchievements(!isAchievements);
//       },
//       subItems: [
//         {
//           id: "achievement-manage",
//           label: "Manage Achievements",
//           link: "/achievements",
//           click: () => navigate("/achievements"),
//         },
//       ],
//     },

//     {
//       id: "gallery",
//       label: "Gallery",
//       icon: "ri-gallery-line",
//       link: "/#",
//       stateVariables: isGallery,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsGallery(!isGallery);

//         // close others if needed
//         setIsEvents(false);
//         setIsAnnouncements(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "gallery-add",
//           label: "Add Gallery",
//           link: "/gallery/add",
//           click: () => navigate("/gallery/add"),
//         },
//       ],
//     },

//     {
//       id: "events",
//       label: "Events",
//       icon: "ri-calendar-event-line",
//       link: "/#",
//       stateVariables: isEvents,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsEvents(!isEvents);
//         setIsAnnouncements(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "event-create",
//           label: "Create Event",
//           link: "/events/create",
//           click: () => navigate("/events/create"),
//         },
//         {
//           id: "event-list",
//           label: "Event List",
//           link: "/events/list",
//           click: () => navigate("/events/list"),
//         },
//       ],
//     },

//     {
//       id: "announcements",
//       label: "Announcements",
//       icon: "ri-notification-3-line",
//       link: "/#",
//       stateVariables: isAnnouncements,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsAnnouncements(!isAnnouncements);
//         setIsEvents(false);
//         setIsMembers(false);
//       },
//       subItems: [
//         {
//           id: "announcement-create",
//           label: "Create Announcement",
//           link: "/announcements/create",
//           click: () => navigate("/announcements/create"),
//         },
//         {
//           id: "announcement-list",
//           label: "Announcement List",
//           link: "/announcements/list",
//           click: () => navigate("/announcements/list"),
//         },
//       ],
//     },

//     {
//       id: "members",
//       label: "Members",
//       icon: "ri-team-line",
//       link: "/#",
//       stateVariables: isMembers,
//       click: (e: any) => {
//         e.preventDefault();
//         setIsMembers(!isMembers);
//         setIsEvents(false);
//         setIsAnnouncements(false);
//       },
//       subItems: [
//         {
//           id: "member-create",
//           label: "Add Member",
//           link: "/members/create",
//           click: () => navigate("/members/create"),
//         },
//         {
//           id: "member-list",
//           label: "Member List",
//           link: "/members/list",
//           click: () => navigate("/members/list"),
//         },
//       ],
//     },
//   ];

//   return <>{menuItems}</>;
// };

// // export default Navdata;
// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// const Navdata = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   // 🔑 ONE STATE FOR ALL DROPDOWNS
//   const [activeMenu, setActiveMenu] = useState<string | null>(null);

//   /* ================= AUTO OPEN FROM URL ================= */
//   useEffect(() => {
//     const path = location.pathname;

//     if (path.startsWith("/master-settings")) setActiveMenu("master-settings");
//     else if (path.startsWith("/menu")) setActiveMenu("menu");
//     else if (path.startsWith("/pages")) setActiveMenu("pages");
//     else if (path.startsWith("/media-library")) setActiveMenu("media-library");
//     else if (path.startsWith("/membership")) setActiveMenu("membership");
//     else if (path.startsWith("/notices")) setActiveMenu("notices");
//     else if (path.startsWith("/pdf-pages")) setActiveMenu("pdf-pages");
//     else if (path.startsWith("/achievements")) setActiveMenu("achievements");
//     else if (path.startsWith("/gallery")) setActiveMenu("gallery");
//     else if (path.startsWith("/events")) setActiveMenu("events");
//     else if (path.startsWith("/announcements")) setActiveMenu("announcements");
//     else if (path.startsWith("/members")) setActiveMenu("members");
//     else setActiveMenu(null);
//   }, [location.pathname]);

//   /* ================= TOGGLE ================= */
//   const toggleMenu = (id: string) => {
//     setActiveMenu((prev) => (prev === id ? null : id));
//   };

//   const menuItems = [
//     { label: "Menu", isHeader: true },

//     {
//       id: "dashboard",
//       label: "Dashboard",
//       icon: "ri-dashboard-line",
//       link: "/dashboard",
//       click: () => navigate("/dashboard"),
//     },

//     /* ================= MASTER SETTINGS ================= */
//     {
//       id: "master-settings",
//       label: "Master Settings",
//       icon: "ri-settings-3-line",
//       link: "/#",
//       stateVariables: activeMenu === "master-settings",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("master-settings");
//       },
//       subItems: [
//         {
//           label: "General Settings",
//           click: () => navigate("/master-settings/general"),
//         },
//         {
//           label: "Contact Settings",
//           click: () => navigate("/master-settings/contact"),
//         },
//         {
//           label: "Header Settings",
//           click: () => navigate("/master-settings/header"),
//         },
//       ],
//     },

//     /* ================= MENUS ================= */
//     {
//       id: "menu",
//       label: "Menus",
//       icon: "ri-menu-3-line",
//       link: "/#",
//       stateVariables: activeMenu === "menu",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("menu");
//       },
//       subItems: [
//         { label: "Add Menu", click: () => navigate("/menu/addmenu") },
//         { label: "Header Menu", click: () => navigate("/menu/header") },
//         { label: "Footer Menu", click: () => navigate("/menu/footer") },
//       ],
//     },

//     /* ================= PAGES ================= */
//     {
//       id: "pages",
//       label: "Pages",
//       icon: "ri-file-text-line",
//       link: "/#",
//       stateVariables: activeMenu === "pages",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("pages");
//       },
//       subItems: [
//         { label: "Add Page", click: () => navigate("/pages/add") },
//         { label: "Manage Pages", click: () => navigate("/pages/manage") },
//       ],
//     },

//     /* ================= MEDIA ================= */
//     {
//       id: "media-library",
//       label: "Media Library",
//       icon: "ri-image-2-line",
//       link: "/#",
//       stateVariables: activeMenu === "media-library",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("media-library");
//       },
//       subItems: [
//         { label: "Manage Media", click: () => navigate("/media-library") },
//       ],
//     },

//     /* ================= MEMBERSHIP ================= */
//     {
//       id: "membership",
//       label: "Membership",
//       icon: "ri-vip-crown-line",
//       link: "/#",
//       stateVariables: activeMenu === "membership",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("membership");
//       },
//       subItems: [
//         {
//           label: "Membership Plans",
//           click: () => navigate("/membership/plans"),
//         },
//       ],
//     },

//     /* ================= NOTICES ================= */
//     {
//       id: "notices",
//       label: "Notice Board",
//       icon: "ri-feedback-line",
//       link: "/#",
//       stateVariables: activeMenu === "notices",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("notices");
//       },
//       subItems: [
//         { label: "Manage Notices", click: () => navigate("/notices") },
//       ],
//     },

//     /* ================= PDF ================= */
//     {
//       id: "pdf-pages",
//       label: "PDF Pages",
//       icon: "ri-file-pdf-line",
//       link: "/#",
//       stateVariables: activeMenu === "pdf-pages",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("pdf-pages");
//       },
//       subItems: [{ label: "Manage PDFs", click: () => navigate("/pdf-pages") }],
//     },

//     /* ================= ACHIEVEMENTS ================= */
//     {
//       id: "achievements",
//       label: "Achievements",
//       icon: "ri-medal-line",
//       link: "/#",
//       stateVariables: activeMenu === "achievements",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("achievements");
//       },
//       subItems: [
//         {
//           label: "Manage Achievements",
//           click: () => navigate("/achievements"),
//         },
//       ],
//     },

//     /* ================= GALLERY ================= */
//     {
//       id: "gallery",
//       label: "Gallery",
//       icon: "ri-gallery-line",
//       link: "/#",
//       stateVariables: activeMenu === "gallery",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("gallery");
//       },
//       subItems: [
//         { label: "Add Gallery", click: () => navigate("/gallery/add") },
//       ],
//     },

//     /* ================= EVENTS ================= */
//     {
//       id: "events",
//       label: "Events",
//       icon: "ri-calendar-event-line",
//       link: "/#",
//       stateVariables: activeMenu === "events",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("events");
//       },
//       subItems: [
//         { label: "Create Event", click: () => navigate("/events/create") },
//         { label: "Event List", click: () => navigate("/events/list") },
//       ],
//     },

//     /* ================= ANNOUNCEMENTS ================= */
//     {
//       id: "announcements",
//       label: "Announcements",
//       icon: "ri-notification-3-line",
//       link: "/#",
//       stateVariables: activeMenu === "announcements",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("announcements");
//       },
//       subItems: [
//         {
//           label: "Create Announcement",
//           click: () => navigate("/announcements/create"),
//         },
//         {
//           label: "Announcement List",
//           click: () => navigate("/announcements/list"),
//         },
//       ],
//     },

//     /* ================= MEMBERS ================= */
//     {
//       id: "members",
//       label: "Members",
//       icon: "ri-team-line",
//       link: "/#",
//       stateVariables: activeMenu === "members",
//       click: (e: any) => {
//         e.preventDefault();
//         toggleMenu("members");
//       },
//       subItems: [
//         { label: "Add Member", click: () => navigate("/members/create") },
//         { label: "Member List", click: () => navigate("/members/list") },
//       ],
//     },
//   ];

//   return <>{menuItems}</>;
// };

// export default Navdata;


import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getRoleId } from "../helpers/api_helper";

/* ================= ROLE ACCESS ================= */
const ROLE_ACCESS: Record<number, string[]> = {
  1: [
    "dashboard",
    "roles",
    "master-settings",
    "menu",
    "pages",
    "media-library",
    "membership",
    "notices",
    "pdf-pages",
    "achievements",
    "gallery",
    "events",
    "announcements",
    "members",
  ],
  2: [
    "dashboard",
    "menu",
    "pages",
    "media-library",
    "notices",
    "pdf-pages",
    "achievements",
    "events",
    "announcements",
  ],
  3: ["dashboard", "membership"],
};

const Navdata = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleId = getRoleId();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  /* ================= AUTO OPEN ================= */
  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/admins")) setActiveMenu("roles");
    else if (path.startsWith("/master-settings")) setActiveMenu("master-settings");
    else if (path.startsWith("/menu")) setActiveMenu("menu");
    else if (path.startsWith("/pages")) setActiveMenu("pages");
    else if (path.startsWith("/media-library")) setActiveMenu("media-library");
    else if (path.startsWith("/membership")) setActiveMenu("membership");
    else if (path.startsWith("/notices")) setActiveMenu("notices");
    else if (path.startsWith("/pdf-pages")) setActiveMenu("pdf-pages");
    else if (path.startsWith("/achievements")) setActiveMenu("achievements");
    else if (path.startsWith("/gallery")) setActiveMenu("gallery");
    else if (path.startsWith("/events")) setActiveMenu("events");
    else if (path.startsWith("/announcements")) setActiveMenu("announcements");
    else if (path.startsWith("/members")) setActiveMenu("members");
    else setActiveMenu(null);
  }, [location.pathname]);

  const toggleMenu = (id: string) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  /* ================= MENU ITEMS ================= */
  const allMenus: any[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "ri-dashboard-line",
      click: () => navigate("/dashboard"),
    },

    /* ROLES */
    {
      id: "roles",
      label: "Roles",
      icon: "ri-shield-user-line",
      link: "/#",
      stateVariables: activeMenu === "roles",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("roles");
      },
      subItems: [
        { label: "Add Role", click: () => navigate("/admins/create") },
        { label: "List Of Roles", click: () => navigate("/admins") },
      ],
    },

    /* MASTER SETTINGS */
    {
      id: "master-settings",
      label: "Master Settings",
      icon: "ri-settings-3-line",
      link: "/#",
      stateVariables: activeMenu === "master-settings",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("master-settings");
      },
      subItems: [
        { label: "General Settings", click: () => navigate("/master-settings/general") },
        { label: "Contact Settings", click: () => navigate("/master-settings/contact") },
        { label: "Header Settings", click: () => navigate("/master-settings/header") },
      ],
    },

    {
      id: "menu",
      label: "Menus",
      icon: "ri-menu-3-line",
      link: "/#",
      stateVariables: activeMenu === "menu",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("menu");
      },
      subItems: [
        { label: "Add Menu", click: () => navigate("/menu/addmenu") },
        { label: "Header Menu", click: () => navigate("/menu/header") },
        { label: "Footer Menu", click: () => navigate("/menu/footer") },
      ],
    },

    {
      id: "pages",
      label: "Pages",
      icon: "ri-file-text-line",
      link: "/#",
      stateVariables: activeMenu === "pages",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("pages");
      },
      subItems: [
        { label: "Add Page", click: () => navigate("/pages/add") },
        { label: "Manage Pages", click: () => navigate("/pages/manage") },
      ],
    },

    {
      id: "media-library",
      label: "Media Library",
      icon: "ri-image-2-line",
      link: "/#",
      stateVariables: activeMenu === "media-library",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("media-library");
      },
      subItems: [{ label: "Manage Media", click: () => navigate("/media-library") }],
    },

    {
      id: "membership",
      label: "Membership",
      icon: "ri-vip-crown-line",
      link: "/#",
      stateVariables: activeMenu === "membership",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("membership");
      },
      subItems: [{ label: "Membership Plans", click: () => navigate("/membership/plans") }],
    },

    {
      id: "notices",
      label: "Notice Board",
      icon: "ri-feedback-line",
      link: "/#",
      stateVariables: activeMenu === "notices",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("notices");
      },
      subItems: [{ label: "Manage Notices", click: () => navigate("/notices") }],
    },

    {
      id: "pdf-pages",
      label: "PDF Pages",
      icon: "ri-file-pdf-line",
      link: "/#",
      stateVariables: activeMenu === "pdf-pages",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("pdf-pages");
      },
      subItems: [{ label: "Manage PDFs", click: () => navigate("/pdf-pages") }],
    },

    {
      id: "achievements",
      label: "Achievements",
      icon: "ri-medal-line",
      link: "/#",
      stateVariables: activeMenu === "achievements",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("achievements");
      },
      subItems: [{ label: "Manage Achievements", click: () => navigate("/achievements") }],
    },
    /* ================= GALLERY ================= */
    {
      id: "gallery",
      label: "Gallery",
      icon: "ri-gallery-line",
      link: "/#",
      stateVariables: activeMenu === "gallery",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("gallery");
      },
      subItems: [
        { label: "Add Gallery", click: () => navigate("/gallery/add") },
      ],
    },

    {
      id: "events",
      label: "Events",
      icon: "ri-calendar-event-line",
      link: "/#",
      stateVariables: activeMenu === "events",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("events");
      },
      subItems: [
        { label: "Create Event", click: () => navigate("/events/create") },
        { label: "Event List", click: () => navigate("/events/list") },
      ],
    },

    {
      id: "announcements",
      label: "Announcements",
      icon: "ri-notification-3-line",
      link: "/#",
      stateVariables: activeMenu === "announcements",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("announcements");
      },
      subItems: [
        { label: "Create Announcement", click: () => navigate("/announcements/create") },
        { label: "Announcement List", click: () => navigate("/announcements/list") },
      ],
    },

    {
      id: "members",
      label: "Members",
      icon: "ri-team-line",
      link: "/#",
      stateVariables: activeMenu === "members",
      click: (e: any) => {
        e.preventDefault();
        toggleMenu("members");
      },
      subItems: [
        { label: "Add Member", click: () => navigate("/members/create") },
        { label: "Member List", click: () => navigate("/members/list") },
      ],
    },
  ];

  /* ================= FILTER BY ROLE ================= */
  const allowedMenus = allMenus.filter((menu) =>
    ROLE_ACCESS[roleId]?.includes(menu.id)
  );

  return <>{allowedMenus}</>;
};

export default Navdata;
