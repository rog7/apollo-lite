import { ipcRenderer } from "electron";
import { useEffect } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fontFamily } from "../utils/styles";

const UpdateSoftwareNotification = () => {
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
          A new version is available. <br />
          Restart the app to apply the changes.
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
            onClick={restartApp}
          >
            restart now
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
      }
    );

  useEffect(() => {
    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
      notify();
    });
  }, []);

  const restartApp = () => {
    ipcRenderer.send("restart_app");
  };

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

export default UpdateSoftwareNotification;
