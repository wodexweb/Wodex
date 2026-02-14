// import React, { useEffect, useRef, useState } from "react";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   CardBody,
//   Input,
//   Button,
//   Label,
//   Form,
// } from "reactstrap";
// import { APIClient } from "../../helpers/api_helper";

// const api = new APIClient();

// type EventOption = {
//   id: string;
//   title: string;
// };

// const ManageGallery = () => {
//   const [events, setEvents] = useState<EventOption[]>([]);
//   const [selectedEvent, setSelectedEvent] = useState("");
//   const [title, setTitle] = useState("");
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [images, setImages] = useState<string[]>([]);
//   const [driveLink, setDriveLink] = useState("");
//   const [loading, setLoading] = useState(false); // Added loading state

//   const fileRef = useRef<HTMLInputElement | null>(null);

//   /* ================= FETCH EVENTS ================= */
//   useEffect(() => {
//     api
//       .get("/api/admin/events")
//       .then((res: any) => {
//         const allEvents = [
//           ...(res.upcoming || []),
//           ...(res.recent || []),
//           ...(res.past || []),
//         ];

//         setEvents(
//           allEvents.map((e: any) => ({
//             id: String(e.id),
//             title: e.title,
//           })),
//         );
//       })
//       .catch((err) => {
//         console.error("Events fetch error:", err);
//       });
//   }, []);

//   /* ================= FETCH GALLERY (Manual Trigger) ================= */
//   const fetchGallery = async () => {
//     if (!selectedEvent) return alert("Please select an event first");

//     setLoading(true);
//     try {
//       const res: any = await api.get(
//         `/api/admin/gallery/event/${selectedEvent}`,
//       );

//       if (!res || typeof res !== "object") {
//         setImages([]);
//         setDriveLink("");
//       } else {
//         setImages(Array.isArray(res.images) ? res.images : []);
//         setDriveLink(res.drive_link || "");
//         // Only update title if the backend provides it, otherwise keep dropdown selection
//         if (res.event_title) setTitle(res.event_title);
//       }
//     } catch (err: any) {
//       console.error("Gallery fetch failed:", err);
//       setImages([]);
//       setDriveLink("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UPLOAD ================= */
//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedEvent) return alert("Select event");
//     if (!files || files.length === 0) return alert("Select images");

//     const formData = new FormData();
//     formData.append("event_id", selectedEvent);
//     formData.append("title", title);

//     Array.from(files).forEach((f) => {
//       formData.append("photos[]", f);
//     });

//     try {
//       await api.create("/api/admin/gallery", formData);
//       alert("Images uploaded successfully");

//       // Clear file input after successful upload
//       if (fileRef.current) fileRef.current.value = "";
//       setFiles(null);

//       // Automatically refresh the view after upload
//       fetchGallery();
//     } catch (err) {
//       console.error("Upload error:", err);
//       alert("Upload failed");
//     }
//   };

//   return (
//     <div className="page-content">
//       <Container fluid>
//         <Row>
//           {/* LEFT: Controls */}
//           <Col lg={4}>
//             <Card>
//               <CardBody>
//                 <h4>Manage Event Photos</h4>

//                 <Form onSubmit={handleUpload}>
//                   <Label>Select Event</Label>
//                   <div className="d-flex gap-2">
//                     <Input
//                       type="select"
//                       value={selectedEvent}
//                       onChange={(e) => {
//                         const id = e.target.value;
//                         setSelectedEvent(id);
//                         const ev = events.find((x) => x.id === id);
//                         setTitle(ev ? ev.title : "");
//                         // ❌ fetchGallery(id) call removed from here
//                       }}
//                     >
//                       <option value="">-- Select Event --</option>
//                       {events.map((e) => (
//                         <option key={e.id} value={e.id}>
//                           {e.title}
//                         </option>
//                       ))}
//                     </Input>

//                     {/* ✅ NEW: Manual View Button */}
//                     <Button
//                       type="button"
//                       color="info"
//                       onClick={fetchGallery}
//                       disabled={!selectedEvent || loading}
//                     >
//                       {loading ? "..." : "View"}
//                     </Button>
//                   </div>

//                   <Label className="mt-3">Title</Label>
//                   <Input value={title} readOnly />

//                   <Label className="mt-3">Photos</Label>
//                   <Input
//                     type="file"
//                     multiple
//                     innerRef={fileRef}
//                     onChange={(e) => setFiles(e.target.files)}
//                   />

//                   <Button className="mt-3 w-100" color="primary">
//                     Upload New Photos
//                   </Button>
//                 </Form>
//               </CardBody>
//             </Card>
//           </Col>

//           {/* RIGHT: Display */}
//           <Col lg={8}>
//             <Card>
//               <CardBody>
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h4>Gallery Preview</h4>
//                   {images.length > 0 && (
//                     <span>{images.length} Images found</span>
//                   )}
//                 </div>

