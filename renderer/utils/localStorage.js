import { LocalStorage } from "node-localstorage";

let localStorage;

if (typeof window !== "undefined") {
  localStorage = window.localStorage;
} else {
  localStorage = new LocalStorage("./local-storage");
}

export function getItem(key) {
  return localStorage.getItem(key);
}

export function setItem(key, value) {
  localStorage.setItem(key, value);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}
