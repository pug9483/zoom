const socket = io();

const room = document.getElementById("room");
const welcomeForm = document.getElementById("welcome");
const nameForm = document.getElementById("nameForm");
room.hidden = true;

let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`Me: ${value}`);
  });
  input.value = "";
}

function showRoom() {
  welcomeForm.hidden = true;
  nameForm.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room: ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
}

nameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(nameForm);
  const input = nameForm.querySelector("input");
  const h3 = document.querySelector("#showNickname");
  h3.innerText = `닉네임 : ${input.value}님`;
  nameForm.hidden = true;
  socket.emit("nickname", input.value);
});

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  const nameInput = nameForm.querySelector("input");
  if (nameInput.value !== "") {
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = "";
  } else {
    alert("닉네임을 설정해주세요");
  }
});

socket.on("welcome", (user) => {
  addMessage(`${user} joined`);
});

socket.on("bye", (user) => {
  addMessage(`${user} left`);
});

socket.on("new_message", addMessage);
