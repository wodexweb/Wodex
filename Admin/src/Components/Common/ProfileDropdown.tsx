import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import { createSelector } from "reselect";
import { useSelector } from "react-redux";

// fallback image
import avatarFallback from "../../assets/images/users/user-dummy-img.jpg";

const ProfileDropdown = () => {
  /* ================= REDUX (SINGLE SOURCE) ================= */

  const selectUser = createSelector(
    (state: any) => state.Profile,
    (profile) => profile.user
  );

  const reduxUser = useSelector(selectUser);

  /* ================= LOCAL STATE (UI ONLY) ================= */

  const [userName, setUserName] = useState("Admin");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);

  const toggleProfileDropdown = () => setIsProfileDropdown((prev) => !prev);

  /* ================= SYNC REDUX → UI ================= */

  useEffect(() => {
    if (!reduxUser) {
      setUserName("Admin");
      setAvatar(null);
      return;
    }

    // name priority (safe for otp / normal login)
    const name =
      reduxUser.first_name || reduxUser.name || reduxUser.email || "Admin";

    setUserName(name);

    // avatar
    setAvatar(reduxUser.avatar || null);
  }, [reduxUser]);

  /* ================= UI ================= */

  return (
    <Dropdown
      isOpen={isProfileDropdown}
      toggle={toggleProfileDropdown}
      className="ms-sm-3 header-item topbar-user"
    >
      <DropdownToggle tag="button" type="button" className="btn">
        <span className="d-flex align-items-center">
          <img
            className="rounded-circle header-profile-user"
            src={avatar ? `${avatar}?t=${Date.now()}` : avatarFallback}
            alt="Avatar"
          />
          <span className="text-start ms-xl-2">
            <span className="d-none d-xl-inline-block ms-1 fw-medium">
              {userName}
            </span>
            <span className="d-none d-xl-block ms-1 fs-12 text-muted">
              Admin
            </span>
          </span>
        </span>
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu-end">
        <h6 className="dropdown-header">Welcome {userName}!</h6>

        <DropdownItem tag={Link} to="/profile">
          <i className="mdi mdi-account-circle me-1"></i> Profile
        </DropdownItem>

        <DropdownItem divider />

        <DropdownItem tag={Link} to="/logout">
          <i className="mdi mdi-logout me-1"></i> Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   Dropdown,
//   DropdownItem,
//   DropdownMenu,
//   DropdownToggle,
// } from "reactstrap";
// import { createSelector } from "reselect";
// import { useSelector } from "react-redux";

// import avatarFallback from "../../assets/images/users/user-dummy-img.jpg";

// const ProfileDropdown = () => {
//   const selectUser = createSelector(
//     (state: any) => state.Profile,
//     (profile) => profile.user
//   );

//   const user = useSelector(selectUser);
//   const [open, setOpen] = useState(false);

//   const name = user?.name || user?.email || "Admin";
//   const avatar = user?.avatar || avatarFallback;

//   return (
//     <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
//       <DropdownToggle className="btn">
//         <img
//           src={`${avatar}?t=${Date.now()}`}
//           className="rounded-circle header-profile-user"
//           alt="avatar"
//         />
//         <span className="ms-2">{name}</span>
//       </DropdownToggle>

//       <DropdownMenu end>
//         <DropdownItem tag={Link} to="/profile">
//           Profile
//         </DropdownItem>
//         <DropdownItem divider />
//         <DropdownItem tag={Link} to="/logout">
//           Logout
//         </DropdownItem>
//       </DropdownMenu>
//     </Dropdown>
//   );
// };

// export default ProfileDropdown;
