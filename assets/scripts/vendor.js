const hint = document.getElementById("hint");

const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");

const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const logBtn = document.getElementById("log-btn");
const startGameBtn = document.getElementById("startGameBtn");
const additionalControlsSection = document.getElementById('additional-controls');
const settingsBtn = document.getElementById('settings-btn');

const logs = document.getElementById('logs');
const logList = document.getElementById('logList');
const logsLi = document.querySelectorAll('#logList li:not(:first-child)');

const settingsSection = document.getElementById("settings");
const controlsSection = document.getElementById('controls');
const gameStatusSection = document.getElementById('game-status');
const healthSection = document.getElementById('health-levels');

const pDamage = 15;
const mDamage = 25;

const controlBtns = document.querySelectorAll("#controls button");

let gameActive = false;

const manaSpan = document.getElementById('mana-span')




