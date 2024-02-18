import { removeItem } from "./localStorage";

export const resetSettings = () => {
  removeItem("color-preference");
  removeItem("key-preference");
  removeItem("mode-preference");
  removeItem("show-alt-chords-preference");
  removeItem("theme-preference");
};
