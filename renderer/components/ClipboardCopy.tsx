import { useContext, useState } from "react";
import * as ColorUtils from "../utils/determineColors";
import { ThemeContext } from "../pages/main";
import { darkModeFontColor, lightModeFontColor } from "../utils/styles";

interface Props {
  copyText: string;
}
export default function ClipboardCopy({ copyText }: Props) {
  const { theme } = useContext(ThemeContext);

  // This is the function we wrote earlier
  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = async () => {
    // Asynchronously call copyTextToClipboard
    await copyTextToClipboard(copyText);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div
        style={{
          color:
            theme === "light-mode" ? lightModeFontColor : darkModeFontColor,
        }}
      >
        Invite your friends!
      </div>
      <div
        className="flex items-center rounded-4xl border-2 text-2xl w-[300px] h-[38px] outline-none px-[10px]"
        style={{ borderColor: ColorUtils.determineBorderColor() }}
      >
        <input
          className="outline-none bg-transparent w-[240px]"
          style={{
            color: ColorUtils.determineFontColor(),
          }}
          type="text"
          value={copyText}
          readOnly
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          className="w-7 h-7 cursor-pointer ml-[10px]"
          onClick={handleCopyClick}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke={ColorUtils.determineFontColor()}
            d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
          />
        </svg>
      </div>
    </div>
  );
}
