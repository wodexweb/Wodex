import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export interface Announcement {
  id: number;
  title: string;
  photo_url: string | null;
  end_date?: string;
}

interface AnnouncementResponse {
  success: boolean;
  data: Announcement[];
}

export const AnnouncementAPI = {
  async getAll(): Promise<Announcement[]> {
    const res = await api.get<AnnouncementResponse>("/api/announcements");
    return Array.isArray(res?.data) ? res.data : [];
  },
};
