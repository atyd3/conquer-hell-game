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
}


export const logList = document.getElementById('logList');

export const sections = {
    header: document.querySelector('header'),
    settings: document.getElementById("settings"),
    controls: document.getElementById('controls'),
    gameStatus: document.getElementById('game-status'),
    health: document.getElementById('health-levels'),
    logs: document.getElementById('logs'),
    additionalControls: document.getElementById('additional-controls'),
}
export const manaSpan = {
    strongManaSpan: document.getElementById('strong-mana-span'),
    healManaSpan: document.getElementById('heal-mana-span'),
    stunManaSpan: document.getElementById('stun-mana-span'),
}





