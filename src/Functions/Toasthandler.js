import { toast } from "sonner";

export default function toastHandler() {
  let lastMsg = [];

  return (status, msg, options = {}) => {
    let indexAt = lastMsg.indexOf(JSON.stringify(msg));
    const clearMsg = () => {
      let indexAt = lastMsg.indexOf(JSON.stringify(msg));

      indexAt !== -1 && lastMsg.splice(indexAt, 1);
    };

    const opt = {
      action: {
        label: "X",
        onClick: clearMsg,
      },
      onDismiss: clearMsg,
      onAutoClose: clearMsg,
      position: "top-right",
      duration: 4000,
      style: {
        borderRadius: "0.6rem",
      },
      ...options,
    };

    if (indexAt === -1) {
      msg && lastMsg.push(JSON.stringify(msg));
      if (status === "warn") {
        return toast.warning(msg, opt);
      } else if (status === "dan") {
        return toast.error(msg, opt);
      } else if (status === "sus") {
        return toast.success(msg, opt);
      } else if (status === "info") {
        return toast.info(msg, opt);
      } else {
        return toast;
      }
    }
  };
}
