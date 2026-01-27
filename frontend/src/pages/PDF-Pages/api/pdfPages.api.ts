import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

/* ================= TYPES ================= */

export interface PdfPageItem {
  file_url: any;
  id: number;
  title: string;
  description?: string;
  link?: string;
  pdf_for: string;
  file_path?: string;
  created_at?: string;
}

/* ================= API ================= */

export const PdfPagesAPI = {
  async getAll(): Promise<PdfPageItem[]> {
    const res = await api.get<PdfPageItem[]>("/api/admin/pdf-pages");

    return Array.isArray(res) ? res : [];
  },
};
