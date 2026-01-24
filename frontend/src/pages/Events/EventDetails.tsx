// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { AiFillHome } from "react-icons/ai";
// import styles from "./EventsPage.module.scss";
// import { EventsAPI, type EventItem } from "./api/events";

// const EventDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [event, setEvent] = useState<EventItem | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;

//     EventsAPI.getById(id)
//       .then(setEvent)
//       .finally(() => setLoading(false));
//   }, [id]);

//   return (
//     <>
//       {/* HEADER */}
//       <section className={styles.header}>
//         <h1>{event?.title || "Event Details"}</h1>

//         <div className={styles.breadcrumb}>
//           <Link to="/" className={styles.home}>
//             <AiFillHome className={styles.homeIcon} />
//             <span className={styles.homeText}>Home</span>
//           </Link>
//           <span className={styles.separator}>›</span>
//           <span className={styles.current}>Events</span>
//         </div>
//       </section>

//       {/* PAGE */}
//       <section className={styles.detailsPage}>
//         <div className={styles.detailsLayout}>
//           {/* MAIN CONTENT */}
//           <main className={styles.detailsMain}>
//             {loading ? (
//               <p className={styles.empty}>Loading...</p>
//             ) : !event ? (
//               <p className={styles.empty}>Event not found</p>
//             ) : (
//               <>
//                 {/* POSTER IMAGE */}
//                 <img
//                   src={event.photo_url ?? ""}
//                   alt={event.title}
//                   className={styles.poster}
//                 />

//                 {/* PREV / NEXT PLACEHOLDER */}
//                 <div className={styles.postNav}>
//                   <span>← Previous Post</span>
//                   <span>Next Post →</span>
//                 </div>
//               </>
//             )}
//           </main>

//           {/* SIDEBAR */}
//           <aside className={styles.sidebar}>
//             {/* SEARCH */}
//             <div className={styles.sidebarBox}>
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className={styles.search}
//               />
//             </div>

//             {/* CATEGORIES */}
//             <div className={styles.sidebarBox}>
//               <h4>Categories</h4>
//               <ul>
//                 <li>Articles</li>
//                 <li>Past Events</li>
//                 <li>Recent Events</li>
//                 <li>Upcoming Events</li>
//               </ul>
//             </div>

//             {/* ARCHIVES */}
//             <div className={styles.sidebarBox}>
//               <h4>Archives</h4>
//               <ul>
//                 <li>December 2025</li>
//                 <li>August 2025</li>
//                 <li>June 2025</li>
//                 <li>April 2025</li>
//               </ul>
//             </div>
//           </aside>
//         </div>
//       </section>
//     </>
//   );
// };

// export default EventDetails;
