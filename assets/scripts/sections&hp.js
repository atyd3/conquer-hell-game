const activeGameSections = [
  healthSection,
  logsSection,
  controlsSection,
  additionalControlsSection,
];

const activeSettingsSections = [header, settingsSection];

function hideSection(section) {
  section.classList.add("hidden");
}

function showSection(section) {
  section.classList.remove("hidden");
}

function showPercentageHp(object) {
  const result = parseInt((object.currentHp / object.maxHp) * 100);
  if (result <= 0) {
    return 0;
  } else {
    return result;
  }
}

function setProgressBar(object, progressBar) {
  progressBar.max = object.maxHp;
  progressBar.value = object.maxHp;
}

function updateHealthBar(object) {
  object.healthBar.value = object.currentHp;
}
