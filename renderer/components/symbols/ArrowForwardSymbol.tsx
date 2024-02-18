import React from "react";
import { getItem } from "../../utils/localStorage";
import { lightModeFontColor, darkModeFontColor } from "../../utils/styles";

const ArrowForwardSymbol = () => {
  return (
    <svg
      width="23"
      height="40"
      viewBox="0 0 23 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.1999 40.8999L0.399902 38.0499L17.5499 20.8999L0.399902 3.7499L3.1999 0.899902L23.1999 20.8999L3.1999 40.8999Z"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
    </svg>
  );
};

export default ArrowForwardSymbol;
