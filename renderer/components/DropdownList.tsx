import React, { useContext, useState } from "react";
import { getItem, setItem } from "../utils/localStorage";
import {
  AltChordsContext,
  KeyContext,
  ModeContext,
  SuiteUserContext,
  ThemeContext,
} from "../pages/main";
import Checkmark from "./symbols/Checkmark";
import {
  darkModeBackgroundColor,
  darkModeFontColor,
  lightModeBackgroundColor,
  lightModeFontColor,
} from "../utils/styles";
import ProfileModal from "./ProfileModal";

interface Props {
  dropdownList: string[];
  leftPosition: string;
  width: string;
  paddingX: string;
  menuItem: string;
}
const DropdownList = ({
  dropdownList,
  leftPosition,
  width,
  paddingX,
  menuItem,
}: Props) => {
  const { setKey } = useContext(KeyContext);
  const { showAltChords, setShowAltChords } = useContext(AltChordsContext);
  const { setMode } = useContext(ModeContext);
  const { theme, setTheme } = useContext(ThemeContext);
  const { key } = useContext(KeyContext);
  const { isSuiteUser } = useContext(SuiteUserContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const setPreference = (preference: string) => {
    if (menuItem === "OPTIONS" && preference.includes("show alt")) {
      setItem("show-alt-chords-preference", !showAltChords);
      setShowAltChords(!showAltChords);
    } else if (menuItem === "OPTIONS" && preference.includes("search mode")) {
      setItem("mode-preference", "search mode");
      setMode("search mode");
    } else if (menuItem === "OPTIONS" && preference.includes("detect mode")) {
      setItem("mode-preference", "detect mode");
      setMode("detect mode");
    } else if (menuItem === "OPTIONS" && preference.includes("light mode")) {
      setItem("theme-preference", "light-mode");
      setTheme("light-mode");
    } else if (menuItem === "OPTIONS" && preference.includes("dark mode")) {
      setItem("theme-preference", "dark-mode");
      setTheme("dark-mode");
    } else if (menuItem === "OPTIONS" && preference.includes("edit profile")) {
      setShowProfileModal(!showProfileModal);
      setShowProfileModal(!showProfileModal);
    } else if (menuItem === "KEY") {
      setItem("key-preference", preference);
      setKey(preference);
    }
  };

  return (
    <>
      <div
        className="flex flex-col absolute top-[10%] rounded-bl-4xl rounded-br-4xl border-2 pt-[11px] z-[1] items-center text-center"
        style={{
          borderColor:
            theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          left: leftPosition,
          width: width,
          color:
            theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
          backgroundColor:
            theme === "light-mode"
              ? lightModeBackgroundColor
              : darkModeBackgroundColor,
        }}
      >
        {dropdownList.map((value, index) => (
          <div
            className="cursor-pointer pb-[8px] relative"
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
            onClick={() => setPreference(value)}
            key={index}
          >
            {value}
            {menuItem === "KEY" && value === key && (
              <div
                className={`absolute top-[10%] ${
                  value.length === 1 ? "left-[22px]" : "left-[25px]"
                }`}
              >
                <Checkmark />
              </div>
            )}
            {menuItem === "OPTIONS" &&
            value.includes("show alt") &&
            getItem("show-alt-chords-preference") === "true" ? (
              <div className="absolute top-[50%] left-[74%]">
                <Checkmark />
              </div>
            ) : (
              <></>
            )}
          </div>
        ))}
        {showProfileModal && (
          <ProfileModal setShowProfileModal={setShowProfileModal} />
        )}
      </div>
    </>
  );
};

export default DropdownList;
