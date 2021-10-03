export const loadSprites = (p5, fileNames, assetType) => {
  const isDeployed = window.location.href.includes("github")
    ? "glitch-invaders"
    : "";
  return fileNames.map((fileName) => {
    let assetPath = `${isDeployed}/assets/${assetType}/${fileName}.png`;
    return p5.loadImage(assetPath);
  });
};
