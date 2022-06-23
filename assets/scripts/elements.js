// const monsterHealthBar = document.getElementById("monster-health");
// const playerHealthBar = document.getElementById("player-health");


export const form = {
    hpForm: document.getElementById('hpForm'),
    difficultySelects: document.querySelectorAll('input[name="difficultySelect"]'),
    customDifficulty: document.getElementById('custom'),
    hpInputsDiv: document.getElementById("hpInputs"),
    hpInputs: [document.getElementById("playerInput"), document.getElementById("monsterInput")],
    monsterSelects: document.querySelectorAll('input[name="monsterSelect"]'),
    selectedMonster: null,
    hint: document.getElementById("hint"),
}

export const buttons = {
    controlBtns: document.querySelectorAll("#controls button:not(:first-child)"),
    hypnosisBtn: document.getElementById("hypnosis-btn"),
    attackBtn: document.getElementById("attack-btn"),
    strongAttackBtn: document.getElementById("strong-attack-btn"),
    healBtn: document.getElementById("heal-btn"),
    stunBtn: document.getElementById("stun-btn"),
    restoreBtn: document.getElementById('restore-btn'),
    startGameBtn: document.getElementById("startGameBtn"),
    logBtn: document.getElementById("log-btn"),
    settingsBtn: document.getElementById('settings-btn'),
    howToPlayBtn: document.getElementById("how-to-play-btn"),
    closeBtn: document.getElementById('close-icon-btn'),
}


export const logList = document.getElementById('logList');

export const sections = {
    header: document.querySelector('header'),
    monsterName: document.getElementById('monster-health-label'),
    settings: document.getElementById("settings"),
    controls: document.getElementById('controls'),
    gameStatus: document.getElementById('game-status'),
    health: document.getElementById('health-levels'),
    logs: document.getElementById('logs'),
    additionalControls: document.getElementById('additional-controls'),
    howToPlay: document.getElementById(('how-to-play')),
}
export const manaSpan = {
    strongManaSpan: document.getElementById('strong-mana-span'),
    healManaSpan: document.getElementById('heal-mana-span'),
    stunManaSpan: document.getElementById('stun-mana-span'),
}





