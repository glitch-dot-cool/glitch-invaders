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
import { loadSprites, loadAudio } from "./utils/assetLoading.js";
import { TextFade } from "./fx/TextFade.js";
import { TextFadeManager } from "./fx/TextFadeManager.js";
import { Fetch } from "./utils/fetch.js";
import { detectMobile } from "./utils/detectMobile.js";
import { Timer } from "./Timer.js";
import {
  spriteFileNames,
  audioFileNames,
  perfModes,
  perfModeSpecs,
} from "./constants.js";

const game = (s) => {
  const gameStates = { CHARACTER_SELECT: 0, PLAYING: 1, DEAD: 2 };
  const deathEvent = new Event("death");
  const restartEvent = new Event("restart");

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
    server,
    audio,
    textFadeManager,
    leaderboard,
    hasFetched = false,
    perfMode = perfModes.DEFAULT,
    isPaused = false,
    timer,
    deathMessage;

  window.addEventListener("refreshScore", () => (hasFetched = false));
  window.addEventListener("setPerfMode", ({ detail }) => {
    perfMode = detail;
    setGraphicsSettings();
  });

  const setSelectedPlayer = (character) => {
    setGraphicsSettings();
    gun = new Gun(s, sprites.bullet, audio.playerGun);
    player = new Player(s, character, gun, audio);
    gameState = gameStates.PLAYING;
    timer = new Timer(gameStates, setGameState, s.saveScore);
    timer.run();
    powerupManager = new PowerupManager(s, sprites.powerups, gun, player);
    enemyManager = new EnemyManager(
      s,
      powerupManager,
      particleManager,
      sprites,
      audio.enemyHits
    );
  };

  const setGraphicsSettings = () => {
    document.querySelector(".graphics-options").style.display = "none";
    particleManager = new ParticleManager({
      particleDensity: perfModeSpecs[perfMode].particles,
    });
    s.pixelDensity(perfModeSpecs[perfMode].renderResolution);
    starField.updateGraphicsOptions(perfModeSpecs[perfMode].stars);
    textFadeManager = new TextFadeManager(perfMode);
  };

  const setGameState = (state, message) => {
    gameState = state;
    if (state === gameStates.DEAD) {
      window.dispatchEvent(deathEvent);
      deathMessage = message;
    }
  };

  s.preload = () => {
    font = s.loadFont("assets/JetBrainsMono-Regular.ttf");
    if (!detectMobile()) {
      s.preloadSprites();
      s.preloadAudio();
    }
  };

  s.setup = () => {
    s.createCanvas(s.windowWidth, s.windowHeight);
    s.random(audio.songs).loop(0, 1, 0.5);
    s.textFont(font);
    s.textAlign(s.CENTER);
    restartButton = s.createButton("restart");
    restartButton.class("hide restart-button");
    restartButton.mousePressed(() => {
      setGameState(gameStates.CHARACTER_SELECT);
      dispatchEvent(restartEvent);
    });
    starField = new StarField(s);
    server = new Server();
    const spriteSize = 48;
    possiblePlayerCharacters = sprites.player.map((sprite, idx) => {
      return new PlayerPreview(
        s.width / 2 + idx * (spriteSize * 1.2) - 300,
        s.height / 2 + 100,
        sprite,
        spriteSize,
        setSelectedPlayer,
        s
      );
    });
  };

  s.draw = () => {
    if (s.frameCount % 60 === 0) {
      s.background(0, 95);
    } else {
      s.background(0, 80);
    }

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

    // need to run in draw loop to run on top of whatever is drawn into scene
    s.drawIsPaused();
  };

  s.characterSelectionScene = () => {
    document.querySelector(".graphics-options").style.display = "block";
    document.querySelector(".title").style.display = "block";
    document.querySelector("#instructions-button-container").style.display =
      "flex";
    document.querySelector(".form").style.display = "none";
    restartButton.class("hide restart-button");
    server.toxicity = 0;
    s.fill(200);
    s.textSize(18);
    s.textAlign(s.CENTER);
    s.text("choose your fighter", s.width / 2, s.height / 2 + 160);
    possiblePlayerCharacters.forEach((character) => character.show(s));
    s.characterHover();
  };

  s.characterHover = () => {
    let shouldHover = false;
    possiblePlayerCharacters.forEach((character) => {
      const dist = s.dist(character.x, character.y, s.mouseX, s.mouseY);
      if (dist < character.size * 0.5) {
        shouldHover = true;
        character.showTooltip(s);
      }
    });

    if (shouldHover) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };

  s.gameScene = () => {
    player.controls(s);
    s.collisionTest();
    gun.show(s);
    textFadeManager.show(s, Date.now());
    enemyManager.show(s);
    powerupManager.show(s);
    player.show(s);
    s.renderScore();
    server.show(s);
    particleManager.renderParticles(s);
    timer.show(s);
  };

  s.deathScene = async () => {
    s.fill(175, 0, 0);
    s.textSize(64);
    s.textAlign(s.CENTER);
    s.text(deathMessage, s.width / 2, s.height / 3 - 30);
    const score = JSON.parse(localStorage.getItem("glitchInvadersScores")).sort(
      (a, b) => b.timestamp - a.timestamp
    )[0];
    s.textSize(18);
    s.text(
      `your score: ${score.score} | wave reached: ${score.wave}`,
      s.width * 0.5,
      s.height / 3
    );

    restartButton.class("show restart-button");

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
      s.random(audio.enemyHits).play(undefined, s.random(0.025, 0.05));
    }
    particleManager.renderParticles(s);
    s.showHighScores();
    await s.fetchLeaderBoard();
    s.renderLeaderboard();
  };

  s.fetchLeaderBoard = async () => {
    if (!hasFetched) {
      hasFetched = true;
      leaderboard = await Fetch.get();
    }
  };

  s.renderLeaderboard = () => {
    if (leaderboard instanceof Array) {
      s.textAlign(s.LEFT);
      s.textSize(22);
      const xPos = s.width / 8;
      s.text("leaderboard:", xPos, s.height - s.height * 0.334);
      leaderboard?.forEach((entry, idx) => {
        s.textAlign(s.LEFT);
        s.fill(255);
        s.textSize(18);
        s.text(
          `${idx + 1}. ${entry.discord_user}`,
          xPos,
          s.height - s.height * 0.334 + 50 * (idx + 1)
        );
        s.fill(200);
        s.textSize(12);
        s.text(
          `score: ${entry.score.toLocaleString()} | wave reached: ${
            entry.level_reached
          }`,
          xPos,
          s.height - s.height * 0.334 + 20 + 50 * (idx + 1)
        );
      });
    }
  };

  s.saveScore = () => {
    const existingScores = JSON.parse(
      localStorage.getItem("glitchInvadersScores")
    );
    const updatedScores = existingScores
      ? [
          ...existingScores,
          {
            score: player.score,
            wave: enemyManager.wave,
            timestamp: Date.now(),
          },
        ]
      : [
          {
            score: player.score,
            wave: enemyManager.wave,
            timestamp: Date.now(),
          },
        ];
    localStorage.setItem("glitchInvadersScores", JSON.stringify(updatedScores));
  };

  s.showHighScores = () => {
    const existingScores = [
      ...new Set(JSON.parse(localStorage.getItem("glitchInvadersScores"))),
    ];
    const topFiveScores = existingScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => {
        return {
          score: entry.score.toLocaleString(),
          wave: entry.wave,
        };
      });
    const xOffset = s.width / 8;
    s.textSize(22);
    s.textAlign(s.RIGHT);
    s.fill(255);
    s.text("your high scores:", s.width - xOffset, s.height - s.height * 0.334);

    s.fill(200);
    topFiveScores.forEach((entry, i) => {
      s.text(
        `score: ${entry.score} | wave reached: ${entry.wave}`,
        s.width - xOffset,
        s.height - s.height * 0.334 + 50 * (i + 1)
      );
    });
  };

  s.mousePressed = () => {
    if (gameState === gameStates.CHARACTER_SELECT) {
      possiblePlayerCharacters.forEach((character) =>
        character.clicked(s, isPaused)
      );
    }
  };

  s.collisionTest = () => {
    if (s.frameCount % perfModeSpecs[perfMode].collisionTestFrequency === 0) {
      const playerBounds = getEntityBounds(player);

      enemyManager.enemies.forEach((enemy, enemyIdx) => {
        const enemyBounds = getEntityBounds(enemy, "rect");

        // handle enemies making it "past the front"
        if (enemy.y > s.height) {
          enemyManager.hitEnemy(s, enemyIdx, Infinity);
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
          const bulletBounds = getEntityBounds(bullet);
          const isBulletCollidingEnemy = rectCollisionDetect(
            bulletBounds,
            enemyBounds
          );

          if (isBulletCollidingEnemy) {
            textFadeManager.add(
              new TextFade({
                x: enemy.x,
                y: enemy.y - 30,
                text: `-${bullet.damage}`,
              })
            );
            gun.deleteBullet(bulletIdx);
            enemyManager.hitEnemy(
              s,
              enemyIdx,
              bullet.damage,
              bullet,
              player.updateScore
            );
          }
        });

        // handle enemies hitting player
        const isEnemyColidingPlayer = rectCollisionDetect(
          playerBounds,
          enemyBounds
        );
        if (isEnemyColidingPlayer) {
          if (!player.shield.isActive) {
            player.hit(enemy, gameState, setGameState, gameStates, s.saveScore);
            player.applyPenalty(enemy.pointValue);
          } else player.takeShieldDamage(1);
          enemyManager.hitEnemy(s, enemyIdx, Infinity);
        }
      });
      // handle collisions w/ powerups
      powerupManager.activePowerups.forEach((powerup, idx) => {
        const powerupBounds = getEntityBounds(powerup, "rect");
        const isPowerupCollidingPlayer = rectCollisionDetect(
          playerBounds,
          powerupBounds
        );
        if (isPowerupCollidingPlayer) {
          powerup.consume(s);
          textFadeManager.add(
            new TextFade({
              x: powerup.x,
              y: powerup.y + 30,
              text: powerup.effect.description,
            })
          );
          powerupManager.addToCollectedPowerups(powerup);
          powerupManager.purge(idx);
          audio.powerupPickup.play();
        }

        // handle powerups going offscreen
        if (powerupBounds.top > s.height) {
          powerupManager.purge(idx);
        }
      });
    }
  };

  s.renderScore = () => {
    s.fill(200);
    s.textSize(24);
    s.textAlign(s.LEFT);
    s.text(`score: ${player.score.toLocaleString()}`, 5, s.height - 35);
    s.textSize(16);
    s.text(`multiplier: ${player.multiplier}x`, 5, s.height - 15);
  };

  s.preloadSprites = () => {
    sprites = {
      player: loadSprites(s, spriteFileNames.players, "characters"),
      enemies: loadSprites(s, spriteFileNames.enemies, "enemies"),
      bullet: s.loadImage("assets/logo_bullet.png"),
      boss: s.loadImage("assets/boss/boss.png"),
      powerups: {
        RATE_OF_FIRE: s.loadImage("assets/powerups/fire_rate.png"),
        BULLET_FAN: s.loadImage("assets/powerups/increase_bullets.png"),
        BATTERY: s.loadImage("assets/powerups/battery.png"),
        DAMAGE: s.loadImage("assets/powerups/damage.png"),
        SHIELD: s.loadImage("assets/powerups/shield.png"),
        BOMB: s.loadImage("assets/powerups/bomb.png"),
      },
    };
  };

  s.preloadAudio = () => {
    audio = {
      enemyHits: loadAudio(s, audioFileNames.enemyHits, "enemy_hit"),
      playerDeaths: loadAudio(s, audioFileNames.playerDeaths, "player_death"),
      playerHit: loadAudio(s, audioFileNames.playerHits, "player_hit")[0],
      playerGun: loadAudio(s, audioFileNames.playerGuns, "player_gun")[0],
      songs: loadAudio(s, audioFileNames.songs, "music"),
      powerupPickup: loadAudio(s, audioFileNames.powerup, "powerup")[0],
      shield: loadAudio(s, audioFileNames.shield, "shield")[0],
      bomb: loadAudio(s, audioFileNames.bomb, "bomb")[0],
    };
  };

  s.windowResized = () => {
    s.resizeCanvas(s.windowWidth, s.windowHeight);
  };

  s.keyPressed = () => {
    if (gameState === gameStates.PLAYING) {
      // x or d key
      if (s.keyCode === 88 || s.keyCode === 68) {
        player?.deployBomb(s, powerupManager, enemyManager);
      }

      // esc or p key
      if (s.keyCode === 27 || s.keyCode === 80) {
        s.handlePause();
      }

      // r key
      if (s.keyCode === 82) {
        setGameState(gameStates.CHARACTER_SELECT);
      }
    }
  };

  s.handlePause = () => {
    isPaused = isPaused ? false : true;
    enemyManager.isPaused = isPaused;

    if (isPaused) {
      s.noLoop();
      s.background(0); // removes "motion blur" on pause for effect
      timer.pause();
    } else {
      s.loop();
      timer.run();
    }
  };

  s.drawIsPaused = () => {
    if (isPaused) {
      s.textAlign(s.CENTER);
      s.textSize(48);
      s.fill(255, 0, 0, 100);
      s.text("PAUSED", s.width / 2 + 3, s.height / 3);
      s.fill(0, 255, 0, 100);
      s.text("PAUSED", s.width / 2, s.height / 3);
      s.fill(0, 0, 255, 100);
      s.text("PAUSED", s.width / 2 - 3, s.height / 3);
    }
  };
};

new p5(game);
