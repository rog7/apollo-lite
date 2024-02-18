import { useContext } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fontFamily } from "../utils/styles";
import {
  LiteVersionNotificationContext,
  LiteVersionNotificationVisibilityContext,
} from "../pages/main";
import { shell } from "electron";

const LiteVersionNotification = () => {
  const { setShowLiteVersionNotification } = useContext(
    LiteVersionNotificationContext
  );

  const { setliteVersionNotificationVisibility } = useContext(
    LiteVersionNotificationVisibilityContext
  );

  const handleClose = () => {
    setliteVersionNotificationVisibility(false);
    setShowLiteVersionNotification(false);
  };

  const notify = () =>
    toast(
      <div>
        <div
          style={{
            fontSize: "15px",
            fontFamily: fontFamily,
            fontWeight: "400",
            textAlign: "center",
          }}
        >
          This feature is not available <br /> on the lite plan.
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              border: "2px solid black",
              marginTop: "10px",
              padding: "10px",
              textAlign: "center",
              display: "inline-block",
              borderRadius: "20px",
              cursor: "pointer",
            }}
            onClick={openBrowser}
          >
            upgrade
          </div>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Slide,
        onClose: handleClose,
      }
    );

  const openBrowser = () => {
    shell.openExternal("https://buy.stripe.com/28o5mcfVXcOH8Mw005");
  };

  notify();

  return (
    <div>
      <ToastContainer
        style={{ width: "310px" }}
        position="top-right"
        autoClose={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
    </div>
  );
};

export default LiteVersionNotification;
