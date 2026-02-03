import type { EventItem } from "../pages/api/Details";

/* =====================================================
   INTERNAL DATE GUARD
===================================================== */

const isValidDate = (date?: string): boolean => {
  if (!date) return false;
  const time = new Date(date).getTime();
  return !isNaN(time);
};

/* =====================================================
   EVENT FILTERS
===================================================== */

export const getUpcomingEvents = (
  events: EventItem[]
): EventItem[] => {
  const now = Date.now();

  return events.filter((e) => {
    if (!isValidDate(e.date)) return false;

    const eventTime = new Date(e.date as string).getTime();
    return eventTime > now;
  });
};

export const getPastEvents = (
  events: EventItem[]
): EventItem[] => {
  const now = Date.now();

  return events.filter((e) => {
    if (!isValidDate(e.date)) return false;

    const eventTime = new Date(e.date as string).getTime();
    return eventTime < now;
  });
};

export const getRecentEvents = (
  events: EventItem[],
  limit = 3
): EventItem[] => {
  return events
    .filter((e) => isValidDate(e.date))
    .sort((a, b) => {
      const timeA = new Date(a.date as string).getTime();
      const timeB = new Date(b.date as string).getTime();
      return timeB - timeA;
    })
    .slice(0, limit);
};
