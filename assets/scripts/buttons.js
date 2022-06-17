   attackBtn.addEventListener("click", () => {
    attack(player, monster);
    attack(monster, player);
    playerRoundData.push("attack");
    nextRound();
  });
  
  strongAttackBtn.addEventListener("click", () => {
    playerSkills.strongAttack.useStrong();
    nextRound();
    attack(monster, player);
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
    attack(monster, player);
  });
  
  restoreBtn.addEventListener("click", () => {
    playerSkills.restore.useRestore();
    nextRound();
    attack(monster, player);
  });