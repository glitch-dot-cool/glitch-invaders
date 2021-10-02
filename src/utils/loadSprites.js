export const loadSprites = (p5, fileNames, assetType) => {
  return fileNames.map((fileName) =>
    p5.loadImage(`/assets/${assetType}/${fileName}.png`)
  );
};
