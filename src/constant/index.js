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
    BASE_URL = "https://drive-euchvl7e.b4a.run/api/v1/";
    SOCKET_URL = "https://drive-euchvl7e.b4a.run";
  }
  if (ENV === "PROD") {
    BASE_URL = "https://drive-euchvl7e.b4a.run/api/v1/";
    SOCKET_URL = "https://drive-euchvl7e.b4a.run";
  }
  if (ENV === "QA") {
    BASE_URL = "https://drive-euchvl7e.b4a.run/api/v1/";
    SOCKET_URL = "https://drive-euchvl7e.b4a.run";
  }
  if (ENV === "UAT") {
    BASE_URL = "https://drive-euchvl7e.b4a.run/api/v1/";
    SOCKET_URL = "https://drive-euchvl7e.b4a.run";
  }
  if (ENV === "PREPROD") {
    BASE_URL = "https://drive-euchvl7e.b4a.run/api/v1/";
    SOCKET_URL = "https://drive-euchvl7e.b4a.run";
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
