import type { EventItem } from "../pages/api/Details";

export const normalizeEvent = (e: any): EventItem => {
  if (!e?.id) {
    throw new Error("Event without id");
  }

  if (!e?.link) {
    throw new Error("Event without Google Drive link");
  }

  return {
    id: Number(e.id),
    title: String(e.title ?? ""),
    photo_url: e.photo_url ?? null,
    link: String(e.link),          // ✅ REQUIRED
    description: String(e.description ?? ""),
    end_date: String(e.end_date ?? ""),
    status: e.status as "upcoming" | "recent" | "past",
    date: e.date ?? undefined,     // ✅ SAFE OPTIONAL
  };
};
