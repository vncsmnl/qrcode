const container = document.querySelector(".container");
const qrCodeBtn = document.querySelector("#qr-form button");
const qrCodeBtnText = document.querySelector("#qr-form button span");
const qrCodeInput = document.querySelector("#qr-form input");
const qrCodeImg = document.querySelector("#qr-code img");

// Constantes
const QR_API_URL = "https://api.qrserver.com/v1/create-qr-code/";
const QR_SIZE = "200x200";

// Funções auxiliares
function setButtonState(text, disabled = false) {
  qrCodeBtnText.innerText = text;
  qrCodeBtn.style.pointerEvents = disabled ? "none" : "auto";
}

function handleQrCodeLoad() {
  container.classList.add("active");
  setButtonState("QR Code criado!");
}

function handleQrCodeError() {
  container.classList.remove("active");
  setButtonState("Erro! Tente novamente");
}

// Eventos
function generatorQrCode() {
  const qrCodeInputValue = qrCodeInput.value.trim();

  if (!qrCodeInputValue) return;

  setButtonState("Gerando...", true);

  // Remove listeners anteriores para evitar memory leak
  qrCodeImg.removeEventListener("load", handleQrCodeLoad);
  qrCodeImg.removeEventListener("error", handleQrCodeError);

  // Adiciona novos listeners
  qrCodeImg.addEventListener("load", handleQrCodeLoad, { once: true });
  qrCodeImg.addEventListener("error", handleQrCodeError, { once: true });

  qrCodeImg.src = `${QR_API_URL}?size=${QR_SIZE}&data=${encodeURIComponent(qrCodeInputValue)}`;
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

