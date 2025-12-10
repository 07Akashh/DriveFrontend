import { ENV } from "./env";
// const isLive = true;
const getEnvBasedUrl = () => {
  let BASE_URL = "";
  let SOCKET_URL = "";
  if (ENV === "LOCAL") {
    BASE_URL = "http://localhost:8080/api/v1/";
    SOCKET_URL = "http://localhost:8080";
  }
  if (ENV === "DEV") {
    BASE_URL = "https://drive-backend.elitezone.in/api/v1/";
    SOCKET_URL = "https://drive-backend.elitezone.in";
  }
  if (ENV === "PROD") {
    BASE_URL = "https://drive-backend.elitezone.in/api/v1/";
    SOCKET_URL = "https://drive-backend.elitezone.in";
  }
  if (ENV === "QA") {
    BASE_URL = "https://drive-backend.elitezone.in/api/v1/";
    SOCKET_URL = "https://drive-backend.elitezone.in";
  }
  if (ENV === "UAT") {
    BASE_URL = "https://drive-backend.elitezone.in/api/v1/";
    SOCKET_URL = "https://drive-backend.elitezone.in";
  }
  if (ENV === "PREPROD") {
    BASE_URL = "https://drive-backend.elitezone.in/api/v1/";
    SOCKET_URL = "https://drive-backend.elitezone.in";
  }
  return { BASE_URL, SOCKET_URL };
};
const constants = {
  BASE_URL: getEnvBasedUrl().BASE_URL,
  SOCKET_URL: getEnvBasedUrl().SOCKET_URL,

  /********************************** * URL ***********************************/
  URL: {
    LOGIN: "login",
  },
  /****************************** ACTION TYPE********************* */
};

export default constants;
