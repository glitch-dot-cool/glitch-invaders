export const loadSprites = (p5, fileNames, assetType) => {
  return fileNames.map((fileName) =>
    p5.loadImage(`assets/${assetType}/${fileName}.png`)
  );
};

export const loadAudio = (p5, fileNames, assetType) => {
  return fileNames.map((filename) =>
    p5.loadSound(`assets/audio/${assetType}/${filename}.mp3`)
  );
};
