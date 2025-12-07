import { ENV } from "./env";
// const isLive = true;
const getEnvBasedUrl = () => {
  let BASE_URL = "";
  if (ENV === "LOCAL") {
    BASE_URL = "http://localhost:8080/api/v1/";
  }
  if (ENV === "DEV") {
    BASE_URL = "https://drive-backend-omega.vercel.app/api/v1/";
  }
  if (ENV === "PROD") {
    BASE_URL = "https://drive-backend-omega.vercel.app/api/v1/";
  }
  if (ENV === "QA") {
    BASE_URL = "https://drive-backend-omega.vercel.app/api/v1/";
  }
  if (ENV === "UAT") {
    BASE_URL = "https://drive-backend-omega.vercel.app/api/v1/";
  }
  if (ENV === "PREPROD") {
    BASE_URL = "https://drive-backend-omega.vercel.app/api/v1/";
  }
  return { BASE_URL };
};
const constants = {
  BASE_URL: getEnvBasedUrl().BASE_URL,

  /********************************** * URL ***********************************/
  URL: {
    LOGIN: "login",
  },
  /****************************** ACTION TYPE********************* */
};

export default constants;
