import { useEffect, useState } from "react";
import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

export interface ContactSettings {
  contact_number?: string;
  contact_number_1?: string;
  whatsapp_number?: string;
  email?: string;
  working_hours?: string;
  address?: string;

  facebook_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  linkedin_url?: string;
  x_url?: string;
  custom_url?: string;
}

export const useContactSettings = () => {
  const [data, setData] = useState<ContactSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<ContactSettings>("/api/contact-settings")
      .then((res: any) => {
        // APIClient already returns response.data
        setData(res);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
};
