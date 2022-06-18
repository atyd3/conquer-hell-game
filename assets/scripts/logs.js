function writeLog(message, className) {
    if (!gameStatus.isActive) {
      return;
    }
  
    let li = document.createElement("li");
    li.classList.add(className);
    li.textContent = message;
    logList.appendChild(li);
    logsSection.scrollTop = logsSection.scrollHeight - logsSection.clientHeight;
  }
  
  function removeLogs() {
    playerRoundData = [];
    const logsLi = document.querySelector("#logs ul");
    while (logsLi.firstChild) {
      logsLi.firstChild.remove();
    }
  }