import { APIClient } from "../../../helpers/api_helper";

const api = new APIClient();

export interface Member {
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

export const MembersAPI = {
  async getAll(): Promise<Member[]> {
    const res = await api.get<{ data: Member[] }>("/api/members");
    return res?.data ?? [];
  },
};
