import { fontFamily } from "../utils/styles";
import ApolloSymbol from "./symbols/ApolloSymbol";
import { useRef } from "react";
import {
  determineBackgroundColorForAccessCodeComponent,
  determineBackgroundColorReverse,
  determineBorderColor,
  determineErrorColor,
  determineFontColor,
  determineFontColorReverse,
} from "../utils/determineColors";

interface Props {
  errorPlaceholder: string;
  displayMessage: string;
  setShowSignUp: () => {};
  onSetCode: () => {};
  onCodeCheck: () => {};
  setShowForgotPassword: () => {};
  setShowAccessCodeComponent: () => {};
}
const AccessCodeComponent = ({
  errorPlaceholder,
  displayMessage,
  setShowSignUp,
  onSetCode,
  onCodeCheck,
  setShowForgotPassword,
  setShowAccessCodeComponent,
}) => {
  const divRefs = useRef([]);

  const handleInputChange = (event, index) => {
    const { value } = event.target;

    onSetCode((prevInputValues) => {
      let newInputValues = prevInputValues.substr(0, index) + value;
      if (index < prevInputValues.length - 1) {
        newInputValues += prevInputValues.substr(index + 1);
      }
      return newInputValues;
    });

    if (value.length === 1 && index < divRefs.current.length - 1) {
      divRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (
      event.key === "Backspace" &&
      index > 0 &&
      event.target.value.length === 0
    ) {
      divRefs.current[index - 1].focus();
    }
  };

  const handleReturnToLogin = () => {
    setShowSignUp(false);
    setShowForgotPassword(false);
    setShowAccessCodeComponent(false);
  };

  return (
    <div
      style={{
        width: "352px",
        height: "442px",
        borderRadius: "43px 43px 43px 43px ",
        border: "3px solid #E5E4DB",
        backgroundColor: determineBackgroundColorForAccessCodeComponent(),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "40px",
        paddingBottom: "40px",
      }}
    >
      <div>
        <ApolloSymbol />
      </div>
      <div style={{ position: "absolute", top: "210px" }}>
        <div
          style={{
            fontFamily: fontFamily,
            color: determineFontColor(),
            fontSize: "16px",
            maxWidth: "250px",
            textAlign: "center",
          }}
        >
          {displayMessage}
        </div>
      </div>
      <div style={{ marginTop: "150px", display: "flex", gap: "10px" }}>
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(ref) => (divRefs.current[index] = ref)}
            style={{
              border: `2px solid ${determineBorderColor()}`,
              borderRadius: "5px",
              width: "38px",
              height: "50px",
              outline: "none",
              fontSize: "20px",
              textAlign: "center",
              backgroundColor: determineBackgroundColorForAccessCodeComponent(),
              color: determineFontColor(),
            }}
            maxLength={1}
            onChange={(event) => handleInputChange(event, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        ))}
      </div>
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            fontFamily: fontFamily,
            color: determineErrorColor(),
            fontSize: "16px",
            maxWidth: "250px",
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
          marginTop: "10px",
        }}
        onClick={onCodeCheck}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: "1.4rem",
            color: determineFontColorReverse(),
          }}
        >
          check
        </div>
      </div>
      <div>
        <div
          style={{
            fontFamily: fontFamily,
            color: determineFontColor(),
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "15px",
          }}
          onClick={handleReturnToLogin}
        >
          return to login
        </div>
      </div>
    </div>
  );
};

export default AccessCodeComponent;
