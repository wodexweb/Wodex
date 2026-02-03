import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

/* ================= TYPES ================= */

export interface HeaderSetting {
  header_title: string | null;
  drive_link: string | null;
  title_color: string | null;
}

interface HeaderSettingResponse {
  success: boolean;
  data: HeaderSetting | null;
}

/* ================= API ================= */

export const HeaderSettingAPI = {
  async get(): Promise<HeaderSetting | null> {
    const res = await api.get<HeaderSettingResponse>("/api/header");
    return res?.data ?? null;
  },
};
