const MAP_SIZE = 400;
const GRID_SIZE = 4;
const TILE_SIZE = MAP_SIZE / GRID_SIZE;

let map;
let marker = null;
let tilesData = [];
let gameWon = false;

const coordsEl = document.getElementById("coords");
const statusMessageEl = document.getElementById("statusMessage");
const locateBtn = document.getElementById("locateBtn");
const downloadBtn = document.getElementById("downloadBtn");
const piecesContainer = document.getElementById("piecesContainer");
const board = document.getElementById("board");
const rasterCanvas = document.getElementById("rasterCanvas");
const rasterCtx = rasterCanvas.getContext("2d");
const hiddenCanvas = document.getElementById("hiddenCanvas");
const hiddenCtx = hiddenCanvas.getContext("2d");

function initMap() {
  map = L.map("map").setView([53.4285, 14.5528], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  createBoard();
  enablePiecesContainerDrop();
}

async function ensureNotificationPermission() {
  if (!("Notification" in window)) {
    console.log("Ta przeglądarka nie obsługuje Notification API.");
    return false;
  }

  if (Notification.permission === "granted") {
    console.log("Powiadomienia już są dozwolone.");
    return true;
  }

  if (Notification.permission === "denied") {
    console.log("Powiadomienia są zablokowane w ustawieniach przeglądarki.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log("Wynik prośby o powiadomienia:", permission);
    return permission === "granted";
  } catch (error) {
    console.error("Błąd przy proszeniu o zgodę na powiadomienia:", error);
    return false;
  }
}

function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const slot = document.createElement("div");
    slot.classList.add("slot");
    slot.dataset.index = i;

    slot.addEventListener("dragover", (e) => {
      e.preventDefault();
    });

    slot.addEventListener("drop", handleDropToSlot);

    board.appendChild(slot);
  }
}

function enablePiecesContainerDrop() {
  piecesContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  piecesContainer.addEventListener("drop", handleDropToPiecesContainer);
}

function handleDropToPiecesContainer(e) {
  e.preventDefault();

  const pieceId = e.dataTransfer.getData("text/plain");
  const draggedPiece = document.getElementById(pieceId);

  if (!draggedPiece) {
    return;
  }

  piecesContainer.appendChild(draggedPiece);
  checkWin();
}

function handleDropToSlot(e) {
  e.preventDefault();

  const pieceId = e.dataTransfer.getData("text/plain");
  const draggedPiece = document.getElementById(pieceId);
  const targetSlot = e.currentTarget;

  if (!draggedPiece) {
    return;
  }

  const existingPiece = targetSlot.querySelector(".puzzle-piece");
  const oldParent = draggedPiece.parentElement;

  if (!existingPiece) {
    targetSlot.appendChild(draggedPiece);
  } else {
    if (oldParent === piecesContainer) {
      piecesContainer.appendChild(existingPiece);
      targetSlot.appendChild(draggedPiece);
    } else if (oldParent.classList.contains("slot")) {
      oldParent.appendChild(existingPiece);
      targetSlot.appendChild(draggedPiece);
    }
  }

  checkWin();
}

function showWinNotification() {
  statusMessageEl.textContent = "Brawo! Wszystkie puzzle zostały poprawnie ułożone!";

  console.log("Notification.permission =", ("Notification" in window) ? Notification.permission : "brak API");

  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("LAB C - Sukces!", {
      body: "Mapa została ułożona poprawnie!"
    });
  } else {
    alert("Brawo! Wszystkie puzzle zostały poprawnie ułożone!");
  }
}

function checkWin() {
  if (gameWon) {
    return;
  }

  const slots = document.querySelectorAll(".slot");
  let correct = 0;

  slots.forEach((slot) => {
    if (slot.children.length === 1) {
      const piece = slot.children[0];
      const pieceIndex = parseInt(piece.dataset.correctIndex);
      const slotIndex = parseInt(slot.dataset.index);

      if (pieceIndex === slotIndex) {
        correct++;
      }
    }
  });

  if (correct === GRID_SIZE * GRID_SIZE) {
    gameWon = true;
    console.debug("Wszystkie puzzle zostały poprawnie ułożone!");
    showWinNotification();
  }
}

function getUserLocation() {
  if (!navigator.geolocation) {
    alert("Geolokalizacja nie jest wspierana przez tę przeglądarkę.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      coordsEl.textContent = `Współrzędne: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

      map.setView([lat, lng], 15);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Twoja lokalizacja")
        .openPopup();
    },
    (error) => {
      alert("Nie udało się pobrać lokalizacji: " + error.message);
    }
  );
}

function captureMap() {
  gameWon = false;
  statusMessageEl.textContent = "";
  piecesContainer.innerHTML = "";
  createBoard();

  leafletImage(map, function (err, canvas) {
    if (err) {
      console.error(err);
      alert("Nie udało się pobrać mapy.");
      return;
    }

    rasterCtx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    rasterCtx.drawImage(canvas, 0, 0, MAP_SIZE, MAP_SIZE);

    hiddenCtx.clearRect(0, 0, MAP_SIZE, MAP_SIZE);
    hiddenCtx.drawImage(canvas, 0, 0, MAP_SIZE, MAP_SIZE);

    console.debug("Mapa została zapisana do rastra.");
    splitIntoTiles();
  });
}

function splitIntoTiles() {
  tilesData = [];
  piecesContainer.innerHTML = "";

  for (let row = 0; row < GRID_SIZE; row++) {
    for (let col = 0; col < GRID_SIZE; col++) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = TILE_SIZE;
      tempCanvas.height = TILE_SIZE;

      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.drawImage(
        hiddenCanvas,
        col * TILE_SIZE,
        row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE,
        0,
        0,
        TILE_SIZE,
        TILE_SIZE
      );

      const dataUrl = tempCanvas.toDataURL();
      const index = row * GRID_SIZE + col;

      tilesData.push({
        index: index,
        dataUrl: dataUrl
      });
    }
  }

  shuffleArray(tilesData);
  renderPieces();
}

function renderPieces() {
  tilesData.forEach((tile, i) => {
    const piece = document.createElement("div");
    piece.classList.add("puzzle-piece");
    piece.id = `piece-${i}`;
    piece.draggable = true;
    piece.dataset.correctIndex = tile.index;
    piece.style.backgroundImage = `url(${tile.dataUrl})`;

    piece.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", piece.id);
    });

    piecesContainer.appendChild(piece);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

locateBtn.addEventListener("click", getUserLocation);

downloadBtn.addEventListener("click", async () => {
  await ensureNotificationPermission();
  captureMap();
});

initMap();
