import axios from "axios";
import Cookies from "js-cookie";
import toastHandler from "./Toasthandler";
import allEnv from "../constant/index";

const toast = toastHandler();

export const ApiResponsehandler = async ({
  url,
  headers,
  base_URL,
  accessName,
  ...restConfig
}) => {
  const accessToken = Cookies.get("accessToken");

  const allHeaders = {
    Authorization: "Basic U3RyYW5naWZ5TWFzdGVyOlN0cmFuZ2lmeUF1dGhAMTIz=",
    "Content-Type": "application/json",
  };
  if (!restConfig?.withoutToken) {
    accessToken && (allHeaders[accessName || "accessToken"] = accessToken);
  }

  const config = {
    url: restConfig?.noBase
      ? url
      : (base_URL ? allEnv[base_URL] : allEnv?.BASE_URL) + url,

    method: "GET",
    ...restConfig,
    headers: { ...allHeaders, ...headers },
  };

  try {
    const { data, status } = await axios(config);

    const response = data?.res
      ? { ...data?.res, status: data?.status }
      : { data, status };

    if (response?.status === 200) {
      restConfig?.wantToast && (response?.msg || response?.message) && toast("sus", response?.msg || response?.message);
      return response;
    } else if (response?.error) {
      restConfig?.wantToast && (response?.msg || response?.message) && toast("warn", response?.msg || response?.message);
      return null;
    }
  } catch (error) {
    let res = error?.response?.data || {};

    const finalRes = { msg: res?.err?.msg || "", status: res?.status };
    
    if (typeof res == "string") {
      res = JSON.parse(error?.response?.data || {});
    }

    if (res?.status === 402 || res?.status === 401) {
      finalRes["logout"] = true;
    } else if (error?.code == "ERR_NETWORK") {
      res = { err: { msg: error?.message }, status: error?.code };
    }
    if (restConfig?.wantToast && res?.err?.msg) {
      // ENV == "PROD"
      //   ? toast("warn", "Somthing Went Wrong!")
      //   :
      toast("dan", res?.err?.errs?._message || res?.err?.msg);
    }


    return finalRes;
  }
};
