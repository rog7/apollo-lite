import { fontFamily } from "../utils/styles";
import ApolloSymbol from "./symbols/ApolloSymbol";
import {
  determineBackgroundColorForForgotPassword,
  determineBackgroundColorReverse,
  determineBorderColor,
  determineErrorColor,
  determineFontColor,
  determineFontColorReverse,
} from "../utils/determineColors";

interface Props {
  errorPlaceholder: string;
  displayMessage: string;
  onSubmitEmail: () => {};
  setShowForgotPassword: () => {};
  setEmail: () => {};
}

const ForgotPasswordComponent = ({
  errorPlaceholder,
  displayMessage,
  onSubmitEmail,
  setShowForgotPassword,
  setEmail,
}) => {
  return (
    <div
      style={{
        width: "352px",
        height: "350px",
        borderRadius: "43px 43px 43px 43px ",
        border: "3px solid #E5E4DB",
        backgroundColor: determineBackgroundColorForForgotPassword(),
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
      <div style={{ position: "absolute", top: "225px" }}>
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
      <div
        style={{
          width: "213px",
          height: "53px",
          borderRadius: "50px",
          border: `3px solid ${determineBorderColor()}`,
          display: "flex",
          justifyContent: "center",
          marginTop: "100px",
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
            backgroundColor: determineBackgroundColorForForgotPassword(),
            color: determineFontColor(),
          }}
          placeholder="email"
          spellCheck="false"
          onChange={(e) => setEmail(e.target.value)}
        />
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
        onClick={onSubmitEmail}
      >
        <div
          style={{
            fontFamily: fontFamily,
            fontSize: "1.4rem",
            color: determineFontColorReverse(),
          }}
        >
          send
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
          onClick={() => {
            setShowForgotPassword(false);
            setEmail("");
          }}
        >
          return to login
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordComponent;
