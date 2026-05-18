import CryptoJS from "crypto-js";

const password = "VivaX@2026";

const hash =
  CryptoJS.SHA256(password).toString();

console.log(hash);