for (const hpInput of hpInputs) {
    hpInput.addEventListener("keyup", () => {
      if (hpInput.value < 1) {
        hint.style = "display: block";
        gameStatus.canStart = false;
        startGameBtn.classList.remove("button-active");
      } else {
        hint.style = "display: none";
        gameStatus.canStart = true;
        startGameBtn.classList.add("button-active");
      }
    });
    hpInput.oninput = function () {
      if (this.value.length > 5) {
        this.value = this.value.slice(0, 5);
      }
    };
  }