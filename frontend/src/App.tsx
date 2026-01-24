import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import "./styles/main.scss";
import "./index.css";

/* ABOUT */
import AboutGPICC from "./pages/About/AboutSubLink_One/About";
import BankDetails from "./pages/About/AboutSubLink_Two/BankDetails";
import Logos from "./pages/About/AboutSubLink_Three/Logos";

/* EVENTS */
import AllEvents from "./pages/Events/AllEvents";
import UpcomingEvents from "./pages/Events/UpcomingEvents";
import RecentEvents from "./pages/Events/RecentEvents";
import PastEvents from "./pages/Events/PastEvents";
// import EventDetails from "./pages/Events/EventDetails";

/* OFFICE BEARERS */
import OfficeBearers from "./pages/OfficeBearers/OfficeBearers";

/* OTHERS */
import MembersDirectory from "./pages/MembersDirectory/MembersDirectory";
import ScrollToTop from "./components/ScrollToTop";
import Gallery from "./pages/Gallery/Gallery";
import ContactUs from "./pages/ContactUs/ContactUs";

const App: React.FC = () => {
  return (
    <MainLayout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        {/* ABOUT */}
        <Route path="/about-iap" element={<AboutGPICC />} />
        <Route path="/bank-details" element={<BankDetails />} />
        <Route path="/logos" element={<Logos />} />

        {/* EVENTS */}
        <Route path="/events" element={<AllEvents />} />
        <Route path="/events/upcoming" element={<UpcomingEvents />} />
        <Route path="/events/recent" element={<RecentEvents />} />
        <Route path="/events/past" element={<PastEvents />} />
        {/* <Route path="/events/:id" element={<EventDetails />} /> */}

        {/* OTHERS */}
        <Route path="/office-bearers" element={<OfficeBearers />} />
        <Route path="/members-directory" element={<MembersDirectory />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
