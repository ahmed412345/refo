import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// تصفية الأخطاء المعروفة والآمنة من YouTube API
const ignoredErrors = [
  "Cannot read properties of null (reading 'getAttribute')",
  "Failed to execute 'postMessage'",
  "The target origin provided",
  "The YouTube player is not attached to the DOM",
];

// منع ظهور الأخطاء المعروفة في الـ console
const originalError = console.error;
console.error = (...args) => {
  const errorMessage = String(args[0]);
  const isIgnored = ignoredErrors.some((msg) => errorMessage.includes(msg));

  if (!isIgnored) {
    originalError.apply(console, args);
  }
};

// معالج الأخطاء غير المعالجة
window.addEventListener("error", (event) => {
  const isIgnored = ignoredErrors.some((msg) => event.message.includes(msg));
  if (isIgnored) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
