import React from "react";
import { getItem } from "../../utils/localStorage";
import { lightModeFontColor, darkModeFontColor } from "../../utils/styles";

const ArrowBackSymbol = () => {
  return (
    <svg
      width="23"
      height="40"
      viewBox="0 0 23 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 40L0 20L20 0L22.8 2.85L5.65 20L22.8 37.15L20 40Z"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
    </svg>
  );
};

export default ArrowBackSymbol;
