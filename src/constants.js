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
  "hlessi",
];

const enemies = ["enemy1", "enemy2", "enemy3", "enemy4"];
const boss = ["boss"];

const powerups = [
  "fire_rate",
  "increase_bullets",
  "damage",
  "battery",
  "shield",
  "bomb",
];

const bullets = ["logo_bullet.png"];

export const spriteFileNames = {
  players,
  enemies,
  powerups,
  bullets,
  boss,
};

// base audio filenames
const enemyHits = new Array(11).fill().map((_, idx) => `enemyHit${idx + 1}`);
const playerHits = ["playerDamage"];
const playerDeaths = ["playerDeath1", "playerDeath2"];
const playerGuns = ["playerGun"];
const songs = ["invaders"];
const powerup = ["powerup"];
const shield = ["shield"];
const bomb = ["bomb"];
export const audioFileNames = {
  enemyHits,
  playerHits,
  playerDeaths,
  playerGuns,
  songs,
  powerup,
  shield,
  bomb,
};

// perf modes
export const perfModes = { DEFAULT: "default", MEDIUM: "medium", LOW: "low" };
export const perfModeSpecs = {
  default: {
    stars: {
      density: 500,
    },
    particles: 1,
    renderResolution: 1,
    damageIndicators: true,
    collisionTestFrequency: 1,
  },
  medium: {
    stars: {
      density: 500 * 0.5,
    },
    particles: 0.5,
    renderResolution: 0.95,
    damageIndicators: true,
    collisionTestFrequency: 1,
  },
  low: {
    stars: {
      density: 500 * 0.075,
    },
    particles: 0.2,
    renderResolution: 0.85,
    damageIndicators: false,
    collisionTestFrequency: 2, // every other frame
  },
};
