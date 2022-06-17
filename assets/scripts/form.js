hpForm.addEventListener("submit", (event) => {
  event.preventDefault();
  removeLogs();

  for (const monsterSelect of monsterSelects) {
    if (monsterSelect.checked) {
      selectedMonster = monsterSelect.value;
      enableSpecialMonsterSkills(selectedMonster);
    }
  }

  if (customDifficulty.checked) {
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

for (const difficultySelect of difficultySelects) {
  difficultySelect.addEventListener("change", function () {
    if (customDifficulty.checked) {
      showSection(hpInputsDiv);
      for (const hpInput of hpInputs) {
        hpInput.setAttribute("required", "true");
        hpInput.oninput = function () {
          if (this.value.length > 5) {
            this.value = this.value.slice(0, 5);
          } 
          if (hpInputs[0].value < 99 || hpInputs[1].value < 99) {
            hint.style = "display: block";
            startGameBtn.classList.remove("button-active");
          } else {
            hint.style = "display: none";
            startGameBtn.classList.add("button-active");
          }
          if (this.value < 99) {
            this.style = "background-color: var(--color-tertiary)"
          } else {
            this.style = "background-color: white"
          }
        };
      }
    } else {
      hideSection(hpInputsDiv);
      setGameDifficulty(this.value);
      for (const hpInput of hpInputs) {
        hpInput.removeAttribute("required", "true");
      }
    }
  });
}

