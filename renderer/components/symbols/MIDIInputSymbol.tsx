import React from "react";
import { getItem } from "../../utils/localStorage";
import { lightModeFontColor, darkModeFontColor } from "../../utils/styles";

const MIDIInputSymbol = () => {
  return (
    <svg
      width="18"
      height="19"
      viewBox="0 0 18 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.95166"
        width="1.90327"
        height="18.0811"
        rx="0.951637"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
      <rect
        x="7.66113"
        width="1.90327"
        height="18.0811"
        rx="0.951637"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
      <rect
        x="13.3716"
        width="1.90327"
        height="18.0811"
        rx="0.951637"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
      <circle
        cx="2.90327"
        cy="12.371"
        r="1.90327"
        fill={
          getItem("theme-preference") === "dark-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        stroke={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        strokeWidth="2"
      />
      <circle
        cx="8.61275"
        cy="3.80611"
        r="1.90327"
        fill={
          getItem("theme-preference") === "dark-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        stroke={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        strokeWidth="2"
      />
      <circle
        cx="14.3227"
        cy="10.4682"
        r="1.90327"
        fill={
          getItem("theme-preference") === "dark-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        stroke={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
        strokeWidth="2"
      />
    </svg>
  );
};

export default MIDIInputSymbol;
