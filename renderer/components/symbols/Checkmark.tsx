import React from "react";
import { getItem } from "../../utils/localStorage";
import { lightModeFontColor, darkModeFontColor } from "../../utils/styles";

const Checkmark = () => {
  return (
    <>
      {(getItem("theme-preference") as string) === "light-mode" ? (
        <svg
          width="13"
          height="15"
          viewBox="0 0 13 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="svg-element"
            d="M2 9.58621L5.24 13L11 2"
            stroke={lightModeFontColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="13"
          height="15"
          viewBox="0 0 13 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="svg-element"
            d="M2 9.58621L5.24 13L11 2"
            stroke={darkModeFontColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );
};

export default Checkmark;
