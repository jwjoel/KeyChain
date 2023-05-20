function arrayBufferToBase64(buffer) {
  const byteArray = new Uint8Array(buffer);
  return btoa(String.fromCharCode(...byteArray));
  }
  
  function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
  bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
  }

const keyStorage = new KeyStorage();
async function handleExport() {
  const exportData = await keyStorage.exportEncryptedKeys();
  const dataJSON = JSON.stringify(exportData);
  const blob = new Blob([dataJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "keychain_backup.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showPopupNotification("Done");
}

async function handleImport() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = JSON.parse(event.target.result);
          await keyStorage.importEncryptedKeys(data);
          showPopupNotification("Done");
        } catch (error) {
          console.error("Error importing keys:", error);
        }
      };
      reader.readAsText(file);
    }
  };
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
}

document
  .getElementById("import-button")
  .addEventListener("click", handleImport);
document
  .getElementById("export-button")
  .addEventListener("click", handleExport);

  function showPopupNotification(message) {
    const popupNotification = document.getElementById("popup-notification");
    const popupText = document.getElementById("popup-text");
  
    popupText.innerText = message;
    popupNotification.style.opacity = 0;
    popupNotification.style.display = "block";
  
    setTimeout(() => {
      // Fade in animation
      popupNotification.style.transition = "opacity 0.5s ease";
      popupNotification.style.opacity = 1;
    }, 50);
  
    setTimeout(() => {
      // Fade out animation
      popupNotification.style.transition = "opacity 0.5s ease";
      popupNotification.style.opacity = 0;
    }, 2000);
  
    setTimeout(() => {
      popupNotification.style.display = "none";
    }, 2500);
  }