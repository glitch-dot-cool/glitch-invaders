// base filenames
const players = [
  "woulg",
  "nuan",
  "soup",
  "mfs_square",
  "oddlogic",
  "jim",
  "meii",
  "sunnk",
  "vaeprism",
  "abroxis",
];

const enemies = ["tears1", "tears2", "tears3", "tears4"];

const powerups = ["fire_rate", "increase_bullets"];

const bullets = ["logo_bullet.png"];

export const spriteFileNames = {
  players,
  enemies,
  powerups,
  bullets,
};

// base audio filenames
const enemyHits = new Array(11).fill().map((_, idx) => `enemyHit${idx + 1}`);
const playerHits = ["playerDamage"];
const playerDeaths = ["playerDeath1", "playerDeath2"];
const playerGuns = ["playerGun"];
export const audioFileNames = {
  enemyHits,
  playerHits,
  playerDeaths,
  playerGuns,
};
