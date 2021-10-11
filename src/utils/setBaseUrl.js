export const setBaseUrl = () => {
  const api = {
    dev: "http://localhost:3000/invaders",
    prod: "http://172.104.209.136:3000/invaders",
  };
  const prodUrls = [
    "https://glitch-dot-cool.github.io/glitch-invaders/",
    "https://invaders.glitch.cool/",
  ];
  const url = window.location.href;
  const isProd = prodUrls.includes(url);

  return isProd ? api.prod : api.dev;
};
