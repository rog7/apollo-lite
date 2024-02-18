import React from "react";
import { getItem } from "../../utils/localStorage";
import { lightModeFontColor, darkModeFontColor } from "../../utils/styles";

const KeySymbol = () => {
  return (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.37242 15.5C2.44358 15.5 1.64931 15.1693 0.989583 14.5078C0.329861 13.8464 0 13.0512 0 12.1224C0 11.1936 0.329958 10.3993 0.989875 9.73958C1.64978 9.07986 2.44308 8.75 3.36977 8.75C3.6927 8.75 3.98264 8.78472 4.23958 8.85417C4.49653 8.92361 4.75 9.02083 5 9.14583V2.25C5 1.76875 5.17135 1.35677 5.51406 1.01406C5.85677 0.671354 6.26875 0.5 6.75 0.5H8.27083C8.75694 0.5 9.16667 0.666667 9.5 1C9.83333 1.33333 10 1.74306 10 2.22917C10 2.71528 9.83333 3.125 9.5 3.45833C9.16667 3.79167 8.75694 3.95833 8.27083 3.95833H6.75V12.125C6.75 13.0531 6.41928 13.8477 5.75783 14.5086C5.09639 15.1695 4.30125 15.5 3.37242 15.5Z"
        fill={
          getItem("theme-preference") === "light-mode"
            ? lightModeFontColor
            : darkModeFontColor
        }
      />
    </svg>
  );
};

export default KeySymbol;
