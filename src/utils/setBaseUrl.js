export const setBaseUrl = () => {
  const api = {
    dev: "http://localhost:3000/invaders",
    prod: "https://droenbot.glitch.cool/invaders",
  };
  const prodUrls = [
    "https://glitch-dot-cool.github.io/glitch-invaders/",
    "https://invaders.glitch.cool/",
  ];
  const url = window.location.href;
  const isProd = prodUrls.includes(url);

  return isProd ? api.prod : api.dev;
};
