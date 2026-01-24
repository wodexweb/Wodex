import type { EventItem } from "../pages/Events/api/events";

export const normalizeEvent = (e: any): EventItem => {
  if (!e?.id) {
    throw new Error("Event without id");
  }

  if (!e?.link) {
    throw new Error("Event without Google Drive link");
  }

  return {
    id: e.id,
    title: e.title,
    photo_url: e.photo_url ?? null,
    link: e.link,              // 🔥 REQUIRED
    description: e.description,
    end_date: e.end_date,
    status: e.status,
  };
};
