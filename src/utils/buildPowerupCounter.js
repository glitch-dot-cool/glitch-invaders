export const buildPowerupCounter = (arrayOfPowerups, powerupSprites) => {
  const counter = {};
  arrayOfPowerups.forEach((powerup) => {
    counter[powerup.name] = {
      sprite: powerupSprites[powerup.name],
      iconScale: powerup.iconScale,
      count: 0,
    };
  });
  return counter;
};
