let fileList = [];
let fileInput = document.createElement('input');
fileInput.type = 'file';

document.getElementById('addButton').addEventListener('click', function() {
  fileInput.click();
});

fileInput.addEventListener('change', function() {
  let files = fileInput.files;
  for (let i = 0; i < files.length; i++) {
    fileList.push(files[i].path);
    let listItem = document.createElement('li');
    listItem.textContent = files[i].name;
    document.getElementById('fileList').appendChild(listItem);
  }
});

// Swipe functionality for side panel
let sidePanel = document.getElementById('sidePanel');
let startTouchX;

window.addEventListener('touchstart', function(event) {
  startTouchX = event.touches[0].clientX;
});

window.addEventListener('touchmove', function(event) {
  let touchX = event.touches[0].clientX;
  if(touchX.pageX > 32)
  {
    if (touchX - startTouchX > 50) {
      sidePanel.style.left = '0';
      openSidebar();
    } else if (startTouchX - touchX > 50) {
      sidePanel.style.left = '-250px';
      closeSidebar();
    }
  }
});

function openSidebar() 
{ 
  document.getElementById('overlay').style.display = 'block'; 
  // Additional code to open the sidebar 
} 
function closeSidebar() 
{ 
  document.getElementById('overlay').style.display = 'none'; 
  // Additional code to close the sidebar 
}
