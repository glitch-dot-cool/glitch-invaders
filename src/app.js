import { Player } from "./character/Player.js";
import { EnemyManager } from "./enemy/EnemyManager.js";
import { Gun } from "./item/Gun.js";
import { ParticleManager } from "./fx/ParticleManager.js";
import { StarField } from "./fx/StarField.js";
import { PlayerPreview } from "./character/PlayerPreview.js";
import { PowerupManager } from "./item/PowerupManager.js";
import { Server } from "./character/Server.js";
import { rectCollisionDetect } from "./utils/rectCollisionDetect.js";
import { getEntityBounds } from "./utils/getEntityBounds.js";
import { spriteFileNames } from "./constants.js";
import { loadSprites } from "./utils/loadSprites.js";

const game = (s) => {
  const gameStates = { CHARACTER_SELECT: 0, PLAYING: 1, DEAD: 2 };

  let player,
    gun,
    enemyManager,
    particleManager,
    powerupManager,
    starField,
    possiblePlayerCharacters,
    sprites,
    gameState = gameStates.CHARACTER_SELECT,
    font,
    restartButton,
    server;

  const setSelectedPlayer = (character) => {
    gun = new Gun(sprites.bullet);
    player = new Player(s, character, gun);
    gameState = gameStates.PLAYING;
    possiblePlayerCharacters = null;
    powerupManager = new PowerupManager(s, sprites.powerups, gun, player);
    enemyManager = new EnemyManager(
      s,
      powerupManager,
      particleManager,
      sprites.enemies
    );
    enemyManager.spawnEnemies(s);
  };

  const setGameState = (state) => {
    gameState = state;
  };

  s.preload = () => {
    s.preloadSprites();
    font = s.loadFont("assets/JetBrainsMono-Regular.ttf");
  };

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.textFont(font);
    restartButton = s.createButton("restart");
    restartButton.mousePressed(() => location.reload());
    particleManager = new ParticleManager();
    starField = new StarField(s);
    server = new Server();
    const spriteSize = 48;
    possiblePlayerCharacters = sprites.player.map((sprite, idx) => {
      return new PlayerPreview(
        s.width / 2 + idx * (spriteSize * 1.2) - 250,
        s.height / 2,
        sprite,
        spriteSize,
        setSelectedPlayer,
        s
      );
    });
  };

  s.draw = () => {
    s.background(0);
    starField.update();

    switch (gameState) {
      case gameStates.CHARACTER_SELECT:
        s.characterSelectionScene();
        break;
      case gameStates.PLAYING:
        s.gameScene();
        break;
      case gameStates.DEAD:
        s.deathScene();
        break;
    }
  };

  s.characterSelectionScene = () => {
    s.fill(200);
    s.textSize(24);
    s.text("choose your fighter", s.width / 2 - 120, s.height / 2 - 60);
    possiblePlayerCharacters.forEach((character) => character.show(s));
  };

  s.gameScene = () => {
    player.controls(s);
    player.showBattery(s);
    s.collisionTest();
    gun.show(s);
    player.show(s);
    server.show(s);
    enemyManager.show(s);
    enemyManager.displayCurrentWave(s);
    powerupManager.show(s);
    s.renderScore();
    particleManager.renderParticles(s);
  };

  s.deathScene = () => {
    s.fill(175, 0, 0);
    s.textSize(64);
    s.text("YOU ARE DEAD", s.width / 2 - 200, s.height / 2);
    restartButton.position(s.width / 2 - 35, s.height / 2 + 50);

    if (s.frameCount % 15 === 0) {
      particleManager.emit(s, {
        x: s.random(s.width),
        y: s.random(s.height),
        spread: 20,
        accelleration: 10,
        minSize: 6,
        maxSize: 8,
        lifetime: 512,
        numParticles: 100,
      });
    }
    particleManager.renderParticles(s);
    s.showHighScores();
  };

  s.saveScore = () => {
    const existingScores = JSON.parse(
      localStorage.getItem("glitchInvadersScores")
    );
    const updatedScores = existingScores
      ? [...existingScores, player.score]
      : [player.score];
    localStorage.setItem("glitchInvadersScores", JSON.stringify(updatedScores));
  };

  s.showHighScores = () => {
    const existingScores = [
      ...new Set(JSON.parse(localStorage.getItem("glitchInvadersScores"))),
    ];
    const topFiveScores = existingScores
      .sort((a, b) => b - a)
      .slice(0, 5)
      .map((num) => String(num));
    s.textSize(18);
    s.fill(150, 150, 150);
    s.text("your high scores:", s.width / 2 - 90, s.height / 2 + 150);

    topFiveScores.forEach((score, i) => {
      s.text(
        score,
        s.width / 2 - score.length * 2,
        s.height / 2 + 150 + 25 * (i + 1)
      );
    });
  };

  s.mousePressed = () => {
    if (gameState === gameStates.CHARACTER_SELECT) {
      possiblePlayerCharacters.forEach((character) => character.clicked(s));
    }
  };

  s.collisionTest = () => {
    enemyManager.enemies.forEach((enemy, enemyIdx) => {
      // handle enemies making it "past the front"
      if (enemy.y > s.height) {
        enemyManager.killEnemy(s, enemyIdx);
        player.applyPenalty(enemy.pointValue);
        server.takeDamage(
          enemy.pointValue,
          gameState,
          setGameState,
          gameStates,
          s.saveScore
        );
      }

      // handle bullet collisions with enemies
      gun.bullets.forEach((bullet, bulletIdx) => {
        const dist = s.dist(bullet.x, bullet.y, enemy.x, enemy.y);
        if (dist < enemy.size) {
          gun.deleteBullet(bulletIdx);
          enemyManager.killEnemy(s, enemyIdx);
          player.updateScore(enemy.pointValue);
        }
      });

      // handle enemies hitting player
      const dist = s.dist(enemy.x, enemy.y, player.x, player.y);
      if (dist < enemy.size) {
        player.hit(enemy, gameState, setGameState, gameStates, s.saveScore);
        enemyManager.killEnemy(s, enemyIdx);
      }
    });
    // handle collisions w/ powerups
    powerupManager.activePowerups.forEach((powerup, idx) => {
      const playerBounds = getEntityBounds(player);
      const powerupBounds = getEntityBounds(powerup, "rect");
      const isPowerupCollidingPlayer = rectCollisionDetect(
        playerBounds,
        powerupBounds
      );
      if (isPowerupCollidingPlayer && !powerup.isHidden) {
        powerup.consume(s);
        powerupManager.purge(idx);
      }

      // handle powerups going offscreen
      if (powerupBounds.top > s.height && !powerup.isHidden) {
        powerupManager.purge(idx);
      }
    });
  };

  s.renderScore = () => {
    s.fill(200);
    s.textSize(24);
    s.text(`score: ${player.score.toLocaleString()}`, 5, s.height - 35);
    s.textSize(16);
    s.text(`multiplier: ${player.multiplier}x`, 5, s.height - 15);
  };

  s.preloadSprites = () => {
    sprites = {
      player: loadSprites(s, spriteFileNames.players, "characters"),
      enemies: loadSprites(s, spriteFileNames.enemies, "enemies"),
      bullet: s.loadImage("assets/logo_bullet.png"),
      powerups: {
        RATE_OF_FIRE: s.loadImage("assets/powerups/fire_rate.png"),
        BULLET_FAN: s.loadImage("assets/powerups/increase_bullets.png"),
        BATTERY: s.loadImage("assets/powerups/battery.png"),
      },
    };
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };
};

new p5(game);
