// import { useEffect, useState } from "react";
// import { getLoggedInUser } from "../../helpers/api_helper";

// const useProfile = () => {
//   const userProfileSession = getLoggedInUser();
//   var token = userProfileSession && userProfileSession["token"];
//   const [loading, setLoading] = useState(userProfileSession ? false : true);
//   const [userProfile, setUserProfile] = useState(
//     userProfileSession ? userProfileSession : null,
//   );

//   useEffect(() => {
//     const userProfileSession = getLoggedInUser();
//     var token = userProfileSession && userProfileSession["token"];
//     setUserProfile(userProfileSession ? userProfileSession : null);
//     setLoading(token ? false : true);
//   }, []);

//   return { userProfile, loading, token };
// };

// export { useProfile };
import { useEffect, useState } from "react";
import { getLoggedInUser } from "../../helpers/api_helper";

const useProfile = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const sessionUser = getLoggedInUser();

    if (sessionUser?.token) {
      setUserProfile(sessionUser);
      setToken(sessionUser.token);
      setLoading(false);
    } else {
      setUserProfile(null);
      setToken(null);
      setLoading(false);
    }
  }, []);

  return { userProfile, token, loading };
};

export { useProfile };
