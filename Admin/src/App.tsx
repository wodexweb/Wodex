// import React from "react";

// //import Scss
// import "./assets/scss/themes.scss";

// //imoprt Route
// import Route from "./Routes";

// function App() {
//   return (
//     <React.Fragment>
//       <Route />
//     </React.Fragment>
//   );
// }

// export default App;
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Route from "./Routes";
import { fetchProfile } from "./slices/auth/profile/thunk";

import "./assets/scss/themes.scss";

function App() {
  const dispatch: any = useDispatch();

  useEffect(() => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      dispatch(fetchProfile());
    }
  }, [dispatch]);

  return <Route />;
}

export default App;
