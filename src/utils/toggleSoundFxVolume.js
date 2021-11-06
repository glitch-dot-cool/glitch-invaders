export const toggleSoundFxVolume = (audio, audioLevels) => {
  if (audioLevels.fx === 1) audioLevels.fx = 0;
  else audioLevels.fx = 1;

  Object.keys(audio)
    .filter((key) => key !== "songs")
    .forEach((category) => {
      if (audio[category] instanceof Array) {
        audio[category].forEach((sound) => {
          sound.setVolume(audioLevels.fx);
        });
      } else {
        audio[category].setVolume(audioLevels.fx);
      }
    });
};
