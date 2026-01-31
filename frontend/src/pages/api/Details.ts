import { APIClient } from "../../helpers/api_helper";

const api = new APIClient();

/* =====================================================
   PDF PAGES
===================================================== */

export interface PdfPageItem {
  id: number;
  title: string;
  description?: string;
  link?: string;
  pdf_for: string;
  file_url: any;
  file_path?: string;
  created_at?: string;
}

export const PdfPagesAPI = {
  async getAll(): Promise<PdfPageItem[]> {
    const res = await api.get<PdfPageItem[]>("/api/admin/pdf-pages");
    return Array.isArray(res) ? res : [];
  },
};

/* =====================================================
   MEMBERS (PUBLIC LIST: Name, Role, Photo)
===================================================== */

export interface MemberPublic {
  id: number;
  name: string;
  role: string; // President | Hon. Secretary | Treasurer | etc
  photo_url: string | null;
}

interface MembersPublicResponse {
  success: boolean;
  data: MemberPublic[];
}

export const MembersPublicAPI = {
  async getAll(): Promise<MemberPublic[]> {
    const res = await api.get<MembersPublicResponse>("/api/members");
    return Array.isArray(res?.data) ? res.data : [];
  },
};

/* =====================================================
   MEMBERS (FULL DETAILS)
===================================================== */

export interface MemberDetail {
  id: number;
  gpicc_no: string;
  mobile: string;
  surname: string;
  name: string;
  email: string;
  gender: string;
  city: string;
  pincode: string;
  ciap_no: string;
  address: string;
}

export const MembersDetailAPI = {
  async getAll(): Promise<MemberDetail[]> {
    const res = await api.get<{ data: MemberDetail[] }>("/api/members");
    return res?.data ?? [];
  },
};

/* =====================================================
   EVENTS
===================================================== */

export interface EventItem {
  id: number;
  title: string;
  photo_url: string | null;
  link: string; // Google Drive URL
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
