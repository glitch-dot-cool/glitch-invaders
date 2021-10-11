import { Fetch } from "./utils/fetch.js";

const input = document.querySelector("#username-input");
const inputContainer = document.querySelector(".container");
const submitButton = document.querySelector("#submit-btn");
const errorModal = document.querySelector(".error-modal");

const refreshScore = new Event("refreshScore");

let inputText = "";
let hasSubmitted = false;

window.addEventListener("death", () => {
  inputContainer.style.display = "flex";
});

input.addEventListener("input", (e) => {
  inputText = e.target.value;
});

submitButton.addEventListener("click", async () => {
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
      }, 2000);
    } else {
      hasSubmitted = true;
      window.dispatchEvent(refreshScore);
    }
  }
});
