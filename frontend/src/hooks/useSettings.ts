import { useEffect, useState } from "react";
import { APIClient } from "../helpers/api_helper"; // ✅ FIXED

export interface Setting {
  system_name?: string;
  application_title?: string;
  website_title?: string;
  website_description?: string;
  website_keywords?: string;
  website_url?: string;
  website_logo?: string;
}

const api = new APIClient(); // ✅ create client once

export const useSettings = () => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Setting>("/api/settings")
      .then((data) => {
        setSettings(data); // ✅ already response.data
      })
      .catch((err) => {
        console.error("Failed to load settings", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { settings, loading };
};
