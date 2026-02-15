// import { useEffect, useState } from "react";
// import { APIClient } from "../helpers/api_helper";

// const api = new APIClient();

// export interface MenuItem {
//   id: number;
//   title: string;
//   url: string;
//   children?: MenuItem[];
// }

// export const useMenu = (location: string) => {
//   const [menu, setMenu] = useState<MenuItem[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api
//       .get(`/api/menus/by-location/${location}`)
//       .then((res: any) => {
//         setMenu(res?.items || []);
//       })
//       .catch(() => setMenu([]))
//       .finally(() => setLoading(false));
//   }, [location]);

//   return { menu, loading };
// };
import { useEffect, useState } from "react";
import { APIClient } from "../helpers/api_helper";

const api = new APIClient();

export interface MenuItem {
  id: number;
  title: string;
  url: string;
  children?: MenuItem[]; // ✅ FIXED
}

export const useMenu = (location: string) => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    api
      .get<any>(`/api/menus/by-location/${location}`)
      .then((res) => {
        // console.log("MENU RESPONSE:", res);

        // interceptor already returns response.data
        if (Array.isArray(res)) {
          setMenu(res);
        } else if (Array.isArray(res?.data)) {
          setMenu(res.data);
        } else if (Array.isArray(res?.items)) {
          setMenu(res.items);
        } else {
          setMenu([]);
        }
      })
      .catch((err) => {
        // console.error("MENU ERROR:", err);
        setMenu([]);
      })
      .finally(() => setLoading(false));
  }, [location]);

  return { menu, loading };
};
