import React from "react";
import AnnouncementBar from "../components/AnnouncementBar/AnnouncementBar";
import TopAuthNav from "../components/TopAuthNavbar/TopAuthNavbar";
import LogoBar from "../components/Logo/Logo";
import MainNav from "../components/BottomNavbar/BottomNavbar";
import Footer from "../components/Footer/Footer";
import Copyright from "../components/Footer/Copyright";

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <AnnouncementBar />
      <TopAuthNav />
      <LogoBar />
      <MainNav />

      {children}

      <Footer />
      <Copyright />
    </div>
  );
};

export default MainLayout;
