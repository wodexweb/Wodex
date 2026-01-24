import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export interface EventItem {
  id: number;
  title: string;
  photo_url: string | null;
  link: string; // 🔥 Google Drive URL
  description: string;
  end_date: string;
  status: "upcoming" | "recent" | "past";
  date?: string;
}

interface EventsResponse {
  success: boolean;
  upcoming: EventItem[];
  recent: EventItem[];
  past: EventItem[];
}

export const EventsAPI = {
  async getAllRaw(): Promise<EventsResponse | null> {
    return await api.get<EventsResponse>("/api/events");
  },

  async getAll(): Promise<EventItem[]> {
    const res = await this.getAllRaw();
    if (!res) return [];
    return [...res.upcoming, ...res.recent, ...res.past];
  },

  async getUpcoming(): Promise<EventItem[]> {
    const res = await this.getAllRaw();
    return res?.upcoming ?? [];
  },

  async getRecent(): Promise<EventItem[]> {
    const res = await this.getAllRaw();
    return res?.recent ?? [];
  },

  async getPast(): Promise<EventItem[]> {
    const res = await this.getAllRaw();
    return res?.past ?? [];
  },

  async getById(id: string | number): Promise<EventItem | null> {
    const all = await this.getAll();
    return all.find(e => String(e.id) === String(id)) || null;
  },
};
