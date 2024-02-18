import React, { useContext, useEffect, useRef, useState } from "react";
import MIDIHandler from "./MIDIHandler";
import * as ColorUtils from "../utils/determineColors";
import {
  darkModeFontColor,
  fontFamily,
  lightModeFontColor,
} from "../utils/styles";
import Piano from "./Piano";
import {
  ColorContext,
  KeyContext,
  MidiInputContext,
  MidiOutputContext,
  ThemeContext,
} from "../pages/main";
import { getItem } from "../utils/localStorage";
import { detect } from "@tonaljs/chord-detect";
import { Note } from "tonal";
import convertChordToCorrectKey from "../utils/chordConversion";
import {
  ChatBubbleOvalLeftIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import DefaultProfilePic from "./symbols/DefaultProfilePic";
import PlayAccessNotification from "./PlayAccessNotification";
import { UsernameContext } from "../pages/home";
import fs from "fs";
import path from "path";

interface GuestInfo {
  username: string;
  profileImageUrl: string | null;
  playAccess: boolean;
}

interface MessageInfo {
  username: string;
  profileImageUrl: string | null;
  message: string;
}
interface Props {
  closePracticeRoom: () => void;
  isHost: boolean;
  socket: WebSocket;
}
const PracticeRoom = ({ closePracticeRoom, isHost, socket }: Props) => {
  const [color, setColor] = useState(getItem("color-preference"));
  const [pitchValues, setPitchValues] = useState([]);
  const { midiOutput } = useContext(MidiOutputContext);
  const [numOfViewers, setNumOfViewers] = useState(0);
  const [modalSetting, setModalSetting] = useState("Permissions");
  const [guestList, setGuestList] = useState<GuestInfo[]>([]);
  const [showPlayAccessNotification, setShowPlayAccessNotification] =
    useState(false);
  const [playAccess, setPlayAccess] = useState(isHost);
  const { username: selfUsername } = useContext(UsernameContext);

  const { theme } = useContext(ThemeContext);
  const { key } = useContext(KeyContext);
  const { midiInput } = useContext(MidiInputContext);
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<MessageInfo[]>([]);
  const [showRedDot, setShowRedDot] = useState(false);
  const audioContext = new AudioContext();

  const chord = useRef("");
  const altChords = useRef([""]);

  const initializeWebAudio = async () => {
    // Load your processor worklet file
    const filePath = path.join(
      process.cwd(),
      "renderer/public",
      "processor.js"
    );
    const rawWorklet = fs.readFileSync(filePath, "utf8");
    const blob = new Blob([rawWorklet], {
      type: "application/javascript",
    });
    const workletURL = URL.createObjectURL(blob);
    await audioContext.audioWorklet.addModule(workletURL);

    // Create an instance of the audio processor
    const processorNode = new AudioWorkletNode(audioContext, "audio-processor");

    // Get all media devices
    const devices = await navigator.mediaDevices.enumerateDevices();

    // Filter out the audio input devices
    const audioInputDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );

    const chosenDeviceId = audioInputDevices[5].deviceId;

    console.log(audioInputDevices);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: chosenDeviceId,
      },
      video: false,
    });

    const mediaStreamSource = audioContext.createMediaStreamSource(stream);

    mediaStreamSource.connect(processorNode);
    processorNode.connect(audioContext.destination);

    processorNode.port.onmessage = (event) => {
      if (socket !== null) {
        const audioData = event.data;

        const obj = {
          type: "audio",
          room_name: getItem("room-name"),
          audio_data: audioData,
        };
        socket.send(JSON.stringify(obj));
      }
    };
  };

  const chords = detect(
    pitchValues.map((value) => Note.fromMidi(value)),
    { assumePerfectFifth: true }
  );

  chord.current = convertChordToCorrectKey(
    chords[0],
    getItem("key-preference") as string
  );

  altChords.current = chords
    .slice(1, 4)
    .map((chord) =>
      convertChordToCorrectKey(chord, getItem("key-preference") as string)
    );

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    const obj = {
      type: "sendMessage",
      room_name: getItem("room-name"),
      message: message,
    };

    socket.send(JSON.stringify(obj));
    setMessage("");
  };

  const updatePlayAccess = (
    username: string,
    profileImageUrl: string | null,
    playAccess: boolean
  ) => {
    const obj = {
      type: "updatePlayAccess",
      username: username,
      profile_image_url: profileImageUrl,
      play_access: playAccess,
    };

    socket.send(JSON.stringify(obj));
  };

  const handleMidi = (data: any) => {
    setColor(data.note_on_color);
    if (data.midi_message[0] === 144) {
      setPitchValues(pitchValues.concat(data.midi_message[1]));
    } else if (data.midi_message[0] === 128) {
      setPitchValues(
        pitchValues.filter((value) => value != data.midi_message[1])
      );
    }

    if (midiOutput !== null && data.username !== selfUsername) {
      midiOutput.send([
        data.midi_message[0],
        data.midi_message[1],
        data.midi_message[2],
      ]);
    }
  };

  socket.onmessage = (event) => {
    const obj = JSON.parse(event.data);

    if (obj.type === "audio") {
      const audioData = Object.values(obj.audio_data);

      // Create an AudioBuffer
      const audioBuffer = audioContext.createBuffer(
        1,
        audioData.length,
        audioContext.sampleRate
      );

      // Fill the AudioBuffer with the audio data
      audioBuffer.getChannelData(0).set(obj.audio_data);

      // Create an AudioBufferSourceNode
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Connect the AudioBufferSourceNode to the destination
      source.connect(audioContext.destination);

      // Start the AudioBufferSourceNode
      source.start();
    } else if (obj.type === "midi") {
      handleMidi(obj);
    } else if (obj.type === "numOfViewers" && isHost) {
      setNumOfViewers(obj.num_of_viewers);
    } else if (obj.type === "guestInfo") {
      setGuestList(obj.info);
      if (!isHost) {
        const infoList = obj.info as GuestInfo[];
        const access = infoList.find(
          (info) => info.username === selfUsername
        ).playAccess;

        if (playAccess !== access) {
          setPlayAccess(access);
          setShowPlayAccessNotification(true);
          if (!access && midiInput !== null) {
            midiInput.removeListener("noteon");
            midiInput.removeListener("noteoff");
            midiInput.removeListener("midimessage");
          }
        }
      }
    } else if (obj.type === "receivedMessage") {
      modalSetting === "Permissions" && setShowRedDot(true);
      setReceivedMessages([obj.info, ...receivedMessages]);
    }
  };

  return (
    <>
      <div className="absolute z-10">
        <PlayAccessNotification
          playAccess={playAccess}
          showPlayAccessNotification={showPlayAccessNotification}
          setShowPlayAccessNotification={setShowPlayAccessNotification}
        />
      </div>
      <button
        className="absolute right-[45%] top-[45%]"
        onClick={initializeWebAudio}
      >
        Click
      </button>
      <div className="absolute right-[3%] top-[5%]">
        <button
          className="rounded-4xl py-2 px-4"
          onClick={closePracticeRoom}
          style={{
            color: ColorUtils.determineFontColorReverse(),
            backgroundColor: ColorUtils.determineBackgroundColorReverse(),
          }}
        >
          leave the shed.
        </button>
      </div>
      <div
        className="absolute right-[3%] bottom-[23%] border-2 w-[300px] h-[400px] rounded-2xl"
        style={{
          backgroundColor: ColorUtils.determineBackgroundColor(),
          borderColor: ColorUtils.determineBorderColor(),
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-around py-4 px-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke={ColorUtils.determineBorderColor()}
              data-slot="icon"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setModalSetting("Permissions")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <div>
              <ChatBubbleOvalLeftIcon
                className="w-6 h-6 cursor-pointer"
                stroke={ColorUtils.determineBorderColor()}
                onClick={() => {
                  setShowRedDot(false);
                  setModalSetting("Chat");
                }}
              />
            </div>
            {showRedDot && (
              <div className="absolute right-[30%] ">
                <svg
                  className="h-1.5 w-1.5 fill-red-500"
                  viewBox="0 0 6 6"
                  aria-hidden="true"
                >
                  <circle cx={3} cy={3} r={3} />
                </svg>
              </div>
            )}
          </div>
          <div
            className="border-[1px]"
            style={{
              borderColor: ColorUtils.determineBorderColor(),
            }}
          />
          <div
            className={`flex flex-col ${
              modalSetting === "Permissions" ? "justify-start" : "justify-end"
            } grow overflow-y-scroll gap-y-2 px-2 relative ${
              modalSetting === "Permissions" ? "py-4" : "pt-1 pb-4"
            } no-scrollbar`}
          >
            {modalSetting === "Permissions" ? (
              <>
                {guestList.map((guest, index) => (
                  <div
                    key={index}
                    className="flex items-center content-start justify-between px-4"
                  >
                    <div className="flex gap-x-2 items-center">
                      {guest.profileImageUrl === null ? (
                        <DefaultProfilePic height={"36px"} width={"36px"} />
                      ) : (
                        <img
                          className="inline-block h-[36px] w-[36px] rounded-full object-cover"
                          src={guest.profileImageUrl}
                          alt=""
                        />
                      )}
                      <div
                        className="text-sm w-[140px] overflow-x-scroll no-scrollbar whitespace-nowrap"
                        style={{
                          backgroundColor:
                            ColorUtils.determineBackgroundColor(),
                          color: ColorUtils.determineFontColor(),
                        }}
                      >
                        {guest.username}
                      </div>
                    </div>
                    <div>
                      {guest.playAccess ? (
                        isHost ? (
                          <SpeakerWaveIcon
                            className="w-6 h-6 cursor-pointer"
                            stroke={ColorUtils.determineBorderColor()}
                            onClick={() =>
                              updatePlayAccess(
                                guest.username,
                                guest.profileImageUrl,
                                false
                              )
                            }
                          />
                        ) : (
                          <SpeakerWaveIcon
                            className="w-6 h-6"
                            stroke={ColorUtils.determineBorderColor()}
                          />
                        )
                      ) : isHost ? (
                        <SpeakerXMarkIcon
                          className="w-6 h-6 cursor-pointer"
                          stroke={ColorUtils.determineBorderColor()}
                          onClick={() =>
                            updatePlayAccess(
                              guest.username,
                              guest.profileImageUrl,
                              true
                            )
                          }
                        />
                      ) : (
                        <SpeakerXMarkIcon
                          className="w-6 h-6"
                          stroke={ColorUtils.determineBorderColor()}
                        />
                      )}
                    </div>
                  </div>
                ))}
                {guestList.length === 0 && (
                  <div
                    className="flex h-full justify-center items-center text-center text-md"
                    style={{
                      color: ColorUtils.determineFontColor(),
                    }}
                  >
                    It's quiet in here. <br /> Invite someone to your shed.
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col-reverse gap-y-3 grow px-2 overflow-y-scroll no-scrollbar">
                  {receivedMessages.map((message, index) =>
                    message.username !== selfUsername ? (
                      <div key={index} className="flex justify-start gap-x-2">
                        <div className="flex flex-col justify-end">
                          {message.profileImageUrl === null ? (
                            <DefaultProfilePic height={"36px"} width={"36px"} />
                          ) : (
                            <img
                              className="inline-block h-[36px] w-[36px] rounded-full object-cover"
                              src={message.profileImageUrl}
                              alt=""
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div
                            className="text-xs w-[140px] font-light overflow-x-scroll no-scrollbar whitespace-nowrap"
                            style={{
                              color: ColorUtils.determineFontColor(),
                            }}
                          >
                            @{message.username}
                          </div>
                          <div className="mt-1 bg-slate-300 rounded-2xl px-4 py-2 w-fit max-w-[200px] break-all text-black text-md">
                            {message.message}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <div className="flex flex-row-reverse bg-[#1F8AFF] rounded-2xl px-4 py-2 w-fit max-w-[200px] break-all text-white text-md">
                          {message.message}
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div
                  className="flex-none h-[40px] rounded-4xl border-2 flex justify-center items-center justify-between pr-[10px]"
                  style={{
                    borderColor: ColorUtils.determineBorderColor(),
                  }}
                >
                  <input
                    className="rounded-l-4xl border-none text-md w-[89%] outline-none pl-[10px]"
                    style={{
                      backgroundColor: ColorUtils.determineBackgroundColor(),
                      color: ColorUtils.determineFontColor(),
                    }}
                    placeholder="type something..."
                    spellCheck="false"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(event) =>
                      event.key === "Enter" && sendMessage()
                    }
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke={ColorUtils.determineBorderColor()}
                    data-slot="icon"
                    className="w-6 h-6 cursor-pointer"
                    onClick={sendMessage}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {isHost && (
        <div
          className="absolute top-[6%] right-[20%] flex justify-center gap-[10px]"
          style={{
            color:
              theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          }}
        >
          <div className="mr-1">👀</div>
          {numOfViewers}
        </div>
      )}
      <>
        {midiOutput === null && (
          <div
            className="text-center mt-2"
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            Note: select a midi output channel to enable audio playback
          </div>
        )}
        <div className="hidden">
          <MIDIHandler
            socket={socket}
            roomName={getItem("room-name")}
            playAccess={playAccess}
          />
        </div>
        <div className="fixed bottom-0">
          <Piano midiNumbers={pitchValues} noteOnColor={color} />
        </div>
        <div
          className="absolute top-[43%] left-[5%] text-2xl"
          style={{
            color:
              theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          }}
        >
          Key: {key}
        </div>
        <div className="absolute top-[40%] w-full text-center leading-8">
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            <div
              className="mb-2.5 text-5xl text-center"
              style={{
                color:
                  theme === "light-mode"
                    ? lightModeFontColor
                    : darkModeFontColor,
              }}
            >
              {chord.current}
            </div>
            {getItem("show-alt-chords-preference") === "true" &&
              altChords.current.map((value, index) => (
                <div
                  className="text-extralight mb-1.5 text-2xl text-center"
                  style={{
                    color:
                      theme === "light-mode"
                        ? lightModeFontColor
                        : darkModeFontColor,
                  }}
                  key={index}
                >
                  {value}
                </div>
              ))}
          </div>
        </div>
      </>
    </>
  );
};
export default PracticeRoom;
