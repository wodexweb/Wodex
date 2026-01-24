import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

/* ================= TYPES ================= */

export interface EventItem {
  id: number;
  title: string;
  photo_url: string | null;
  link: string;              // ✅ Google Drive URL
  description?: string;
  end_date: string;
  status: "upcoming" | "recent" | "past";
}

interface EventsResponse {
  success: boolean;
  upcoming: EventItem[];
  recent: EventItem[];
  past: EventItem[];
}

/* ================= API ================= */

export const EventsAPI = {
  async getUpcoming(): Promise<EventItem[]> {
    const res = await api.get<EventsResponse>("/api/events");
    return Array.isArray(res?.upcoming) ? res.upcoming : [];
  },

  async getRecent(): Promise<EventItem[]> {
    const res = await api.get<EventsResponse>("/api/events");
    return Array.isArray(res?.recent) ? res.recent : [];
  },

  async getPast(): Promise<EventItem[]> {
    const res = await api.get<EventsResponse>("/api/events");
    return Array.isArray(res?.past) ? res.past : [];
  },

  async getAll(): Promise<EventItem[]> {
    const res = await api.get<EventsResponse>("/api/events");
    if (!res) return [];
    return [...res.upcoming, ...res.recent, ...res.past];
  },

  async getById(id: string | number): Promise<EventItem | null> {
    const all = await this.getAll();
    return all.find(e => String(e.id) === String(id)) || null;
  },
};
