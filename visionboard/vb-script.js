document.addEventListener("DOMContentLoaded", () => {
    loadBoard();

    document.getElementById("addNoteBtn").addEventListener("click", () => createBoardItem("note", "Kliknite ovdje da napišete bilješku..."));
    document.getElementById("addQuoteBtn").addEventListener("click", () => createBoardItem("quote", "„Upišite vaš omiljeni motivacioni citat ovdje...“"));
    document.getElementById("clearBoardBtn").addEventListener("click", clearBoard);

    document.getElementById("addImageBtn").addEventListener("click", toggleImagePopup);
    document.getElementById("popupCancelImgBtn").addEventListener("click", toggleImagePopup);
    document.getElementById("popupAddImgBtn").addEventListener("click", handleAddImage);
});

function toggleImagePopup() {
    const overlay = document.getElementById("imageOverlay");
    overlay.style.display = overlay.style.display === "flex" ? "none" : "flex";
    document.getElementById("imageUrlInput").value = "";
}

function handleAddImage() {
    const url = document.getElementById("imageUrlInput").value.trim();
    if (!url) {
        alert("Molimo unesite ispravan URL slike!");
        return;
    }
    createBoardItem("image", url);
    toggleImagePopup();
}

function createBoardItem(type, content, id = null) {
    const board = document.getElementById("visionBoard");
    const itemId = id || "item-" + Date.now();
    const randomRotation = (Math.random() * 8 - 4).toFixed(1);

    const itemCard = document.createElement("div");
    itemCard.className = `board-item type-${type}`;
    itemCard.id = itemId;
    itemCard.style.setProperty('--rotation', randomRotation);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-pin";
    deleteBtn.innerHTML = "✕";
    deleteBtn.onclick = () => deleteItem(itemId);
    itemCard.appendChild(deleteBtn);

    if (type === "image") {
        const img = document.createElement("img");
        img.src = content;
        img.className = "board-img";
        img.onerror = () => { img.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500"; };
        itemCard.appendChild(img);
    } else {
        const textPara = document.createElement("p");
        textPara.className = "item-text";
        textPara.contentEditable = "true";
        textPara.innerText = content;
        textPara.addEventListener("blur", () => saveBoard());
        itemCard.appendChild(textPara);
    }

    const footer = document.createElement("div");
    footer.className = "item-footer";
    footer.innerText = `📌 ${new Date().toLocaleDateString('bs')}`;
    itemCard.appendChild(footer);

    board.appendChild(itemCard);
    if (!id) saveBoard();
}

function deleteItem(id) {
    const item = document.getElementById(id);
    if (item) {
        item.remove();
        saveBoard();
    }
}

function clearBoard() {
    if (confirm("Da li ste sigurni da želite ukloniti sve elemente sa Vision Board-a?")) {
        document.getElementById("visionBoard").innerHTML = "";
        localStorage.removeItem("ipiVisionBoardState");
    }
}

function saveBoard() {
    const items = [];
    document.querySelectorAll(".board-item").forEach(card => {
        const id = card.id;
        let type = "note";
        if (card.classList.contains("type-quote")) type = "quote";
        if (card.classList.contains("type-image")) type = "image";

        let content = "";
        if (type === "image") {
            content = card.querySelector(".board-img").src;
        } else {
            content = card.querySelector(".item-text").innerText;
        }

        items.push({ id, type, content });
    });
    localStorage.setItem("ipiVisionBoardState", JSON.stringify(items));
}

function loadBoard() {
    const data = localStorage.getItem("ipiVisionBoardState");
    if (!data) return;

    const items = JSON.parse(data);
    items.forEach(item => {
        createBoardItem(item.type, item.content, item.id);
    });
}