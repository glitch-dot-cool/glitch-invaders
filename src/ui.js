import { Fetch } from "./utils/fetch.js";
import { perfModes } from "./constants.js";
import { detectMobile } from "./utils/detectMobile.js";

const input = document.querySelector("#username-input");
const inputContainer = document.querySelector(".form");
const submitButton = document.querySelector("#submit-btn");
const errorModal = document.querySelector(".error-modal");
const graphicsOptionsContainer = document.querySelector(".graphics-options");
const mobileWarningModal = document.querySelector(".mobile-modal");

const isMobile = detectMobile();
if (isMobile) {
  mobileWarningModal.style.display = "flex";
}

const refreshScore = new Event("refreshScore");

let inputText = "";
let hasSubmitted = false;

window.addEventListener("death", () => {
  inputContainer.style.display = "flex";
});

input.addEventListener("input", (e) => {
  inputText = e.target.value;
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const [mostRecentScore] = JSON.parse(
    localStorage.getItem("glitchInvadersScores")
  ).sort((a, b) => b.timestamp - a.timestamp);

  const payload = JSON.stringify({
    discord_user: inputText,
    score: mostRecentScore.score,
    level_reached: mostRecentScore.wave,
  });
  if (!hasSubmitted) {
    const res = await Fetch.post("score", payload);
    console.log(res);

    if (res.includes("error")) {
      errorModal.style.display = "block";
      setTimeout(() => {
        errorModal.style.display = "none";
      }, 3000);
    } else {
      hasSubmitted = true;
      window.dispatchEvent(refreshScore);
    }
  }
});

graphicsOptionsContainer.addEventListener("click", (e) => {
  let selectedPerfMode = perfModes.DEFAULT;
  switch (e.target.id) {
    case "low":
      selectedPerfMode = perfModes.LOW;
      break;
    case "mid":
      selectedPerfMode = perfModes.MEDIUM;
      break;
    case "high":
      selectedPerfMode = perfModes.DEFAULT;
      break;
  }
  const setPerfMode = new CustomEvent("setPerfMode", {
    detail: selectedPerfMode,
  });
  dispatchEvent(setPerfMode);
});
