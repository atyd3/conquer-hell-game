const header = document.querySelector('header')
const hint = document.getElementById("hint");

const monsterHealthBar = document.getElementById("monster-health");
const playerHealthBar = document.getElementById("player-health");

const hpInputs = [document.getElementById("playerInput"), document.getElementById("monsterInput")]


const hpForm = document.getElementById('hpForm');
const monsterSelects = document.querySelectorAll('input[name="monsterSelect"]');
let selectedMonster;
// let specialSkills = [];
let roundLogs = [];
let playerRoundData = [];
let monsterRoundData = [];


const controlBtns = document.querySelectorAll("#controls button");
const attackBtn = document.getElementById("attack-btn");
const strongAttackBtn = document.getElementById("strong-attack-btn");
const healBtn = document.getElementById("heal-btn");
const stunBtn = document.getElementById("stun-btn");
const restoreBtn = document.getElementById('restore-btn');

const startGameBtn = document.getElementById("startGameBtn");
const logBtn = document.getElementById("log-btn");
const settingsBtn = document.getElementById('settings-btn');
const additionalControlsSection = document.getElementById('additional-controls');

const logsSection = document.getElementById('logs');
const logList = document.getElementById('logList');
const logsLi = document.querySelectorAll('#logList li:not(:first-child)');

const settingsSection = document.getElementById("settings");
const controlsSection = document.getElementById('controls');
const gameStatusSection = document.getElementById('game-status');
const healthSection = document.getElementById('health-levels');

const strongManaSpan = document.getElementById('strong-mana-span')
const healManaSpan = document.getElementById('heal-mana-span')
const stunManaSpan = document.getElementById('stun-mana-span')




