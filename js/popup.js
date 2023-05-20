const keyStorage = new KeyStorage();

document.addEventListener("DOMContentLoaded", async () => {
  await displayKeys();

  const form = document.getElementById("add-key-form");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const source = form.source.value;
    const key = form.key.value;
    const expirationOption = form["expiration-option"].value;
    const expirationDateElement = form.expiration;

    let expiration = null;
    if (expirationOption !== "never") {
      if (expirationOption === "custom") {
        expiration = expirationDateElement.valueAsNumber;
      } else {
        const days = parseInt(expirationOption, 10);
        const currentTime = new Date().getTime();
        expiration = currentTime + days * 24 * 60 * 60 * 1000;
      }
    }

    await keyStorage.addKey({
      source,
      key,
      expiration,
    });
    await displayKeys();
    stepMenuOne.click();
    form.reset();
  });

  const expirationSelect = document.getElementById("expiration-option");
  expirationSelect.addEventListener("change", () => {
    if (expirationSelect.value === "custom") {
      document.getElementById("expiration").style.display = "block";
    } else {
      document.getElementById("expiration").style.display = "none";
    }
  });

  // Tab navigation
  const stepMenuOne = document.querySelector(".step-menu1");
  const stepMenuTwo = document.querySelector(".step-menu2");

  const stepOne = document.querySelector(".form-step-1");
  const stepTwo = document.querySelector(".form-step-2");

  stepMenuOne.addEventListener("click", function (event) {
    event.preventDefault();

    stepMenuOne.classList.add("active");
    stepMenuTwo.classList.remove("active");

    stepOne.classList.add("active");
    stepTwo.classList.remove("active");
  });

  stepMenuTwo.addEventListener("click", function (event) {
    event.preventDefault();

    stepMenuOne.classList.remove("active");
    stepMenuTwo.classList.add("active");

    stepOne.classList.remove("active");
    stepTwo.classList.add("active");
  });
});

async function displayKeys() {
  const keysList = document.getElementById("keys-list");
  const keys = await keyStorage.getKeys();
  console.log("main", keys)
  keys.reverse();
  keysList.innerHTML = "";
  if (keys.length === 0) {
    // Display the empty message when there are no keys
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "key-details";
    emptyMessage.innerHTML = `
    <div class="key-header">
    <div class="key-content">
      <h5>Welcome to Key Chain</h5>
    </div>
    </div>
    <ul class="copy-ul">
      <li>
          <img src="assets/calendar.svg" alt="Copy" class="copy-icon">
          Add your first API key
      </li>
    </ul>
  `;
    keysList.appendChild(emptyMessage);
  } else {
    keys.forEach((key) => {
      const keyElement = document.createElement("div");
      keyElement.className = "key-details";

      keyElement.innerHTML = `
          <div class="key-header" data-key="${
            key.key
          }">
          <div class="key-content" data-key="${key.key}">
            <h5>${key.source}</h5>
            <div class="key-header-icons">
              <img src="assets/copy.svg" alt="Copy" class="copy-icon icons" data-key="${key.key}">
              <img src="assets/delete.svg" alt="Delete" class="delete-icon icons" data-id="${key.id}">
            </div>
          </div>
          </div>
          <ul class="copy-ul" data-key="${
            key.key
          }">
            <li>
                <img src="assets/calendar.svg" alt="Copy" class="copy-icon">
                ${
                  key.expiration
                    ? new Date() > new Date(key.expiration)
                      ? "Expired"
                      : `Expires on: ${new Date(
                          key.expiration
                        ).toLocaleDateString()}`
                    : "No expiration"
                }
            </li>
          </ul>
        `;

      keysList.appendChild(keyElement);

      keyElement.querySelector(".delete-icon").addEventListener("click", async (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        const id = key.id;
        await keyStorage.removeKey(id);
        await displayKeys();
      });

      keyElement.querySelector(".key-content").addEventListener("click", () => {
        const keyToCopy = key.key;
        const el = document.createElement("textarea");
        el.value = keyToCopy;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        showPopupNotification("Copied");
      });
    });
  }
}

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