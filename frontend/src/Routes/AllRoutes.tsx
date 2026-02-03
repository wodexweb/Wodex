import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import ScrollToTop from "../components/ScrollToTop";

/* HOME */
import Home from "../pages/Home";

/* ABOUT */
import AboutGPICC from "../pages/About/AboutSubLink_One/About";
import BankDetails from "../pages/About/AboutSubLink_Two/BankDetails";
import Logos from "../pages/About/AboutSubLink_Three/Logos";

/* EVENTS */
import AllEvents from "../pages/Events/AllEvents";
import UpcomingEvents from "../pages/Events/UpcomingEvents";
import RecentEvents from "../pages/Events/RecentEvents";
import PastEvents from "../pages/Events/PastEvents";
import DetailPage from "../pages/DetailPage/Details";

/* OTHERS */
import OfficeBearers from "../pages/OfficeBearers/OfficeBearers";
import MembersDirectory from "../pages/MembersDirectory/MembersDirectory";
import Gallery from "../pages/Gallery/Gallery";
import ContactUs from "../pages/ContactUs/ContactUs";
import PdfPages from "../pages/PDF-Pages/PdfPages";

const AllRoutes: React.FC = () => {
  return (
    <MainLayout>
      <ScrollToTop />

      <Routes>
        {/* HOME */}
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
        <Route path="/events/:id" element={<DetailPage />} />

        {/* OTHERS */}
        <Route path="/office-bearers" element={<OfficeBearers />} />
        <Route path="/members-directory" element={<MembersDirectory />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/pdf-pages" element={<PdfPages />} />
      </Routes>
    </MainLayout>
  );
};

export default AllRoutes;
