import type { EventItem } from "../pages/Events/api/events";

export const getUpcomingEvents = (events: EventItem[]) => {
  const now = new Date();
  return events.filter((e) => new Date(e.date) > now);
};

export const getPastEvents = (events: EventItem[]) => {
  const now = new Date();
  return events.filter((e) => new Date(e.date) < now);
};

export const getRecentEvents = (events: EventItem[]) => {
  return [...events]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 3);
};
