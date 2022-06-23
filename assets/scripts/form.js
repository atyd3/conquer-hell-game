import {hideSection, showSection} from "./sections&hp.js";
import {form, buttons, sections} from "./elements.js";
import {monster} from "./monsters.js";
import {player} from "./player.js"
import {startGame} from "./main.js";
import {removeLogs} from "./logs.js";
import {gameStatus} from "./main.js";

form.hpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeLogs();

  for (const monsterSelect of form.monsterSelects) {
    if (monsterSelect.checked) {
      monster.name = monsterSelect.value;
      monster.enableSpecialMonsterSkills(monster.name);
      sections.monsterName.textContent = `${monster.name} health`;
    }
  }
  setGameDifficulty(document.querySelector('input[name="difficultySelect"]:checked').value);
  console.log('form.selectedDifficulty',document.querySelector('input[name="difficultySelect"]:checked').value)
  startGame();
});

function setGameDifficulty(selectedDifficulty) {
  switch (selectedDifficulty) {
    case "normal":
      player.maxHp = 1000;
      player.damage = 25;
      monster.maxHp = 1000;
      monster.damage = 25;
      gameStatus.difficulty = "normal";
      break;
    case "nightmare":
      player.maxHp = 1000;
      player.damage = 40;
      monster.maxHp = 1500;
      monster.damage = 75;
      gameStatus.difficulty = "nightmare";
      break;
    case "hell":
      player.maxHp = 1000;
      player.damage = 100;
      monster.maxHp = 2000;
      monster.damage = 100;
      gameStatus.difficulty = "hell";
      break;
    case "custom":
      player.maxHp = +document.getElementById("playerInput").value;
      monster.maxHp = +document.getElementById("monsterInput").value;
      player.damage = Math.ceil(player.maxHp * 0.04);
      monster.damage = Math.ceil(monster.maxHp * 0.075);
  }
  console.log('player.maxHp', player.maxHp);
  console.log('monster.maxHp', monster.maxHp);
  console.log('player.damage', player.damage);
  console.log('monster.damage', monster.damage);
}

for (const difficultySelect of form.difficultySelects) {
  difficultySelect.addEventListener("change", function () {
    if (form.customDifficulty.checked) {
      showSection(form.hpInputsDiv);
      for (const hpInput of form.hpInputs) {
        hpInput.setAttribute("required", "true");
        hpInput.oninput = function () {
          if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
          } 
          if (form.hpInputs[0].value < 99 || form.hpInputs[1].value < 99) {
            form.hint.style = "display: block";
            buttons.startGameBtn.classList.remove("button-active");
          } else {
            form.hint.style = "display: none";
            buttons.startGameBtn.classList.add("button-active");
          }
          if (this.value < 99) {
            this.style = "background-color: var(--color-tertiary)"
          } else {
            this.style = "background-color: white"
          }
        };
      }
    } else {
      hideSection(form.hpInputsDiv);
      for (const hpInput of form.hpInputs) {
        hpInput.removeAttribute("required", "true");
      }
    }
  });
}

