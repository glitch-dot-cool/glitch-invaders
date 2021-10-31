export const loadSprites = (p5, fileNames, assetType) => {
  return fileNames.map((fileName) => {
    return {
      file: p5.loadImage(`assets/${assetType}/${fileName}.png`),
      name: fileName,
    };
  });
};

export const loadAudio = (p5, fileNames, assetType) => {
  return fileNames.map((filename) =>
    p5.loadSound(`assets/audio/${assetType}/${filename}.mp3`)
  );
};
