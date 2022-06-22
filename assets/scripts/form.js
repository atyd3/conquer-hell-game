import {hideSection, showSection} from "./sections&hp.js";
import {form, buttons} from "./elements.js";
import {monster} from "./monsters.js";
import {player} from "./player.js"
import {startGame} from "./main.js";
import {removeLogs} from "./logs.js";

form.hpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeLogs();

  for (const monsterSelect of form.monsterSelects) {
    if (monsterSelect.checked) {
      monster.name = monsterSelect.value;
      monster.enableSpecialMonsterSkills(monster.name);
    }
  }

  if (form.customDifficulty.checked) {
    player.maxHp = +document.getElementById("playerInput").value;
    monster.maxHp = +document.getElementById("monsterInput").value;
  }
  startGame();
});

function setGameDifficulty(selectedDifficulty) {
  switch (selectedDifficulty) {
    case "normal":
      player.maxHp = 1000;
      monster.maxHp = 1000;
      break;
    case "nightmare":
      player.maxHp = 2000;
      monster.maxHp = 1000;
      break;
    case "hell":
      player.maxHp = 3000;
      monster.maxHp = 1000;
      break;
  }
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
      setGameDifficulty(this.value);
      for (const hpInput of form.hpInputs) {
        hpInput.removeAttribute("required", "true");
      }
    }
  });
}

