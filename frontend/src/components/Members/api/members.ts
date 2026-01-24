import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export interface Member {
  id: number;
  name: string;
  role: string;
  photo_url: string | null;
}

interface MembersResponse {
  success: boolean;
  data: Member[];
}

export const MembersAPI = {
  async getAll(): Promise<Member[]> {
    const res = await api.get<MembersResponse>("/api/members");
    return Array.isArray(res?.data) ? res.data : [];
  },
};
