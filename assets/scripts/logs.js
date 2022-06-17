function writeLog(className) {
    // if (!gameStatus.isActive) {
    //   return;
    // }
  
    let li = document.createElement("li");
    li.classList.add(className);
    li.textContent = roundLogs.slice(-1);
    logList.appendChild(li);
    logsSection.scrollTop = logsSection.scrollHeight - logsSection.clientHeight;
  }
  
  function removeLogs() {
    roundLogs = [];
    playerRoundData = [];
    const logsLi = document.querySelector("#logs ul");
    while (logsLi.firstChild) {
      logsLi.firstChild.remove();
    }
  }