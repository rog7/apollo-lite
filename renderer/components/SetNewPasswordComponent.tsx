import ApolloSymbol from "./symbols/ApolloSymbol";
import {
  fontFamily,
} from "../utils/styles";
import { useState } from "react";
import {
  determineBackgroundColorForSetNewPassword,
  determineBackgroundColorReverse,
  determineBorderColor,
  determineErrorColor,
  determineFontColor,
  determineFontColorReverse,
} from "../utils/determineColors";

interface Props {
  errorPlaceholder: String;
  setErrorPlaceholder: () => {};
  onSetNewPassword: () => {};
  setShowForgotPassword: () => {};
  setNewPassword: () => {};
  setShowSetNewPasswordComponent: () => {};
}
const SetNewPasswordComponent = ({
  errorPlaceholder,
  setErrorPlaceholder,
  onSetNewPassword,
  setShowForgotPassword,
  setShowSetNewPasswordComponent,
}) => {
  const [passwordValue1, setPasswordValue1] = useState("");
  const [passwordValue2, setPasswordValue2] = useState("");

  const checkIfPasswordMaches = () => {
    if (passwordValue1 === passwordValue2) {
      if (passwordValue1.length === 0) {
        setErrorPlaceholder("password fields cannot be empty");
      } else {
        onSetNewPassword(passwordValue1);
      }
    } else {
      setErrorPlaceholder("passwords do not match");
    }
  };

  const handleReturnToLogin = () => {
    setShowForgotPassword(false);
    setShowSetNewPasswordComponent(false);
  };

  return (
    <div
      style={{
        width: "352px",
        height: "380px",
        borderRadius: "43px",
        backgroundColor: determineBackgroundColorForSetNewPassword(),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        paddingBottom: "20px",
        border: "3px solid #E5E4DB",
        gap: "15px",
      }}
    >
      <div>
        <ApolloSymbol />
      </div>
      <div
        style={{
          width: "213px",
          height: "53px",
          borderRadius: "50px",
          border: `3px solid ${determineBorderColor()}`,
          display: "flex",
          justifyContent: "center",
          marginTop: "15px",
        }}
      >
        <input
          style={{
            borderRadius: "50px",
            border: "none",
            fontSize: "1.5rem",
            width: "95%",
            outline: "none",
            paddingLeft: "15px",
            backgroundColor: determineBackgroundColorForSetNewPassword(),
            color: determineFontColor(),
          }}
          placeholder="new password"
          spellCheck="false"
          type="password"
          onChange={(e) => setPasswordValue1(e.target.value)}
        />
      </div>
      <div
        style={{
          width: "213px",
          height: "53px",
          borderRadius: "50px",
          border: `3px solid ${determineBorderColor()}`,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <input
          style={{
            borderRadius: "50px",
            border: "none",
            fontSize: "1.5rem",
            width: "95%",
            outline: "none",
            paddingLeft: "15px",
            backgroundColor: determineBackgroundColorForSetNewPassword(),
            color: determineFontColor(),
          }}
          placeholder="confirm password"
          spellCheck="false"
          type="password"
          onChange={(e) => setPasswordValue2(e.target.value)}
        />
      </div>
      <div>
        <div
          style={{
            fontFamily: fontFamily,
            color: determineErrorColor(),
            fontSize: "12px",
            maxWidth: "213px",
            textAlign: "center",
            overflowWrap: "break-word",
          }}
        >
          {errorPlaceholder}
        </div>
      </div>
      <div
        style={{
          width: "213px",
          height: "53px",
          borderRadius: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: determineBackgroundColorReverse(),
        }}
        onClick={checkIfPasswordMaches}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: "1.4rem",
            color: determineFontColorReverse(),
          }}
        >
          set password
        </div>
      </div>
      <div
        style={{
          fontFamily: fontFamily,
          color: determineFontColor(),
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={handleReturnToLogin}
      >
        return to login
      </div>
    </div>
  );
};

export default SetNewPasswordComponent;
