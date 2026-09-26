/**
 * QR-FAST | Gerador Inteligente de QR Code
 * Vinicius Manoel
 */

document.addEventListener("DOMContentLoaded", () => {
  // ===== Elementos do DOM =====
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  // Inputs
  const urlInput = document.querySelector("#url-input");
  const textInput = document.querySelector("#text-input");
  const textCounter = document.querySelector("#text-counter");
  const wifiSsid = document.querySelector("#wifi-ssid");
  const wifiPass = document.querySelector("#wifi-password");
  const wifiPassGroup = document.querySelector("#wifi-pass-group");
  const wifiEncryption = document.querySelector("#wifi-encryption");
  const btnToggleWifiPass = document.querySelector("#btn-toggle-wifi-pass");
  const waPhone = document.querySelector("#wa-phone");
  const waMessage = document.querySelector("#wa-message");
  const pixKey = document.querySelector("#pix-key");
  const pixName = document.querySelector("#pix-name");
  const pixCity = document.querySelector("#pix-city");
  const pixAmount = document.querySelector("#pix-amount");
  const qrLogoPicker = document.querySelector("#qr-logo-picker");
  const removeQrLogoBtn = document.querySelector("#btn-remove-qr-logo");
  const qrLogoStatus = document.querySelector("#qr-logo-status");

  // Customizer
  const qrColorPicker = document.querySelector("#qr-color-picker");
  const qrBgColorPicker = document.querySelector("#qr-bgcolor-picker");
  const qrColorPresets = document.querySelectorAll("#color-presets-qr .color-preset");
  const qrBgColorPresets = document.querySelectorAll("#color-presets-bg .color-preset");
  const sizeButtons = document.querySelectorAll(".size-btn");

  // Ações e visualização
  const generateBtn = document.querySelector("#generate-btn");
  const generateBtnText = generateBtn.querySelector(".btn-text");
  const qrPlaceholder = document.querySelector("#qr-placeholder");
  const qrLoadingSpinner = document.querySelector("#qr-loading-spinner");
  const qrImage = document.querySelector("#qr-image");
  const qrFrame = document.querySelector("#qr-frame");
  const qrInfo = document.querySelector("#qr-info");
  const qrInfoType = document.querySelector("#qr-info-type");
  const qrInfoText = document.querySelector("#qr-info-text");
  const btnTestLink = document.querySelector("#btn-test-link");
  const actionsGrid = document.querySelector("#actions-grid");

  // Botões de ação
  const btnDownloadPng = document.querySelector("#btn-download-png");
  const btnDownloadSvg = document.querySelector("#btn-download-svg");
  const btnCopyImg = document.querySelector("#btn-copy-img");
  const btnShare = document.querySelector("#btn-share");

  // Toast container
  const toastContainer = document.querySelector("#toast-container");

  // ===== Estado da Aplicação =====
  let currentTab = "url";
  let currentSize = 600; // Resolução padrão
  let currentQrColor = "#000000";
  let currentBgColor = "#ffffff";
  let lastGeneratedPayload = "";
  let lastGeneratedType = "url";
  let lastGeneratedIsUrl = false;
  let isGenerating = false;
  let qrLogoImage = null;
  let qrLogoDataUrl = "";
  const MAX_LOGO_BYTES = 2 * 1024 * 1024;

  // ===== Sistema de Toasts =====
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSvg = "";
    if (type === "success") {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`;
    } else if (type === "error") {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>`;
    } else {
      iconSvg = `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-hiding");
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3200);
  }

  // ===== Abas =====
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      if (currentTab === type) return;

      currentTab = type;
      tabButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-selected", isActive);
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `panel-${type}`);
      });

      // Foco automático no primeiro campo da aba
      if (type === "url") urlInput.focus();
      else if (type === "text") textInput.focus();
      else if (type === "wifi") wifiSsid.focus();
      else if (type === "whatsapp") waPhone.focus();
      else if (type === "pix") pixKey.focus();
    });
  });

  // Contador de caracteres do texto
  textInput.addEventListener("input", () => {
    const len = textInput.value.length;
    textCounter.textContent = `${len} / 800`;
  });

  // Alternar visualização da senha de Wi-Fi
  btnToggleWifiPass.addEventListener("click", () => {
    const isPass = wifiPass.type === "password";
    wifiPass.type = isPass ? "text" : "password";
    btnToggleWifiPass.classList.toggle("active", isPass);
    btnToggleWifiPass.innerHTML = isPass
      ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="pass-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>`
      : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="pass-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>`;
  });

  // Ocultar campo de senha se Wi-Fi for rede aberta
  wifiEncryption.addEventListener("change", () => {
    if (wifiEncryption.value === "nopass") {
      wifiPassGroup.style.display = "none";
    } else {
      wifiPassGroup.style.display = "flex";
    }
  });

  // Máscara leve para telefone de WhatsApp
  waPhone.addEventListener("input", (e) => {
    let val = e.target.value.replace(/\D/g, "");
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 6) {
      val = `${val.slice(0, 2)} ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `${val.slice(0, 2)} ${val.slice(2)}`;
    }
    e.target.value = val;
  });

  // ===== Customização de Cores e Tamanho =====
  function setActivePreset(presets, color) {
    presets.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.color.toLowerCase() === color.toLowerCase());
    });
  }

  qrColorPicker.addEventListener("input", (e) => {
    currentQrColor = e.target.value;
    setActivePreset(qrColorPresets, currentQrColor);
  });

  qrBgColorPicker.addEventListener("input", (e) => {
    currentBgColor = e.target.value;
    qrFrame.style.backgroundColor = currentBgColor;
    setActivePreset(qrBgColorPresets, currentBgColor);
  });

  qrColorPresets.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentQrColor = btn.dataset.color;
      qrColorPicker.value = currentQrColor;
      setActivePreset(qrColorPresets, currentQrColor);
    });
  });

  qrBgColorPresets.forEach((btn) => {
    btn.addEventListener("click", () => {
      currentBgColor = btn.dataset.color;
      qrBgColorPicker.value = currentBgColor;
      qrFrame.style.backgroundColor = currentBgColor;
      setActivePreset(qrBgColorPresets, currentBgColor);
    });
  });

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentSize = parseInt(btn.dataset.size, 10);
    });
  });

  // ===== Formatação Inteligente de Dados =====

  /**
   * Garante que uma URL possua o protocolo (https://)
   * para que os smartphones abram diretamente no navegador ao escanear.
   */
  function normalizeUrl(rawUrl) {
    let trimmed = rawUrl.trim();
    if (!trimmed) return "";

    // Se já contém esquema (http://, https://, etc.)
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Se inicia com barras duplas //
    if (trimmed.startsWith("//")) {
      return "https:" + trimmed;
    }

    // Caso contrário, prefixa com https://
    return "https://" + trimmed;
  }

  /**
   * Escapa caracteres reservados para strings de configuração Wi-Fi
   */
  function escapeWifiString(str) {
    return str.replace(/([\\;,:"])/g, "\\$1");
  }

  function emvField(id, value) {
    const text = String(value);
    if (text.length > 99) throw new Error("Campo Pix excede o limite do BR Code.");
    return `${id}${String(text.length).padStart(2, "0")}${text}`;
  }

  function normalizeEmvText(value, maxLength) {
    return value.normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\x20-\x7E]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, maxLength);
  }

  function calculatePixCrc(payload) {
    let crc = 0xffff;
    for (let index = 0; index < payload.length; index++) {
      crc ^= payload.charCodeAt(index) << 8;
      for (let bit = 0; bit < 8; bit++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, "0");
  }

  function buildPixPayload() {
    const key = pixKey.value.trim();
    if (!key) {
      showToast("Informe a chave Pix.", "error");
      pixKey.focus();
      return null;
    }
    if (key.length > 77) {
      showToast("A chave Pix deve ter até 77 caracteres.", "error");
      pixKey.focus();
      return null;
    }
    if (!/^[\x20-\x7E]+$/.test(key)) {
      showToast("A chave Pix deve usar apenas caracteres ASCII.", "error");
      pixKey.focus();
      return null;
    }

    const receiverName = normalizeEmvText(pixName.value, 25);
    if (!receiverName) {
      showToast("Informe o nome do recebedor.", "error");
      pixName.focus();
      return null;
    }

    const city = normalizeEmvText(pixCity.value, 15).toUpperCase();
    if (!city) {
      showToast("Informe a cidade do recebedor.", "error");
      pixCity.focus();
      return null;
    }

    let amount = "";
    const amountInput = pixAmount.value.trim();
    if (amountInput) {
      const normalizedAmount = amountInput.replace(/\s/g, "").replace(",", ".");
      if (!/^\d+(\.\d{1,2})?$/.test(normalizedAmount)) {
        showToast("Informe um valor válido, como 12,50.", "error");
        pixAmount.focus();
        return null;
      }
      const numericAmount = Number(normalizedAmount);
      if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 99999999999.99) {
        showToast("O valor precisa ser maior que zero.", "error");
        pixAmount.focus();
        return null;
      }
      amount = numericAmount.toFixed(2);
    }

    const merchantAccount = emvField("00", "br.gov.bcb.pix") + emvField("01", key);
    const body = [
      emvField("00", "01"),
      emvField("26", merchantAccount),
      emvField("52", "0000"),
      emvField("53", "986"),
      amount ? emvField("54", amount) : "",
      emvField("58", "BR"),
      emvField("59", receiverName),
      emvField("60", city),
      emvField("62", emvField("05", "***")),
      "6304",
    ].join("");

    return {
      type: "Pix",
      displayType: "Pix estático",
      displayText: `Chave Pix: ${key}`,
      rawInput: key,
      payload: body + calculatePixCrc(body),
      isUrl: false,
    };
  }

  /**
   * Obtém os dados formatados conforme a aba ativa
   */
  function getPayloadForActiveTab() {
    if (currentTab === "url") {
      const raw = urlInput.value.trim();
      if (!raw) {
        showToast("Por favor, digite uma URL ou domínio.", "error");
        urlInput.focus();
        return null;
      }
      const formatted = normalizeUrl(raw);
      return {
        type: "URL",
        displayType: "Link direto",
        rawInput: raw,
        payload: formatted,
        isUrl: true,
      };
    }

    if (currentTab === "text") {
      const raw = textInput.value.trim();
      if (!raw) {
        showToast("Por favor, digite o texto do QR Code.", "error");
        textInput.focus();
        return null;
      }
      // Se parecer uma URL, avisa ou converte
      const isUrl = /^https?:\/\//i.test(raw);
      return {
        type: "Texto",
        displayType: isUrl ? "Link Web" : "Texto puro",
        rawInput: raw,
        payload: raw,
        isUrl: isUrl,
      };
    }

    if (currentTab === "wifi") {
      const ssid = wifiSsid.value.trim();
      if (!ssid) {
        showToast("Informe o nome da rede (SSID).", "error");
        wifiSsid.focus();
        return null;
      }
      const enc = wifiEncryption.value;
      const pass = enc !== "nopass" ? wifiPass.value : "";

      if (enc !== "nopass" && !pass) {
        showToast("Digite a senha da rede Wi-Fi.", "error");
        wifiPass.focus();
        return null;
      }

      // Padrão universal ZXing: WIFI:T:WPA;S:nome;P:senha;;
      const payload =
        enc === "nopass"
          ? `WIFI:T:nopass;S:${escapeWifiString(ssid)};;;`
          : `WIFI:T:${enc};S:${escapeWifiString(ssid)};P:${escapeWifiString(pass)};;`;

      return {
        type: "Wi-Fi",
        displayType: `Rede: ${ssid}`,
        rawInput: ssid,
        payload: payload,
        isUrl: false,
      };
    }

    if (currentTab === "whatsapp") {
      const rawPhone = waPhone.value.replace(/\D/g, "");
      if (!rawPhone || rawPhone.length < 10) {
        showToast("Digite um número com DDD válido (ex: 11 99999-9999).", "error");
        waPhone.focus();
        return null;
      }

      // Adiciona DDI do Brasil (55) se não fornecido
      const fullPhone = rawPhone.startsWith("55") ? rawPhone : "55" + rawPhone;
      const msg = waMessage.value.trim();

      const payload = msg
        ? `https://wa.me/${fullPhone}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/${fullPhone}`;

      return {
        type: "WhatsApp",
        displayType: `WhatsApp (+${fullPhone})`,
        rawInput: waPhone.value,
        payload: payload,
        isUrl: true,
      };
    }

    if (currentTab === "pix") return buildPixPayload();

    return null;
  }

  function drawLogoOnCanvas(canvas) {
    if (!qrLogoImage) return;

    const context = canvas.getContext("2d");
    const logoMaxSize = canvas.width * 0.18;
    const scale = Math.min(logoMaxSize / qrLogoImage.naturalWidth, logoMaxSize / qrLogoImage.naturalHeight);
    const logoWidth = qrLogoImage.naturalWidth * scale;
    const logoHeight = qrLogoImage.naturalHeight * scale;

    // Sem uma placa opaca, os pixels transparentes da imagem preservam a transparência.
    context.drawImage(
      qrLogoImage,
      (canvas.width - logoWidth) / 2,
      (canvas.height - logoHeight) / 2,
      logoWidth,
      logoHeight,
    );
  }

  function embedLogoInSvg(svg) {
    if (!qrLogoDataUrl) return svg;
    const viewBox = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    if (!viewBox) throw new Error("Não foi possível preparar o QR Code em SVG.");

    const width = Number(viewBox[1]);
    const height = Number(viewBox[2]);
    const logo = Math.min(width, height) * 0.18;
    const logoX = (width - logo) / 2;
    const logoY = (height - logo) / 2;
    const overlay = `<image x="${logoX}" y="${logoY}" width="${logo}" height="${logo}" href="${qrLogoDataUrl}" preserveAspectRatio="xMidYMid meet"/>`;
    return svg.replace("</svg>", `${overlay}</svg>`);
  }

  async function buildQrOutput(payload, size, format = "png") {
    const options = {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size,
      color: { dark: currentQrColor, light: currentBgColor },
    };

    if (format === "svg") {
      const svg = await QRCode.toString(payload, options);
      return embedLogoInSvg(svg);
    }

    const canvas = await QRCode.toCanvas(payload, options);
    drawLogoOnCanvas(canvas);
    return canvas.toDataURL("image/png");
  }

  function dataUrlToBlob(dataUrl) {
    const [metadata, encoded] = dataUrl.split(",");
    const bytes = atob(encoded);
    const buffer = new Uint8Array(bytes.length);
    for (let index = 0; index < bytes.length; index++) buffer[index] = bytes.charCodeAt(index);
    const mimeType = metadata.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
    return new Blob([buffer], { type: mimeType });
  }

  function setLogo(file) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      showToast("Use uma imagem PNG, JPG ou WebP.", "error");
      qrLogoPicker.value = "";
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      showToast("A imagem deve ter até 2 MB.", "error");
      qrLogoPicker.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => showToast("Não foi possível abrir essa imagem.", "error");
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => showToast("Esse arquivo não é uma imagem válida.", "error");
      image.onload = () => {
        qrLogoImage = image;
        qrLogoDataUrl = String(reader.result);
        qrLogoStatus.textContent = `${file.name} · somente nesta sessão`;
        removeQrLogoBtn.hidden = false;
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  qrLogoPicker.addEventListener("change", () => setLogo(qrLogoPicker.files[0]));
  removeQrLogoBtn.addEventListener("click", () => {
    qrLogoImage = null;
    qrLogoDataUrl = "";
    qrLogoPicker.value = "";
    qrLogoStatus.textContent = "Arquivo processado apenas nesta sessão.";
    removeQrLogoBtn.hidden = true;
  });

  // ===== Geração do QR Code =====
  async function generateQrCode() {
    if (isGenerating) return;

    const data = getPayloadForActiveTab();
    if (!data) return;

    isGenerating = true;
    generateBtn.disabled = true;
    generateBtnText.textContent = "Gerando código...";

    // Exibe spinner de loading no frame
    qrPlaceholder.style.display = "none";
    qrImage.style.display = "none";
    qrLoadingSpinner.style.display = "flex";
    qrFrame.style.backgroundColor = currentBgColor;

    try {
      const previewUrl = await buildQrOutput(data.payload, 400);
      qrImage.src = previewUrl;
      if (typeof qrImage.decode === "function") await qrImage.decode();

      isGenerating = false;
      generateBtn.disabled = false;
      generateBtnText.textContent = "Gerar QR Code";

      qrLoadingSpinner.style.display = "none";
      qrImage.style.display = "block";
      lastGeneratedPayload = data.payload;
      lastGeneratedType = data.type;
      lastGeneratedIsUrl = data.isUrl;

      qrInfo.style.display = "flex";
      qrInfoType.textContent = data.displayType;
      qrInfoText.textContent = data.displayText || data.payload;
      qrInfoText.title = data.displayText || data.payload;

      if (data.isUrl) {
        btnTestLink.style.display = "inline-flex";
        btnTestLink.href = data.payload;
      } else {
        btnTestLink.style.display = "none";
      }
      actionsGrid.style.display = "grid";
      showToast("QR Code gerado com sucesso!", "success");
    } catch (error) {
      console.error(error);
      isGenerating = false;
      generateBtn.disabled = false;
      generateBtnText.textContent = "Tentar novamente";
      qrLoadingSpinner.style.display = "none";
      qrPlaceholder.style.display = "flex";
      showToast("Não foi possível gerar o QR Code.", "error");
    }
  }

  generateBtn.addEventListener("click", generateQrCode);

  // Gatilho com a tecla Enter nos inputs
  [urlInput, textInput, wifiSsid, wifiPass, waPhone, waMessage, pixKey, pixName, pixCity, pixAmount].forEach((input) => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        generateQrCode();
      }
    });
  });

  // ===== Ações de Download =====
  async function downloadQrFile(format = "png") {
    if (!lastGeneratedPayload) {
      showToast("Gere um QR Code antes de baixar.", "error");
      return;
    }

    try {
      showToast(`Baixando QR Code (${currentSize}px .${format.toUpperCase()})...`, "info");
      const output = await buildQrOutput(lastGeneratedPayload, currentSize, format);
      const blob = format === "svg"
        ? new Blob([output], { type: "image/svg+xml;charset=utf-8" })
        : dataUrlToBlob(output);
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      const typeSlug = lastGeneratedType.toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `qr-fast-${typeSlug}-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      showToast(`Download de .${format.toUpperCase()} concluído!`, "success");
    } catch (err) {
      console.error(err);
      showToast("Erro ao baixar o arquivo. Tente novamente.", "error");
    }
  }

  btnDownloadPng.addEventListener("click", () => downloadQrFile("png"));
  btnDownloadSvg.addEventListener("click", () => downloadQrFile("svg"));

  // ===== Copiar Imagem para Área de Transferência =====
  btnCopyImg.addEventListener("click", async () => {
    if (!lastGeneratedPayload) {
      showToast("Gere um QR Code antes de copiar.", "error");
      return;
    }

    try {
      showToast("Copiando imagem...", "info");
      const pngUrl = await buildQrOutput(lastGeneratedPayload, currentSize, "png");
      const blob = dataUrlToBlob(pngUrl);

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        showToast("Imagem copiada para a área de transferência!", "success");
      } else {
        // Fallback para cópia do conteúdo em texto
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(lastGeneratedPayload);
          showToast("Conteúdo copiado como texto!", "info");
        } else {
          showToast("A cópia não está disponível neste navegador.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showToast("Não foi possível copiar a imagem no seu navegador.", "error");
    }
  });

  // ===== Compartilhar (Web Share API) =====
  btnShare.addEventListener("click", async () => {
    if (!lastGeneratedPayload) {
      showToast("Gere um QR Code antes de compartilhar.", "error");
      return;
    }

    try {
      const pngUrl = await buildQrOutput(lastGeneratedPayload, 600, "png");
      const blob = dataUrlToBlob(pngUrl);
      const file = new File([blob], "qr-code.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "QR Code - QR-FAST",
          text: `QR Code para: ${lastGeneratedPayload}`,
          files: [file],
        });
      } else if (navigator.share) {
        const shareData = {
          title: "QR Code - QR-FAST",
          text: lastGeneratedType === "Pix"
            ? `Pix Copia e Cola:\n${lastGeneratedPayload}`
            : `QR Code para: ${lastGeneratedPayload}`,
        };
        if (lastGeneratedIsUrl) shareData.url = lastGeneratedPayload;
        await navigator.share(shareData);
      } else {
        // Se Web Share não estiver disponível, copia a imagem
        btnCopyImg.click();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        showToast("Não foi possível compartilhar.", "error");
      }
    }
  });
});