//                 {driveLink && (
//                   <a
//                     href={driveLink}
//                     target="_blank"
//                     rel="noreferrer"
//                     className="btn btn-outline-primary mb-3"
//                   >
//                     Open Google Drive Folder
//                   </a>
//                 )}

//                 <Row>
//                   {images.length > 0 ? (
//                     images.map((img, i) => (
//                       <Col md={4} key={i} className="mb-3">
//                         <img
//                           src={`${process.env.REACT_APP_API_URL}/storage/${img}`}
//                           className="img-fluid rounded border"
//                           alt={`Gallery ${i}`}
//                           style={{
//                             height: 150,
//                             width: "100%",
//                             objectFit: "cover",
//                           }}
//                         />
//                       </Col>
//                     ))
//                   ) : (
//                     <Col>
//                       <div className="text-center p-5 border rounded bg-light">
//                         {selectedEvent
//                           ? "Click 'View' to see images for this event."
//                           : "Select an event to get started."}
//                       </div>
//                     </Col>
//                   )}
//                 </Row>
//               </CardBody>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default ManageGallery;

import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  Label,
  Form,
} from "reactstrap";
import { APIClient } from "../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const api = new APIClient();

type EventOption = {
  id: string;
  title: string;
};

const ManageGallery = () => {
  const [events, setEvents] = useState<EventOption[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [driveLink, setDriveLink] = useState("");
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* ================= FETCH EVENTS ================= */
  useEffect(() => {
    api
      .get("/api/admin/events")
      .then((res: any) => {
        const allEvents = [
          ...(res.upcoming || []),
          ...(res.recent || []),
          ...(res.past || []),
        ];
        setEvents(
          allEvents.map((e: any) => ({
            id: String(e.id),
            title: e.title,
          })),
        );
      })
      .catch((err) => console.error("Events fetch error:", err));
  }, []);

  /* ================= FETCH GALLERY ================= */
  const fetchGallery = async () => {
    if (!selectedEvent) return alert("Please select an event first");

    setLoading(true);
    try {
      const res: any = await api.get(`/api/admin/gallery/event/${selectedEvent}`);

      // Laravel Controller 'data' key ke andar data bhej raha hai
      if (res && res.data) {
        setImages(Array.isArray(res.data.images) ? res.data.images : []);
        setDriveLink(res.data.drive_link || "");
        if (res.data.event_title) setTitle(res.data.event_title);
      } else {
        setImages([]);
      }
    } catch (err: any) {
      console.error("Gallery fetch failed:", err);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= UPLOAD ================= */
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !files || files.length === 0) return alert("Fill all fields");

    const formData = new FormData();
    formData.append("event_id", selectedEvent);
    formData.append("title", title);
    Array.from(files).forEach((f) => formData.append("photos[]", f));

    try {
      await api.create("/api/admin/gallery", formData);
      toast.success("Uploaded successfully!");
      if (fileRef.current) fileRef.current.value = "";
      setFiles(null);
      fetchGallery();
    } catch (err) {
      toast.error("Upload failed");
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={4}>
            <Card>
              <CardBody>
                <h4>Manage Event Photos</h4>
                <Form onSubmit={handleUpload}>
                  <Label>Select Event</Label>
                  <div className="d-flex gap-2">
                    <Input
                      type="select"
                      value={selectedEvent}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedEvent(id);
                        const ev = events.find((x) => x.id === id);
                        setTitle(ev ? ev.title : "");
                      }}
                    >
                      <option value="">-- Select Event --</option>
                      {events.map((e) => (
                        <option key={e.id} value={e.id}>{e.title}</option>
                      ))}
                    </Input>
                    <Button type="button" color="info" onClick={fetchGallery} disabled={loading}>
                      {loading ? "..." : "View"}
                    </Button>
                  </div>

                  <Label className="mt-3">Title</Label>
                  <Input value={title} readOnly />

                  <Label className="mt-3">Photos</Label>
                  <Input type="file" multiple innerRef={fileRef} onChange={(e) => setFiles(e.target.files)} />

                  <Button className="mt-3 w-100" color="primary">Upload New Photos</Button>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col lg={8}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-between mb-3">
                  <h4>Gallery Preview</h4>
                  {images.length > 0 && <span>{images.length} Images found</span>}
                </div>

                <Row>
                  {images.length > 0 ? (
                    images.map((img, i) => (
                      <Col md={4} key={i} className="mb-3">
                        <img
                          src={img} // Backend direct full URL bhej raha hai
                          className="img-fluid rounded border"
                          alt="Gallery"
                          style={{ height: 150, width: "100%", objectFit: "cover" }}
                          onError={(e) => {
                            console.error("Link broken for:", img);
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Broken+Link";
                          }}
                        />
                      </Col>
                    ))
                  ) : (
                    <Col className="text-center p-5 border bg-light">
                      No images found. Select event and click View.
                    </Col>
                  )}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer/>
    </div>
  );
};

export default ManageGallery;
