let panelOpen = false;

let fileList = [];
let fileInput = document.createElement('input');
fileInput.type = 'file';

document.querySelector('.close-btn').addEventListener('click', function() 
{ 
  //var panel = this.parentElement; 
  //panel.style.display = 'none'; // Or any other logic to collapse the panel 
  closeSidebar();
});

document.getElementById('addButton').addEventListener('click', function() {
  fileInput.click();
});

document.getElementById('menuButton').addEventListener('click', function() {
  if(panelOpen){
    closeSidebar();
  }
  else{
    openSidebar();
  }
  openSidebar();
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
  //let touch = event.touches[0];
  
 // if(touch.pageX > 64)
  
    /*if (touchX - startTouchX > 100) {
      sidePanel.style.left = '0';
      openSidebar();
    } else if (startTouchX - touchX > 100) {
      sidePanel.style.left = '-250px';
      closeSidebar();
    }*/
  
});

function openSidebar() 
{ 
  document.getElementById('overlay').style.display = 'block'; 
  // Additional code to open the sidebar 
  sidePanel.style.left = '0';
  panelOpen = true;
} 
function closeSidebar() 
{ 
  document.getElementById('overlay').style.display = 'none'; 
  // Additional code to close the sidebar 
  sidePanel.style.left = '-250px';
  panelOpen = false;
}
