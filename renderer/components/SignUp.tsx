import { fontFamily } from "../utils/styles";
import ApolloSymbol from "./symbols/ApolloSymbol";
import AccessCodeComponent from "./AccessCodeComponent";
import {
  determineBackgroundColor,
  determineBackgroundColorForSignUp,
  determineBackgroundColorReverse,
  determineBorderColor,
  determineErrorColor,
  determineFontColor,
  determineFontColorReverse,
} from "../utils/determineColors";

interface Props {
  setUsername: () => {};
  setEmail: () => {};
  setPassword: () => {};
  signUpUser: () => {};
  showAccessCodeComponent: boolean;
  setShowSignUp: () => {};
  errorPlaceholder: String;
  setSignUpCode: () => {};
  onSignUpCodeCheck: () => {};
  setShowForgotPassword: () => {};
  setShowAccessCodeComponent: () => {};
  email: String;
  password: String;
  username: String;
}

const SignUp = ({
  setUsername,
  setEmail,
  setPassword,
  signUpUser,
  showAccessCodeComponent,
  setShowSignUp,
  errorPlaceholder,
  setSignUpCode,
  onSignUpCodeCheck,
  setShowForgotPassword,
  setShowAccessCodeComponent,
  email,
  password,
  username,
}) => {
  const handleReturnToLogin = () => {
    if (password.length > 0) {
      setPassword("");
    }
    if (email.length > 0) {
      setEmail("");
    }

    if (username.length > 0) {
      setUsername("");
    }

    setShowSignUp(false);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        backgroundColor: determineBackgroundColor(),
      }}
    >
      {!showAccessCodeComponent ? (
        <div
          style={{
            width: "345px",
            height: "480px",
            borderRadius: "43px",
            backgroundColor: determineBackgroundColorForSignUp(),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: "40px",
            paddingBottom: "40px",
            border: "3px solid #E5E4DB",
          }}
        >
          <div>
            <ApolloSymbol />
          </div>
          <div style={{ display: "flex", gap: "40px", marginTop: "50px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
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
                        backgroundColor: determineBackgroundColorForSignUp(),
                        color: determineFontColor(),
                      }}
                      placeholder="username"
                      spellCheck="false"
                      onChange={(e) => setUsername(e.target.value)}
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
                        backgroundColor: determineBackgroundColorForSignUp(),
                        color: determineFontColor(),
                      }}
                      placeholder="email"
                      spellCheck="false"
                      onChange={(e) => setEmail(e.target.value)}
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
                        backgroundColor: determineBackgroundColorForSignUp(),
                        color: determineFontColor(),
                      }}
                      placeholder="password"
                      spellCheck="false"
                      type="password"
                      onChange={(e) => setPassword(e.target.value)}
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
                    onClick={signUpUser}
                  >
                    <div
                      style={{
                        fontFamily: fontFamily,
                        fontSize: "1.4rem",
                        color: determineFontColorReverse(),
                      }}
                    >
                      sign up
                    </div>
                  </div>
                </div>
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
          </div>
        </div>
      ) : (
        <AccessCodeComponent
          errorPlaceholder={errorPlaceholder}
          displayMessage={`enter the 6-digit verification code sent to ${email}`}
          setShowSignUp={setShowSignUp}
          onSetCode={setSignUpCode}
          onCodeCheck={onSignUpCodeCheck}
          setShowForgotPassword={setShowForgotPassword}
          setShowAccessCodeComponent={setShowAccessCodeComponent}
        />
      )}
    </div>
  );
};

export default SignUp;
