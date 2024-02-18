import { useContext } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fontFamily } from "../utils/styles";
import {
  LiteVersionNotificationContext,
  LiteVersionNotificationVisibilityContext,
} from "../pages/main";
import { shell } from "electron";
import os from "os";

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
          Unlock premium features! Save 20% on Apollo Pro with code "20OFF"!
          <br /> Don't miss out!{" "}
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            className="rounded-4xl"
            style={{
              border: "2px solid black",
              marginTop: "10px",
              padding: "10px",
              textAlign: "center",
              display: "inline-block",
              cursor: "pointer",
            }}
            onClick={openApolloSalesPage}
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

  const openApolloSalesPage = () => {
    shell.openExternal(
      "https://therogersimon.gumroad.com/l/apollo?source=apollo-lite-app"
    );
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
