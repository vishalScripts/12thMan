console.log("timmer");
const btn = document.getElementById("btn");
const timeDisp = document.getElementById("timeDisp");
function setTimer(time) {
  sec = 60;
  let numOfDigit = 2;
  console.log(time);
  setInterval(() => {
    timeDisp.innerHTML = `${time}:${sec}`;
    if (sec === 0) {
      sec = 60;
    } else {
      sec--;
    }
  }, 1000);
  setInterval(() => {
    time--;
  }, 60000);
}

btn.addEventListener("click", (e) => {
  e.preventDefault();
  setTimer(25);
});

function counting(num) {
  return String(num)
    .split("")
    .reduce((count, digit) => count + 1, 0);
}
