import {
  USER_ROLES
} from "./constants";

const getRolePath = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "/admin";

    case USER_ROLES.HR:
      return "/hr";

    case USER_ROLES.EMPLOYEE:
      return "/employee";

    default:
      return "/login";
  }
};

export default getRolePath;