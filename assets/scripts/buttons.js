attackBtn.addEventListener("click", () => {
    playerSkills.normalAttack();
    nextRound();
});

strongAttackBtn.addEventListener("click", () => {
    playerSkills.strongAttack.useStrong();
    nextRound();
});

logBtn.addEventListener("click", () => {
    logsSection.classList.toggle("hidden");
});

settingsBtn.addEventListener("click", () => {
    removeLogs();
    // endGame();
    for (const activeSection of activeGameSections) {
        hideSection(activeSection);
    }
    for (const activeSection of activeSettingsSections) {
        showSection(activeSection);
    }
    hideSection(gameStatusSection);
});

stunBtn.addEventListener("click", () => {
    playerSkills.stun.useStun();
    nextRound();
});

healBtn.addEventListener("click", () => {
    playerSkills.heal.useHeal();
    nextRound();
});

restoreBtn.addEventListener("click", () => {
    playerSkills.restore.useRestore();
    nextRound();
});

hypnosisBtn.addEventListener('click', () => {
    useMonsterSkill.hypno.hypnosis();
    nextRound();
});