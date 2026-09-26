# QR-FAST 🚀

Gerador inteligente, moderno e profissional de QR Code em Vanilla JavaScript.

Projetado para criar códigos QR otimizados para smartphones (iOS e Android), garantindo ações diretas como abertura automática de páginas web, conexão instantânea ao Wi-Fi ou conversa direta no WhatsApp.

---

## ✨ Funcionalidades

- 🔗 **Smart Link (URL)**: Detecta e adiciona automaticamente `https://` em domínios informados sem protocolo (ex: `google.com` vira `https://google.com`), permitindo que a câmera do celular abra o navegador diretamente com apenas um toque, em vez de exibir texto puro.
- 📝 **Texto Livre**: Crie QR Codes para notas, mensagens, chaves Pix simples ou anotações com contador de caracteres em tempo real.
- 📶 **Conexão Wi-Fi Instantânea**: Gera códigos no padrão universal ZXing (`WIFI:T:...;S:...;P:...;;`). Ao apontar a câmera do smartphone, ele se conecta à rede sem precisar digitar senhas.
- 💬 **WhatsApp Direto**: Cria links `wa.me` com o número formatado e mensagem pré-definida opcional.
- 🎨 **Personalização de Cores e Estilo**:
  - Seleção de cor dos módulos e de fundo com presets rápidos e seletor nativo de cores.
  - Seletor de resolução (300px para Web, 600px Padrão, 1000px HD para impressão profissional).
- 📥 **Exportação Completa e Sem Falhas de CORS**:
  - Download nativo em **PNG** (via Blob).
  - Download em **SVG** vetorial de alta definição para designers e gráficas.
  - Botão de **Copiar Imagem** para a área de transferência do sistema (para colar no Figma, Photoshop, WhatsApp Web, Word).
  - Botão de **Compartilhar** via Web Share API para dispositivos móveis compatíveis.
- 🪄 **Interface Sofisticada**: Efeito glassmorphism escuro, rastro de cursor dinâmico em HTML5 Canvas, notificações toast e design 100% responsivo.

---

## 📦 Como usar

1. Abra o arquivo `index.html` diretamente no seu navegador (ou via live server).
2. Selecione o tipo de QR Code desejado (Link, Texto, Wi-Fi ou WhatsApp).
3. Preencha as informações (se quiser, personalize as cores e resolução no painel expansível).
4. Clique em **Gerar QR Code** (ou pressione `Enter`).
5. Baixe em **PNG**, **SVG** ou copie a imagem direto para sua área de transferência.

---

## 📄 Licença

```
            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.
```
