import {sections} from "./elements.js";

export const activeGameSections = [
  sections.health,
  sections.logs,
  sections.controls,
  sections.additionalControls,
];

export const activeSettingsSections = [sections.header, sections.settings];

export function hideSection(section) {
  section.classList.add("hidden");
}

export function showSection(section) {
  section.classList.remove("hidden");
}

export function showPercentageHp(object) {
  const result = Math.ceil((object.currentHp / object.maxHp) * 100);
  if (result <= 0) {
    return 0;
  } else {
    return result;
  }
}

export function setProgressBar(object, progressBar) {
  progressBar.max = object.maxHp;
  progressBar.value = object.maxHp;
}

export function updateHealthBar(object) {
  object.healthBar.value = object.currentHp;
}

export function toggleModalWindow() {
  sections.howToPlay.classList.toggle("hidden");
  document.getElementById('close-icon-btn').classList.toggle("hidden");
  document.getElementsByClassName('overlay')[0].classList.toggle("hidden");
  document.getElementById('modal-window').classList.toggle("hidden");
}