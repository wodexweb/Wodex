import PastEvents from "./Past/PastEvents";
import RecentEvents from "./Recent/RecentEvents";
import UpcomingEvents from "./Upcoming/UpcomingEvents";
const EventsPage = () => {
  return (
    <>
      <UpcomingEvents />
      <RecentEvents />
      <PastEvents />
    </>
  );
};

export default EventsPage;
