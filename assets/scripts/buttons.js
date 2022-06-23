import {buttons, sections} from "./elements.js";
import {nextRound} from "./main.js";
import {
    hideSection,
    showSection,
    activeGameSections,
    activeSettingsSections,
    toggleModalWindow
} from "./sections&hp.js";
import {useMonsterSkill} from "./monsters.js";
import {player} from "./player.js";
import {removeLogs} from "./logs.js";

buttons.attackBtn.addEventListener("click", () => {
    player.playerSkills.normalAttack();
    nextRound();
});

buttons.strongAttackBtn.addEventListener("click", () => {
    player.playerSkills.strongAttack.useStrong();
    nextRound();
});

buttons.logBtn.addEventListener("click", () => {
    sections.logs.classList.toggle("hidden");
});

buttons.settingsBtn.addEventListener("click", () => {
    removeLogs();
    for (const activeSection of activeGameSections) {
        hideSection(activeSection);
    }
    for (const activeSection of activeSettingsSections) {
        showSection(activeSection);
    }
    hideSection(sections.gameStatus);
});

buttons.stunBtn.addEventListener("click", () => {
    player.playerSkills.stun.useStun();
    nextRound();
});

buttons.healBtn.addEventListener("click", () => {
    player.playerSkills.heal.useHeal();
    nextRound();
});

buttons.restoreBtn.addEventListener("click", () => {
    player.playerSkills.restore.useRestore();
    nextRound();
});

buttons.howToPlayBtn.addEventListener('click', () => {
    toggleModalWindow();
    document.getElementById('modal-window').appendChild(sections.howToPlay);
})

buttons.closeBtn.addEventListener('click', ()=> {
    toggleModalWindow();
})

buttons.hypnosisBtn.addEventListener('click', () => {
    useMonsterSkill.hypno.hypnosis();
    nextRound();
});