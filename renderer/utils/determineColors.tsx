import { getItem } from "./localStorage";
import {
  darkModeBackgroundColor,
  darkModeFontColor,
  lightModeBackgroundColor,
  lightModeFontColor,
} from "./styles";

export const determineFireEmojiColor = () => {
  return getItem("theme-preference") === null
    ? "#313131"
    : getItem("theme-preference") === "light-mode"
    ? "#313131"
    : "#E5E4DB";
};

export const determineBackgroundColor = () => {
  return getItem("theme-preference") === null
    ? lightModeBackgroundColor
    : getItem("theme-preference") === "light-mode"
    ? lightModeBackgroundColor
    : darkModeBackgroundColor;
};

export const determineBackgroundColorReverse = () => {
  return getItem("theme-preference") === null
    ? darkModeBackgroundColor
    : getItem("theme-preference") === "light-mode"
    ? darkModeBackgroundColor
    : lightModeBackgroundColor;
};

export const determineBackgroundColorForSignUp = () => {
  return getItem("theme-preference") === null
    ? "#FFFFFF"
    : getItem("theme-preference") === "light-mode"
    ? "#FFFFFF"
    : darkModeBackgroundColor;
};

export const determineColorForApolloSymbol = () => {
  return getItem("theme-preference") === null
    ? "#231F20"
    : getItem("theme-preference") === "light-mode"
    ? "#231F20"
    : lightModeBackgroundColor;
};

export const determineBackgroundColorForSetNewPassword = () => {
  return getItem("theme-preference") === null
    ? "#FFFFFF"
    : getItem("theme-preference") === "light-mode"
    ? "#FFFFFF"
    : darkModeBackgroundColor;
};

export const determineBackgroundColorForLogin = () => {
  return getItem("theme-preference") === null
    ? "#FFFFFF"
    : getItem("theme-preference") === "light-mode"
    ? "#FFFFFF"
    : darkModeBackgroundColor;
};

export const determineBackgroundColorForAccessCodeComponent = () => {
  return getItem("theme-preference") === null
    ? "#FFFFFF"
    : getItem("theme-preference") === "light-mode"
    ? "#FFFFFF"
    : darkModeBackgroundColor;
};

export const determineBackgroundColorForForgotPassword = () => {
  return getItem("theme-preference") === null
    ? "#FFFFFF"
    : getItem("theme-preference") === "light-mode"
    ? "#FFFFFF"
    : darkModeBackgroundColor;
};

export const determineBorderColor = () => {
  return getItem("theme-preference") === null
    ? "black"
    : getItem("theme-preference") === "light-mode"
    ? "black"
    : lightModeBackgroundColor;
};

export const determineFontColor = () => {
  return getItem("theme-preference") === null
    ? lightModeFontColor
    : getItem("theme-preference") === "light-mode"
    ? lightModeFontColor
    : darkModeFontColor;
};

export const determineFontColorReverse = () => {
  return getItem("theme-preference") === null
    ? darkModeFontColor
    : getItem("theme-preference") === "light-mode"
    ? darkModeFontColor
    : lightModeFontColor;
};

export const determineErrorColor = () => {
  return getItem("theme-preference") === null
    ? "red"
    : getItem("theme-preference") === "light-mode"
    ? "red"
    : "#FF8080";
};

export const determineFontColorForCreatingShed = () => {
  return getItem("theme-preference") === null
    ? "#313131"
    : getItem("theme-preference") === "light-mode"
    ? "#313131"
    : "#E5E4DB";
};
