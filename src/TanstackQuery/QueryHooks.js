import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import Cookies from "js-cookie";
// import { useGlobalContext } from "../GlobalContext/GlobalContext";
// import { useNavigate } from "react-router-dom";
import { ApiResponsehandler } from "../Functions/ApiResponsehandler";

const fetchFn = async ({ payload, clearContext }) => {
  const res = await ApiResponsehandler(payload);

  if (res?.status === 200) {
    return res;
  } else if (res?.logout) {
    // sendUserData("Autologout", "Autologout");
    // localStorage.clear();
    // Cookies.remove("accessToken");
    // clearContext();
  } else {
    throw new Error(res?.msg, {
      cause: res,
    });
  }
};

function useCustomQuery({ queryProps = {}, payload }) {
  // let navigate = useNavigate();
  // const { dispatch, actions, initGS } = useGlobalContext();

  return useQuery({
    ...queryProps,
    queryFn: async () => {
      return await fetchFn({
        payload,
        // clearContext: () => {
        //   sessionStorage.clear();
        //   dispatch({
        //     action: actions?.setContextAtOnce,
        //     value: initGS,
        //   });
        //   navigate("/");
        // },
      });
    },
  });
}

function useCustomMutation(props) {
  // let navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { dispatch, actions, initGS } = useGlobalContext();

  return {
    mutation: useMutation({
      ...props,
      mutationFn: async (payload) => {
        return await fetchFn({
          payload,
          // clearContext: () => {
          //   dispatch({
          //     action: actions?.setContextAtOnce,
          //     value: initGS,
          //   });
          //   navigate("/");
          // },
        });
      },
    }),
    queryClient,
  };
}

export { useCustomQuery, useCustomMutation };
