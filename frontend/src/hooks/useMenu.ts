import { useEffect, useState } from "react";
import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  children?: MenuItem[];
}

export const useMenu = (location: string) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Matches the Laravel route: /api/menus/by-location/{location}
    api
      .get(`/api/menus/by-location/${location}`)
      .then((res: any) => {
        // We expect { items: [...] } from Laravel
        setMenu(res?.items || []);
      })
      .catch(() => setMenu([]))
      .finally(() => setLoading(false));
  }, [location]);

  return { menu, loading };
};
