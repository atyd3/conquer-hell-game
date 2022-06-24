import {manaSpan, buttons, sections} from "./elements.js";
import {monster} from "./monsters.js";
import {player} from "./player.js";
import {activeGameSections, inActiveGameSections, showSection, hideSection, setProgressBar, updateHealthBar} from "./sections&hp.js";
import {writeLog} from "./logs.js";

export const gameStatus = {
    isActive: true,
    difficulty: null,
};

export function randomIntegerBetweenValues(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function dealDamage(min, max, attacker, defender) {
    let dealtDamage = Math.floor(defender.maxHp / 100) * randomIntegerBetweenValues(min, max) + attacker.damage;
    defender.currentHp -= dealtDamage;
    updateHealthBar(defender);
    return dealtDamage;
}

export function startGame() {
    manaSpan.healManaSpan.textContent = "40% MP";
    manaSpan.stunManaSpan.textContent = "40% MP";
    manaSpan.strongManaSpan.textContent = "20% MP";
    gameStatus.isActive = true;

    monster.canUseAllSkills = true;
    monster.skillPrep = false;

    monster.currentHp = monster.maxHp;
    player.currentHp = player.maxHp;
    player.maxMana = player.maxHp;
    player.currentMana = player.maxMana;

    setProgressBar(player, player.healthBar);
    setProgressBar(monster, monster.healthBar);
    setProgressBar(player, player.manaBar);
    writeLog(`${gameStatus.difficulty} game started`, "system");

    for (const activeSection of activeGameSections) {
        showSection(activeSection);
    }

    for (const inActiveGameSection of inActiveGameSections) {
        hideSection(inActiveGameSection);
    }

    monster.calcSpec();

    enableControlButtons();
    // buttons.restoreBtn.classList.add("button-active-alt");
    buttons.settingsBtn.classList.remove("click-me");
}

export function nextRound() {
    endGame();
    player.returnMana();

    if (player.isHypnotized) {
        player.isHypnotized = !player.isHypnotized;
    }

    monster.nextRound();

    player.checkAvailableSkills(player.playerSkills.heal.canUseHeal(), buttons.healBtn);
    player.checkAvailableSkills(
        player.playerSkills.strongAttack.canUseStrong(),
        buttons.strongAttackBtn
    );
    player.checkAvailableSkills(player.playerSkills.stun.canUseStun(), buttons.stunBtn);
    player.checkAvailableSkills(player.playerSkills.restore.canUseRestore(), buttons.restoreBtn);
}

export function enableControlButtons() {
    for (const controlBtn of buttons.controlBtns) {
        controlBtn.classList.add("button-active");
        controlBtn.removeAttribute("disabled");
        buttons.restoreBtn.classList.add("button-active-alt");
    }
}

export function disableControlButtons() {
    for (const controlBtn of buttons.controlBtns) {
        controlBtn.classList.remove("button-active");
        controlBtn.setAttribute("disabled", true);
        buttons.restoreBtn.classList.remove("button-active-alt");
    }
}

export function endGame() {
    let result;
    if (monster.currentHp <= 0 && player.currentHp <= 0 && gameStatus.isActive) {
        result = "Draw";
    } else if (player.currentHp <= 0 && gameStatus.isActive) {
        result = `${monster.name} wins`;
        sections.gameStatus.classList.add("monster-bg");
    } else if (monster.currentHp <= 0 && gameStatus.isActive) {
        result = "Player wins";
        sections.gameStatus.classList.add("player-bg");
    } else {
        return;
    }
    monster.canUseAllSkills = false;
    monster.skillPrep = false;
    writeLog(result, "system");
    gameStatus.isActive = !gameStatus.isActive;
    sections.gameStatus.firstElementChild.textContent = result;
    hideSection(sections.health);
    showSection(sections.gameStatus);
    disableControlButtons();
    buttons.settingsBtn.classList.add("click-me");
}
