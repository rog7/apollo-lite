import React, { useContext, useState } from "react";
import DropdownList from "./DropdownList";
import {
  ColorContext,
  LiteVersionNotificationContext,
  ModeContext,
  ShowPracticeRoomContext,
  SuiteUserContext,
  ThemeContext,
} from "../pages/main";
import { ColorResult, BlockPicker } from "react-color";
import { setItem } from "../utils/localStorage";
import ColorSymbol from "./symbols/ColorSymbol";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";
import { AnimatePresence, motion } from "framer-motion";
import KeySymbol from "./symbols/KeySymbol";
import OptionsSymbol from "./symbols/OptionsSymbol";

const Menu = () => {
  const { color, setColor } = useContext(ColorContext);
  const { mode } = useContext(ModeContext);
  const [visibleDropdown, setDropdown] = useState("");
  const { theme } = useContext(ThemeContext);
  const { isSuiteUser } = useContext(SuiteUserContext);
  const { triggerUpgradeNotification } = useContext(
    LiteVersionNotificationContext
  );
  const { showPracticeRoom } = useContext(ShowPracticeRoomContext);
  const handleColorChange = (newColor: ColorResult) => {
    setItem("color-preference", newColor.hex);
    setColor(newColor.hex);
  };

  const handleDropdownChange = (menuItem: string) => {
    if (menuItem === visibleDropdown) {
      setDropdown("");
    } else {
      setDropdown(menuItem);
    }
  };

  window.addEventListener("click", (event) => {
    const menuDiv = document.getElementById("menu-id");
    if (menuDiv !== null) {
      if (!menuDiv.contains(event.target as Node)) {
        setDropdown("");
      }
    }
  });

  return (
    <div
      id="menu-id"
      className="w-[39%] h-[37px] mt-8 mx-auto px-[70px] border-2 rounded-4xl flex justify-between items-center"
      style={{
        borderColor:
          theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
      }}
    >
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("OPTIONS")}
        >
          <OptionsSymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            OPTIONS
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "OPTIONS" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <DropdownList
                dropdownList={
                  !showPracticeRoom
                    ? [
                        "edit profile",
                        mode === "detect mode"
                          ? "switch to search mode"
                          : "switch to detect mode",
                        "show alt chord names",
                        theme === "light-mode"
                          ? "switch to dark mode"
                          : "switch to light mode",
                      ]
                    : [
                        "show alt chord names",
                        theme === "light-mode"
                          ? "switch to dark mode"
                          : "switch to light mode",
                      ]
                }
                leftPosition={"33%"}
                width={"160px"}
                paddingX={"20px"}
                menuItem={"OPTIONS"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("KEY")}
        >
          <KeySymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            KEY
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "KEY" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <DropdownList
                dropdownList={[
                  "Ab",
                  "A",
                  "Bb",
                  "B",
                  "C",
                  "Db",
                  "D",
                  "Eb",
                  "E",
                  "F",
                  "F#",
                  "G",
                ]}
                leftPosition={"46%"}
                width={"40px"}
                paddingX={"55px"}
                menuItem={"KEY"}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div>
        <div
          className="cursor-pointer flex gap-[5px] items-center"
          onClick={() => handleDropdownChange("COLOR")}
        >
          <ColorSymbol />
          <div
            style={{
              color:
                theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
            }}
          >
            COLOR
          </div>
        </div>
        <AnimatePresence>
          {visibleDropdown === "COLOR" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              <div className="absolute top-[12%] left-[55%] z-[1]">
                <BlockPicker
                  color={color}
                  colors={[
                    "#9D7575",
                    "#E1C7A0",
                    "#DBDC97",
                    "#A1B2A1",
                    "#AABDD9",
                    "#9F9482",
                    "#999999",
                    "#AC9BAA",
                    "#DDCCCC",
                    "#D6EACE",
                  ]}
                  onChange={
                    isSuiteUser ? handleColorChange : triggerUpgradeNotification
                  }
                  className="premium-feature"
                  disableAlpha={true}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Menu;
