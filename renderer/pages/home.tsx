import ApolloSymbol from "../components/symbols/ApolloSymbol";
import { createContext, useEffect, useRef, useState } from "react";
import Main from "./main";
import { getItem, removeItem, setItem } from "../utils/localStorage";
import { API_BASE_URL } from "../utils/globalVars";
import StartTrial from "../components/StartTrial";
import jwt, { JwtPayload } from "jsonwebtoken";
import BuyApollo from "../components/BuyApollo";

interface UsernameContextType {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
}

export const UsernameContext = createContext<UsernameContextType>({
  username: "",
  setUsername: () => {},
});

interface ProfileImageUrlContextType {
  profileImageUrl: string;
  setProfileImageUrl: React.Dispatch<React.SetStateAction<string>>;
}

export const ProfileImageUrlContext = createContext<ProfileImageUrlContextType>(
  {
    profileImageUrl: "",
    setProfileImageUrl: () => {},
  }
);

const Home = () => {
  const [email, setEmail] = useState("");
  const [showMain, setShowMain] = useState(true);
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAccessCodeComponent, setShowAccessCodeComponent] = useState(false);
  const divRefs = useRef([]);
  const [code, setCode] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [showStartTrialScreen, setShowStartTrialScreen] = useState(false);
  const [initiatingPaymentMethod, setInitiatingPaymentMethod] = useState(true);
  const [completedTrial, setCompletedTrial] = useState(false);

  useEffect(() => {
    const checkPaymentMethodInfo = async () => {
      const authToken = getItem("auth-token");

      const completedTrial = (jwt.decode(authToken) as JwtPayload)
        .completedTrial;
      if (!completedTrial) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/api/users/payment_methods`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
                "ngrok-skip-browser-warning": "69420",
              },
            }
          );

          const data = await response.json();

          if (response.status === 200) {
            const paymentMethodSet = data.paymentMethodSet as boolean;

            if (!paymentMethodSet) {
              setIsLoading(false);
              setInitiatingPaymentMethod(false);
              setShowStartTrialScreen(true);
              setShowMain(false);
            } else {
              setIsLoading(false);
              setShowMain(true);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (getItem("auth-token") !== null || getItem("email") !== null) {
      const tokenPayload = jwt.decode(getItem("auth-token")) as JwtPayload;

      let email: string;

      if (getItem("auth-token") !== null) {
        email = tokenPayload?.email;
      } else {
        email = getItem("email");
        removeItem("email");
        removeItem("is-pro-user");
        removeItem("is-validated");
        removeItem("userId");
      }

      if (email !== undefined) {
        getUserInfo(email).then(() => {
          const tokenPayload = jwt.decode(getItem("auth-token")) as JwtPayload;

          const isProUser = tokenPayload.isProUser as boolean;
          const isTrialing = tokenPayload.isTrialing as boolean | null;
          const completedTrial = tokenPayload.completedTrial as boolean | null;

          if (isProUser || isTrialing) {
            if (isTrialing) {
              checkPaymentMethodInfo();

              // Check if the user has a payment method set every 10 seconds
              setInterval(() => {
                const tokenPayload = jwt.decode(
                  getItem("auth-token")
                ) as JwtPayload;

                if (!tokenPayload.isProUser) {
                  checkPaymentMethodInfo();
                }
              }, 10000);

              // Get user info every 5 seconds
              setInterval(() => {
                const tokenPayload = jwt.decode(
                  getItem("auth-token")
                ) as JwtPayload;

                if (!isProUser) {
                  getUserInfo(tokenPayload.email).then(() => {
                    const tokenPayload = jwt.decode(
                      getItem("auth-token")
                    ) as JwtPayload;

                    const completedTrial =
                      tokenPayload.completedTrial as boolean;

                    if (completedTrial) {
                      setCompletedTrial(true);
                      setShowMain(false);
                    }
                  });
                } else {
                  setIsLoading(false);

                  checkPaymentMethodInfo();
                }
              }, 5000);

              // setIsLoading(false);
              // setShowMain(true);
            } else {
              setIsLoading(false);
              setShowMain(true);
            }
          } else {
            if (completedTrial) {
              setIsLoading(false);
              setCompletedTrial(true);
              setShowMain(false);

              // Get user info every 5 seconds
              setInterval(() => {
                const tokenPayload = jwt.decode(
                  getItem("auth-token")
                ) as JwtPayload;

                console.log("token payload", tokenPayload);
                if (!tokenPayload.isProUser) {
                  getUserInfo(tokenPayload.email).then(() => {
                    const tokenPayload = jwt.decode(
                      getItem("auth-token")
                    ) as JwtPayload;

                    const isProUser = tokenPayload.isProUser as boolean;

                    if (isProUser) {
                      setIsLoading(false);
                      setShowMain(true);
                    }
                  });
                } else {
                  setIsLoading(false);
                  setShowMain(true);
                }
              }, 5000);
            } else {
              setIsLoading(false);
              setShowStartTrialScreen(true);
            }
          }
        });
      } else {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [showMain]);

  const getUserInfo = async (email: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/me?email=${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization").split(" ")[1];
        setItem("auth-token", authToken);

        setUsername(data.username);
        if (data.profileImageUrl !== null) {
          setProfileImageUrl(data.profileImageUrl);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = async (event, index) => {
    const { value } = event.target;

    const newCode =
      code.length > 0 ? [...code] : (Array(6).fill("") as string[]);

    // Update the value at the specified index
    newCode[index] = value;

    // Join the array into a string to update the state
    setCode(newCode);

    if (value.length === 1 && index < divRefs.current.length - 1) {
      // Move focus to the next div
      divRefs.current[index + 1].focus();
    }

    if (newCode.join("").length == 6) {
      setErrorPlaceholder("");
      await checkAuthCode(newCode.join(""));
    }
  };

  const sendAuthCode = async () => {
    if (email === "") {
      setErrorPlaceholder("email is required");
      return;
    }

    setErrorPlaceholder("");

    const obj = {
      email,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send_auth_code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });
      const data = await response.json();

      if (response.status === 200) {
        setErrorPlaceholder("");
        setShowAccessCodeComponent(true);
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      setErrorPlaceholder(
        "logging in is currently unavailable. please try again later."
      );
    }
  };

  const checkAuthCode = async (authCode: string) => {
    const obj = {
      email,
      authCode,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/auth_code_check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify(obj),
      });

      const data = await response.json();

      if (response.status === 200) {
        const authToken = response.headers.get("Authorization").split(" ")[1];
        setItem("auth-token", authToken);

        setErrorPlaceholder("");
        setUsername(data.username);

        const tokenPayload = jwt.decode(authToken) as JwtPayload;
        const isProUser = tokenPayload.isProUser as boolean;

        if (isProUser) {
          setShowMain(true);
        } else {
          // Allow the user to start a trial before entering apollo
          setShowStartTrialScreen(true);
        }
      } else {
        setErrorPlaceholder(data.message);
      }
    } catch (error) {
      setErrorPlaceholder(
        "auth code check is currently unavailable. please try again later."
      );
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

  return !isLoading ? (
    showMain ? (
      <UsernameContext.Provider value={{ username, setUsername }}>
        <ProfileImageUrlContext.Provider
          value={{ profileImageUrl, setProfileImageUrl }}
        >
          <Main />
        </ProfileImageUrlContext.Provider>
      </UsernameContext.Provider>
    ) : showStartTrialScreen || completedTrial ? (
      completedTrial ? (
        <div className="bg-[#ECEBE8]">
          <BuyApollo />
        </div>
      ) : (
        <div className="bg-[#ECEBE8]">
          <StartTrial
            setShowStartTrialScreen={setShowStartTrialScreen}
            setShowMain={setShowMain}
            initiatingPaymentMethod={initiatingPaymentMethod}
          />
        </div>
      )
    ) : (
      <div className="h-screen flex justify-center items-center bg-[#ECEBE8]">
        <div className="w-[352px] h-fit rounded-4xl border-2 border-solid border-[#E5E4DB] bg-[#FFFFFF] flex flex-col items-center py-10">
          <div>
            <ApolloSymbol />
          </div>

          {!showAccessCodeComponent ? (
            <div className="flex flex-col items-center">
              <div className="w-[280px] h-[53px] rounded-4xl border-2 border-solid border-black flex justify-center mt-12">
                <input
                  className="rounded-4xl border-none text-lg w-full outline-none px-2 bg-[#FFFFFF] text-black"
                  placeholder="email"
                  spellCheck="false"
                  onChange={(e) => setEmail(e.target.value.trim())}
                />
              </div>
              <div>
                <div className="text-red-400 text-xs max-w-[250px] text-center mt-1">
                  {errorPlaceholder}
                </div>
              </div>
              <div
                className="w-[140px] h-[53px] rounded-4xl flex items-center justify-center mt-2.5 cursor-pointer bg-[#313131]"
                onClick={sendAuthCode}
              >
                <div className="text-lg text-white">authorize</div>
              </div>
            </div>
          ) : (
            <>
              <div className="mt-[10px] text-center flex justify-content">{`enter the 6-digit verification code sent to ${email}`}</div>
              <div className="mt-[20px] flex gap-[10px]">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    ref={(ref) => (divRefs.current[index] = ref)}
                    className="border-2 border-solid border-black rounded-md w-[38px] h-[50px] outline-none text-xl text-center bg-[#FFFFFF] text-black"
                    maxLength={1}
                    onChange={(event) => handleInputChange(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  />
                ))}
              </div>
              <div className="text-red-400 text-xs max-w-[250px] text-center mt-1">
                {errorPlaceholder}
              </div>
              <div
                className="mt-[20px] w-[140px] h-[53px] rounded-4xl flex items-center justify-center mt-2.5 cursor-pointer bg-[#313131]"
                onClick={() => {
                  setShowAccessCodeComponent(false);
                  setErrorPlaceholder("");
                  setCode([]);
                }}
              >
                <div className="text-lg text-white outline-none">go back</div>
              </div>{" "}
            </>
          )}
        </div>
      </div>
    )
  ) : (
    <></>
  );
};

export default Home;
