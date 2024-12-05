/** @format */

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});
document.onkeydown = function (e) {
  if (e.keyCode == 123) {
    // F12 key
    alert("FUCK YOU SKIDDER");
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
    // Ctrl + Shift + I
    alert("FUCK YOU SKIDDER");
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
    // Ctrl + Shift + C
    alert("FUCK YOU SKIDDER");
    return false;
  }
  if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
    // Ctrl + Shift + J
    alert("FUCK YOU SKIDDER");
    return false;
  }
  if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
    // Ctrl + U
    alert("FUCK YOU SKIDDER");
    return false;
  }
};
window.addEventListener("devtoolschange", function (event) {
  if (event.detail.isOpen) {
    // Developer Tools are open
    // Take appropriate action here
  }
});
