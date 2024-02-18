import {
  lightModeFontColor,
  darkModeFontColor,
  fontFamily,
} from "../utils/styles";
import * as ColorUtils from "../utils/determineColors";
import { useContext, useEffect, useRef, useState } from "react";
import PracticeRoom from "./PracticeRoom";
import {
  ShowPracticeRoomContext,
  ShowPracticeRoomInitContext,
  ThemeContext,
} from "../pages/main";
import ClipboardCopy from "./ClipboardCopy";
import { WEBSOCKET_URL } from "../utils/globalVars";
import { ProfileImageUrlContext, UsernameContext } from "../pages/home";
import { removeItem, setItem } from "../utils/localStorage";

interface ShedRoomInfo {
  isPublic: boolean;
  hostProfileImageUrl: string | null;
  hostUsername: string;
  shedName: string;
  guestProfileImageUrls: string[];
  numOfViewers: number;
}

const PracticeRoomInit = () => {
  const [errorPlaceholder, setErrorPlaceholder] = useState("");
  const [roomName, setRoomName] = useState("");
  const roomNameRef = useRef("");
  const { username } = useContext(UsernameContext);
  const { profileImageUrl } = useContext(ProfileImageUrlContext);
  const [socket, setSocket] = useState<WebSocket>(null);
  const { showPracticeRoom, setShowPracticeRoom } = useContext(
    ShowPracticeRoomContext
  );
  const { setShowPracticeRoomInit } = useContext(ShowPracticeRoomInitContext);
  const [isHost, setIsHost] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [shedRoomsFiltered, setShedRoomsFiltered] = useState<ShedRoomInfo[]>(
    []
  );
  const [shedRooms, setShedRooms] = useState<ShedRoomInfo[]>([]);
  const [selectedOption, setSelectedOption] = useState("public shed.");

  useEffect(() => {
    removeItem("room-name");
  }, []);
  const options = [
    {
      id: "public shed.",
      name: "public shed.",
      description: "available to everyone.",
    },
    {
      id: "invite only shed.",
      name: "invite only shed.",
      description: "those who have shed name can join.",
    },
  ];

  const socketInit = () => {
    const newSocket = new WebSocket(WEBSOCKET_URL);

    newSocket.addEventListener("open", () => {
      console.log("Connected to WebSocket server");
    });

    newSocket.onmessage = (event) => {
      handleMessageFromServer(event.data);
    };

    newSocket.addEventListener("close", () => {
      setShowPracticeRoom(false);
      setIsHost(false);
    });

    setSocket(newSocket);

    return newSocket;
  };

  useEffect(() => {
    if (!showPracticeRoom) {
      socketInit();
    }
  }, [showPracticeRoom]);

  const handleMessageFromServer = (data) => {
    const obj = JSON.parse(data);

    if (obj.type === "shedRoomsInfo") {
      const shedRoomData = obj.message as ShedRoomInfo[];

      setShedRooms(shedRoomData);

      roomNameRef.current.length > 0
        ? setShedRoomsFiltered(
            shedRoomData.filter(
              (room) =>
                (room.shedName.includes(roomName) && room.isPublic) ||
                room.shedName === roomNameRef.current
            )
          )
        : setShedRoomsFiltered(shedRoomData.filter((room) => room.isPublic));
    } else if (obj.type === "joinedRoom") {
      if (obj.message) {
        setRoomName("");
        roomNameRef.current = "";
        setShowPracticeRoom(true);
      }
    } else if (obj.type === "error") {
      setErrorPlaceholder(obj.message);
    }
  };

  const joinPracticeRoom = (
    isHost: boolean,
    isPublic: boolean,
    roomName: string
  ) => {
    const obj = {
      type: "joinShedRoom",
      is_public: isPublic,
      is_host: isHost,
      room_name: roomName,
      username: username,
      profile_image_url: profileImageUrl.length > 0 ? profileImageUrl : null,
    };
    if (socket === null) {
      const socket = socketInit();

      socket.onopen = () => {
        socket.send(JSON.stringify(obj));
      };
    } else {
      socket.send(JSON.stringify(obj));
    }

    setItem("room-name", roomName);
    setRoomName(roomName);
    setIsHost(isHost);
  };

  const closePracticeRoom = () => {
    setRoomName("");
    removeItem("room-name");
    socket.close();
    setShowPracticeRoom(false);
    setSocket(null);
  };

  return !showPracticeRoom ? (
    <div className="w-full h-[70vh] mt-16 flex flex-col justify-center items-center gap-[20px]">
      <div
        style={{
          position: "absolute",
          right: "3%",
          top: "4.5%",
        }}
      >
        <button
          className="rounded-4xl py-2 px-4"
          onClick={() => {
            if (socket !== null) {
              socket.close();
            }
            setShowPracticeRoomInit(false);
          }}
          style={{
            color: ColorUtils.determineFontColorReverse(),
            backgroundColor: ColorUtils.determineBackgroundColorReverse(),
          }}
        >
          go back.
        </button>
      </div>
      <div
        style={{
          backgroundColor: ColorUtils.determineBackgroundColor(),
        }}
      >
        <div
          className="w-[722px] h-[421px] rounded-3xl border-2 flex flex-col items-center px-[23px]"
          style={{
            backgroundColor: ColorUtils.determineBackgroundColor(),
            borderColor: ColorUtils.determineBorderColor(),
          }}
        >
          <div
            className="w-full h-[53px] rounded-4xl border-2 flex justify-center mt-[22px]"
            style={{
              borderColor: ColorUtils.determineBorderColor(),
            }}
          >
            <input
              className="rounded-4xl border-none text-2xl w-[95%] outline-none pl-[10px]"
              style={{
                backgroundColor: ColorUtils.determineBackgroundColor(),
                color: ColorUtils.determineFontColor(),
              }}
              placeholder="find or name a shed..."
              spellCheck="false"
              value={roomName}
              onChange={(e) => {
                let inputValue = e.target.value
                  .trim()
                  .toLowerCase()
                  .slice(0, 10);
                setRoomName(inputValue);
                roomNameRef.current = inputValue;
                setShedRoomsFiltered(
                  shedRooms.filter(
                    (room) =>
                      (room.shedName.includes(inputValue) && room.isPublic) ||
                      room.shedName === inputValue
                  )
                );
              }}
            />
          </div>
          {shedRoomsFiltered.length !== 0 ? (
            <div className="flex flex-col w-full mt-[13px] h-full overflow-y-scroll no-scrollbar rounded-2xl relative">
              {shedRoomsFiltered.length > 3 && (
                <div
                  className={`-mt-[8px] flex-none sticky w-full h-[15px] top-0 bg-gradient-to-b ${
                    theme === "light-mode" ? "from-[#ECEBE8]" : "from-[#313131]"
                  }`}
                ></div>
              )}
              <div className="flex flex-col gap-y-[8px]">
                {shedRoomsFiltered.map((room, index) => (
                  <div
                    className="flex-none h-[83px] rounded-2xl flex px-[15px] items-center"
                    style={{
                      backgroundColor: "white",
                    }}
                    key={index}
                  >
                    <div className="flex items-center gap-[11px]">
                      {room.hostProfileImageUrl === null ? (
                        <span
                          className={`inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100`}
                        >
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                      ) : (
                        <img
                          className="inline-block h-14 w-14 rounded-full object-cover"
                          src={room.hostProfileImageUrl}
                          alt=""
                        />
                      )}
                      <div className="text-sm text-black w-[260px] overflow-x-scroll no-scrollbar whitespace-nowrap mr-[70px]">
                        {room.hostUsername} started {room.shedName} shed
                      </div>
                    </div>
                    <div className="flex w-[128px] h-[32px] justify-end -space-x-2 overflow-hidden mr-[11px]">
                      {room.guestProfileImageUrls.map((url, index) => (
                        <img
                          key={index}
                          className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                          src={url}
                          alt=""
                        />
                      ))}
                    </div>
                    <div className="text-xs text-black w-[20px] overflow-x-scroll no-scrollbar whitespace-nowrap mr-[11px]">
                      {room.numOfViewers}
                    </div>
                    <div
                      className="w-[68px] h-[36px] rounded-4xl flex items-center justify-center cursor-pointer"
                      style={{
                        backgroundColor: "#313131",
                      }}
                      onClick={() => {
                        joinPracticeRoom(false, true, room.shedName);
                      }}
                    >
                      <div className="text-white">join</div>
                    </div>
                  </div>
                ))}
              </div>
              {shedRoomsFiltered.length > 3 && (
                <div
                  className={`-mt-[8px] flex-none sticky w-full h-[15px] bottom-[0%] bg-gradient-to-t ${
                    theme === "light-mode" ? "from-[#ECEBE8]" : "from-[#313131]"
                  }`}
                ></div>
              )}
            </div>
          ) : roomName.length !== 0 ? (
            <div className="mt-6 flex flex-col justify-center items-center gap-y-4">
              <div
                className="text-lg opacity-30"
                style={{
                  color: ColorUtils.determineFontColorForCreatingShed(),
                }}
              >
                "{roomName}" is not an active shed room
              </div>
              <div
                className="text-lg"
                style={{
                  color: ColorUtils.determineFontColorForCreatingShed(),
                }}
              >
                want to create the "{roomName}" shed? pick one of the following.
              </div>
              <div className="mt-8">
                <fieldset>
                  <div className="space-y-5">
                    {options.map((option) => (
                      <div
                        key={option.id}
                        className="relative flex items-center"
                      >
                        <div className="flex h-6 items-center">
                          <input
                            id={option.id}
                            aria-describedby={`${option.id}-description`}
                            type="radio"
                            checked={option.id === selectedOption}
                            className="h-4 w-4 outline-none accent-slate-800"
                            onChange={() => setSelectedOption(option.id)}
                          />
                        </div>
                        <div
                          className="ml-3 text-lg"
                          style={{
                            color:
                              ColorUtils.determineFontColorForCreatingShed(),
                          }}
                        >
                          <label
                            htmlFor={option.id}
                            className="font-medium"
                            style={{
                              color:
                                ColorUtils.determineFontColorForCreatingShed(),
                            }}
                          >
                            {option.name}
                          </label>{" "}
                          <span
                            id={`${option.id}-description`}
                            className="opacity-50"
                            style={{
                              color:
                                ColorUtils.determineFontColorForCreatingShed(),
                            }}
                          >
                            {option.description}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
              <div
                className="mt-2 h-fit w-fit p-3 rounded-4xl flex items-center justify-center cursor-pointer"
                style={{
                  backgroundColor: ColorUtils.determineBackgroundColorReverse(),
                }}
                onClick={() => {
                  setItem("room-name", roomName);
                  joinPracticeRoom(
                    true,
                    selectedOption === "public shed.",
                    roomName
                  );
                }}
              >
                <div style={{ color: ColorUtils.determineBackgroundColor() }}>
                  create "{roomName}" shed room
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col grow w-full justify-center items-center gap-y-2">
              <div
                className="font-bold text-2xl text-center"
                style={{
                  color: ColorUtils.determineFontColorForCreatingShed(),
                }}
              >
                No public shed sessions are currently active.
              </div>
              <div
                className="text-md"
                style={{
                  color: ColorUtils.determineFontColorForCreatingShed(),
                }}
              >
                Create your own public shed and let the good times roll! 🚀
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <PracticeRoom
      closePracticeRoom={closePracticeRoom}
      isHost={isHost}
      socket={socket}
    />
  );
};

export default PracticeRoomInit;
