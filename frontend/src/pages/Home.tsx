import React from "react";
import HeroSection from "../components/HeroSlider/HeroSlider";
import AnnouncementSection from "../components/Announcemets/Announcement";
import UpcomingEvents from "../components/Events/Upcoming/UpcomingEvents";
import RecentEvents from "../components/Events/Recent/RecentEvents";
import PastEvents from "../components/Events/Past/PastEvents";
import Members from "../components/Members/Members";
import ImageSlider from "../components/ImageSlider/ImageSlider";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <AnnouncementSection />
      <UpcomingEvents />
      <RecentEvents />
      <PastEvents />
      <Members />
      <ImageSlider />
    </>
  );
};

export default Home;
