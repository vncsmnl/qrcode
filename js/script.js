const container = document.querySelector(".container");
const qrCodeBtn = document.querySelector("#qr-form button");
const qrCodeBtnText = document.querySelector("#qr-form button span");

const qrCodeInput = document.querySelector("#qr-form input");

const qrCodeImg = document.querySelector("#qr-code img");

// Eventos

function generatorQrCode() {
  const qrCodeInputValue = qrCodeInput.value.trim();

  if (!qrCodeInputValue) return;

  qrCodeBtnText.innerText = "Gerando...";
  qrCodeBtn.style.pointerEvents = "none";

  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeInputValue)}`;

  qrCodeImg.addEventListener("load", () => {
    container.classList.add("active");
    qrCodeBtnText.innerText = "QR Code criado!";
    qrCodeBtn.style.pointerEvents = "auto";
  });
}

qrCodeBtn.addEventListener("click", () => {
  generatorQrCode();
});

qrCodeInput.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    generatorQrCode();
  }
});

// Limpar Área do Qrcode

qrCodeInput.addEventListener("keyup", () => {
  if (!qrCodeInput.value) {
    container.classList.remove("active");
    qrCodeBtnText.innerText = "Gerar QR Code";
  }
});

// Botão de download
const shareBtn = document.querySelector("#share-btn");
shareBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = qrCodeImg.src;
  link.download = "qrcode.png";
  link.click();
});

