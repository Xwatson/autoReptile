function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

module.exports = {
  getRandom,
  sleep,
};
