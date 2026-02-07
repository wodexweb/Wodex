// import React, { useEffect, useState } from "react";
// import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
// import { APIClient } from "../../helpers/api_helper";

// const api = new APIClient();

// const DashboardEcommerce: React.FC = () => {
//   document.title = "Admin Dashboard";
//   const navigate = useNavigate();

//   /* ================= USER NAME ================= */

//   const selectUser = createSelector(
//     (state: any) => state.Profile,
//     (profile) => profile?.user,
//   );

//   const reduxUser = useSelector(selectUser);

//   const sessionUserRaw = sessionStorage.getItem("authUser");
//   const sessionUser = sessionUserRaw ? JSON.parse(sessionUserRaw)?.user : null;

//   const user = reduxUser || sessionUser;
//   const adminName = user?.name || user?.email || "Admin";

//   /* ================= COUNTS ================= */

//   const [eventCount, setEventCount] = useState(0);
//   const [announcementCount, setAnnouncementCount] = useState(0);
//   const [memberCount, setMemberCount] = useState(0);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         const [eventsRes, announcementsRes, membersRes]: any =
//           await Promise.all([
//             api.get("/api/events"),
//             api.get("/api/announcements"),
//             api.get("/api/members"),
//           ]);

//         /* ================= EVENTS COUNT (LIKE EVENT LIST) ================= */

//         const allEvents = [
//           ...(eventsRes?.upcoming || []),
//           ...(eventsRes?.recent || []),
//           ...(eventsRes?.past || []),
//         ];

//         setEventCount(allEvents.length);

//         /* ================= ANNOUNCEMENTS COUNT ================= */

//         const allAnnouncements =
//           announcementsRes?.data?.data ||
//           announcementsRes?.data ||
//           announcementsRes ||
//           [];

//         setAnnouncementCount(allAnnouncements.length);

//         /* ================= MEMBERS COUNT ================= */

//         const allMembers =
//           membersRes?.data?.data || membersRes?.data || membersRes || [];

//         setMemberCount(allMembers.length);
//       } catch (err) {
//         console.error("Dashboard count fetch failed", err);
//       }
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div className="page-content">
//       <Container fluid>
//         {/* ================= HEADER ================= */}
//         <Row className="mb-4 align-items-center ">
//           <Col md={8}>
//             <h4 className="mb-1 fw-semibold">Good Morning, {adminName} 👋</h4>
//             <p className="text-muted mb-0">
//               Here’s what’s happening with your platform today.
//             </p>
//           </Col>

//           <Col md={4} className="mt-3 mt-md-0">
//             <div className="d-flex justify-content-md-end justify-content-start gap-2 flex-wrap">
//               <Button
//                 color="primary"
//                 onClick={() => navigate("/events/create")}
//               >
//                 + Add Event
//               </Button>

//               <Button
//                 color="success"
//                 onClick={() => navigate("/members/create")}
//               >
//                 + Add Member
//               </Button>

//               <Button
//                 color="info"
//                 onClick={() => navigate("/announcements/create")}
//               >
//                 + Add Announcement
//               </Button>
//             </div>
//           </Col>
//         </Row>

//         {/* ================= STATS ================= */}
//         <Row className="justify-content-center g-4">
//           {/* EVENTS */}
//           <Col xl={4} md={6} className="mb-4">
//             <Card className="shadow-sm dashboard-card border-events">
//               <CardBody>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <p className="text-muted mb-1">EVENTS</p>
//                     <h4 className="fw-bold mb-0">{eventCount}</h4>
//                     <p className="text-success mt-2 mb-0">
//                       ↑ Active & Upcoming
//                     </p>
//                   </div>
//                   <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
//                     <i className="ri-calendar-event-line text-primary fs-3" />
//                   </div>
//                 </div>

//                 <Button
//                   size="sm"
//                   color="link"
//                   className="mt-3 p-0"
//                   onClick={() => navigate("/events/list")}
//                 >
//                   View all events →
//                 </Button>
//               </CardBody>
//             </Card>
//           </Col>

//           {/* ANNOUNCEMENTS */}
//           <Col xl={4} md={6} className="mb-4">
//             <Card className="shadow-sm dashboard-card border-announcements">
//               <CardBody>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <p className="text-muted mb-1">ANNOUNCEMENTS</p>
//                     <h4 className="fw-bold mb-0">{announcementCount}</h4>
//                     <p className="text-info mt-2 mb-0">↑ Live announcements</p>
//                   </div>
//                   <div className="avatar-sm bg-info bg-opacity-10 rounded d-flex align-items-center justify-content-center">
//                     <i className="ri-notification-3-line text-info fs-3" />
//                   </div>
//                 </div>

//                 <Button
//                   size="sm"
//                   color="link"
//                   className="mt-3 p-0"
//                   onClick={() => navigate("/announcements/list")}
//                 >
//                   View announcements →
//                 </Button>
//               </CardBody>
//             </Card>
//           </Col>

//           {/* MEMBERS */}
//           <Col xl={4} md={6} className="mb-4">
//             <Card className="shadow-sm dashboard-card border-members">
//               <CardBody>
//                 <div className="d-flex justify-content-between align-items-center">
//                   <div>
//                     <p className="text-muted mb-1">MEMBERS</p>
//                     <h4 className="fw-bold mb-0">{memberCount}</h4>
//                     <p className="text-warning mt-2 mb-0">↑ Active members</p>
//                   </div>
//                   <div className="avatar-sm bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center">
//                     <i className="ri-team-line text-warning fs-3" />
//                   </div>
//                 </div>

//                 <Button
//                   size="sm"
//                   color="link"
//                   className="mt-3 p-0"
//                   onClick={() => navigate("/members/list")}
//                 >
//                   View members →
//                 </Button>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default DashboardEcommerce;


import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

const DashboardEcommerce: React.FC = () => {
  document.title = "Admin Dashboard";
  const navigate = useNavigate();

  /* ================= USER NAME ================= */

  const selectUser = createSelector(
    (state: any) => state.Profile,
    (profile) => profile?.user,
  );

  const reduxUser = useSelector(selectUser);

  const sessionUserRaw = sessionStorage.getItem("authUser");
  const sessionUser = sessionUserRaw ? JSON.parse(sessionUserRaw)?.user : null;

  const user = reduxUser || sessionUser;
  const adminName = user?.name || user?.email || "Admin";

  /* ================= GREETING ================= */

  const hour = new Date().getHours();

  let greeting = "Good Morning";
  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  /* ================= COUNTS ================= */

  const [eventCount, setEventCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [eventsRes, announcementsRes, membersRes]: any =
          await Promise.all([
            api.get("/api/events"),
            api.get("/api/announcements"),
            api.get("/api/members"),
          ]);

        const allEvents = [
          ...(eventsRes?.upcoming || []),
          ...(eventsRes?.recent || []),
          ...(eventsRes?.past || []),
        ];

        setEventCount(allEvents.length);

        const allAnnouncements =
          announcementsRes?.data?.data ||
          announcementsRes?.data ||
          announcementsRes ||
          [];

        setAnnouncementCount(allAnnouncements.length);

        const allMembers =
          membersRes?.data?.data || membersRes?.data || membersRes || [];

        setMemberCount(allMembers.length);
      } catch (err) {
        console.error("Dashboard count fetch failed", err);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        {/* HEADER */}
        <Row className="mb-4 align-items-center ">
          <Col md={8}>
            <h4 className="mb-1 fw-semibold">
              {greeting}, {adminName} 👋
            </h4>
            <p className="text-muted mb-0">
              Here’s what’s happening with your platform today.
            </p>
          </Col>

          <Col md={4} className="mt-3 mt-md-0">
            <div className="d-flex justify-content-md-end justify-content-start gap-2 flex-wrap">
              <Button color="primary" onClick={() => navigate("/events/create")}>
                + Add Event
              </Button>

              <Button color="success" onClick={() => navigate("/members/create")}>
                + Add Member
              </Button>

              <Button color="info" onClick={() => navigate("/announcements/create")}>
                + Add Announcement
              </Button>
            </div>
          </Col>
        </Row>

        {/* STATS */}
        <Row className="justify-content-center g-4">
          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card border-events">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">EVENTS</p>
                    <h4 className="fw-bold mb-0">{eventCount}</h4>
                    <p className="text-success mt-2 mb-0">↑ Active & Upcoming</p>
                  </div>
                  <div className="avatar-sm bg-primary bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-calendar-event-line text-primary fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/events/list")}
                >
                  View all events →
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card border-announcements">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">ANNOUNCEMENTS</p>
                    <h4 className="fw-bold mb-0">{announcementCount}</h4>
                    <p className="text-info mt-2 mb-0">↑ Live announcements</p>
                  </div>
                  <div className="avatar-sm bg-info bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-notification-3-line text-info fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/announcements/list")}
                >
                  View announcements →
                </Button>
              </CardBody>
            </Card>
          </Col>

          <Col xl={4} md={6} className="mb-4">
            <Card className="shadow-sm dashboard-card border-members">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="text-muted mb-1">MEMBERS</p>
                    <h4 className="fw-bold mb-0">{memberCount}</h4>
                    <p className="text-warning mt-2 mb-0">↑ Active members</p>
                  </div>
                  <div className="avatar-sm bg-warning bg-opacity-10 rounded d-flex align-items-center justify-content-center">
                    <i className="ri-team-line text-warning fs-3" />
                  </div>
                </div>

                <Button
                  size="sm"
                  color="link"
                  className="mt-3 p-0"
                  onClick={() => navigate("/members/list")}
                >
                  View members →
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DashboardEcommerce;
