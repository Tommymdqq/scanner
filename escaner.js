// escaner.js - Módulo de Escáner IA para Toolbox Hub
window.registerTool({
  id: "escaner",
  name: "Escáner",
  icon: "📷",
  render: function(container) {
    // 1. Inyectar HTML de la interfaz del Escáner
    container.innerHTML = `
      <style>
        .escaner-wrapper {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #090d16;
          color: #f8fafc;
        }

        .escaner-tabs {
          display: flex;
          background: rgba(19, 27, 46, 0.8);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 6px;
          gap: 6px;
        }

        .escaner-tab-btn {
          flex: 1;
          padding: 8px;
          background: none;
          border: none;
          color: #94a3b8;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
        }

        .escaner-tab-btn.active {
          background: rgba(56, 189, 248, 0.15);
          color: #38bdf8;
        }

        .escaner-section {
          display: none;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .escaner-section.active {
          display: flex;
          flex-direction: column;
        }

        /* Vista Cámara */
        .camera-container {
          position: relative;
          flex: 1;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .camera-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .camera-container canvas.overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .ai-hud {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 6px 14px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 500;
          z-index: 5;
        }

        .color-swatch {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.4);
        }

        .scan-toast {
          position: absolute;
          top: 50px;
          left: 50%;
          transform: translateX(-50%);
          background: #10b981;
          color: #fff;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: none;
          z-index: 10;
        }

        .scanner-controls {
          position: absolute;
          bottom: 20px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 20px;
          z-index: 5;
        }

        .btn-capture {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid #fff;
          background: rgba(255, 255, 255, 0.25);
          color: #fff;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(4px);
        }

        .toggle-auto {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255,255,255,0.1);
          color: #94a3b8;
          padding: 8px 12px;
          border-radius: 16px;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .toggle-auto.active {
          background: #0284c7;
          color: #fff;
        }

        /* Biblioteca */
        .lib-header {
          padding: 10px;
          display: flex;
          gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .lib-search {
          flex: 1;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: #131b2e;
          color: #fff;
          font-size: 0.8rem;
        }

        .grid-list {
          flex: 1;
          overflow-y: auto;
          padding: 10px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }

        .card {
          background: #131b2e;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.08);
          cursor: pointer;
        }

        .card img {
          width: 100%;
          height: 110px;
          object-fit: cover;
          background: #000;
        }

        .card-body {
          padding: 8px;
        }

        .card-title {
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .card-meta {
          font-size: 0.7rem;
          color: #94a3b8;
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: 4px;
        }

        /* Modal Interno */
        .esc-modal {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.85);
          backdrop-filter: blur(8px);
          display: none;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 50;
        }

        .esc-modal-box {
          background: #1e293b;
          width: 100%;
          max-width: 340px;
          border-radius: 16px;
          padding: 16px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .esc-modal h3 { font-size: 0.95rem; margin-bottom: 10px; }
        .esc-form-group { margin-bottom: 10px; }
        .esc-form-group label { display: block; font-size: 0.7rem; color: #94a3b8; margin-bottom: 4px; }
        .esc-form-group input, .esc-form-group select {
          width: 100%; padding: 8px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #fff; font-size: 0.8rem;
        }

        .esc-modal-btns { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
        .btn-sec { background: #334155; color: #fff; border: none; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; }
        .btn-pri { background: #38bdf8; color: #000; font-weight: 600; border: none; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; }
        .btn-del { background: #ef4444; color: #fff; font-weight: 600; border: none; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer; }
      </style>

      <div class="escaner-wrapper">
        <div class="escaner-tabs">
          <button id="esc-tab-cam" class="escaner-tab-btn active">📷 Escáner IA</button>
          <button id="esc-tab-lib" class="escaner-tab-btn">📦 Biblioteca (<span id="esc-count">0</span>)</button>
        </div>

        <!-- Sec Cámara -->
        <div id="esc-sec-cam" class="escaner-section active">
          <div class="camera-container">
            <video id="esc-video" autoplay playsinline muted></video>
            <canvas id="esc-canvas" class="overlay"></canvas>
            
            <div class="ai-hud">
              <div id="esc-hud-swatch" class="color-swatch"></div>
              <span id="esc-hud-text">Iniciando cámara...</span>
            </div>

            <div id="esc-toast" class="scan-toast">¡Objeto Capturado!</div>
          </div>

          <div class="scanner-controls">
            <button id="esc-btn-auto" class="toggle-auto">Auto: OFF</button>
            <button id="esc-btn-capture" class="btn-capture">📷</button>
            <div style="width: 60px;"></div>
          </div>
        </div>

        <!-- Sec Biblioteca -->
        <div id="esc-sec-lib" class="escaner-section">
          <div class="lib-header">
            <input type="text" id="esc-search" class="lib-search" placeholder="Buscar objeto, color o tipo...">
          </div>
          <div id="esc-grid" class="grid-list"></div>
        </div>

        <!-- Modal Save -->
        <div id="esc-modal-save" class="esc-modal">
          <div class="esc-modal-box">
            <h3>Registrar Producto</h3>
            <div class="esc-form-group">
              <label>Nombre / Modelo</label>
              <input type="text" id="esc-input-title">
            </div>
            <div class="esc-form-group">
              <label>Categoría IA</label>
              <select id="esc-select-cat">
                <option value="Funda de Teléfono">Funda de Teléfono</option>
                <option value="Mouse / Ratón">Mouse / Ratón</option>
                <option value="Auriculares">Auriculares</option>
                <option value="Cargador / Cable">Cargador / Cable</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="esc-modal-btns">
              <button id="esc-btn-cancel-save" class="btn-sec">Cancelar</button>
              <button id="esc-btn-confirm-save" class="btn-pri">Guardar</button>
            </div>
          </div>
        </div>

        <!-- Modal Detalle -->
        <div id="esc-modal-detail" class="esc-modal">
          <div class="esc-modal-box">
            <img id="esc-detail-img" style="width:100%; height:160px; object-fit:cover; border-radius:10px; margin-bottom:10px;">
            <h3 id="esc-detail-title">Detalle</h3>
            <p id="esc-detail-cat" style="font-size:0.8rem; color:#38bdf8; margin-bottom:4px;"></p>
            <p id="esc-detail-color" style="font-size:0.75rem; color:#94a3b8; margin-bottom:4px;"></p>
            <p id="esc-detail-date" style="font-size:0.7rem; color:#64748b; margin-bottom:12px;"></p>
            <div class="esc-modal-btns" style="justify-content:space-between;">
              <button id="esc-btn-delete" class="btn-del">Eliminar</button>
              <button id="esc-btn-close-detail" class="btn-sec">Cerrar</button>
            </div>
          </div>
        </div>

      </div>
    `;

    // 2. Lógica JavaScript Interna
    let autoScan = false;
    let lastScanTime = 0;
    let items = JSON.parse(localStorage.getItem('scanned_items_hub') || '[]');
    let currentTempCapture = null;
    let activeDetailItem = null;
    let currentAIResult = { category: 'Funda de Teléfono', colorName: 'Gris', hex: '#64748b' };

    const video = container.querySelector('#esc-video');
    const canvas = container.querySelector('#esc-canvas');
    const ctx = canvas.getContext('2d');
    const countBadge = container.querySelector('#esc-count');
    const toast = container.querySelector('#esc-toast');
    const autoBtn = container.querySelector('#esc-btn-auto');
    const captureBtn = container.querySelector('#esc-btn-capture');
    const grid = container.querySelector('#esc-grid');
    const searchInput = container.querySelector('#esc-search');

    const modalSave = container.querySelector('#esc-modal-save');
    const modalDetail = container.querySelector('#esc-modal-detail');

    // Inicializar Cámara
    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          resizeCanvas();
          requestAnimationFrame(processFrame);
        };
      } catch (err) {
        container.querySelector('#esc-hud-text').textContent = "Error al acceder a la cámara";
      }
    }

    function resizeCanvas() {
      canvas.width = video.videoWidth || video.clientWidth || 300;
      canvas.height = video.videoHeight || video.clientHeight || 400;
    }

    // Análisis de Fotograma IA
    function processFrame() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const boxW = canvas.width * 0.55;
        const boxH = canvas.height * 0.45;
        const x = (canvas.width - boxW) / 2;
        const y = (canvas.height - boxH) / 2;

        ctx.strokeStyle = autoScan ? '#10b981' : '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, boxW, boxH);

        // Submuestreo de análisis
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 60; tempCanvas.height = 60;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(video, x, y, boxW, boxH, 0, 0, 60, 60);

        const imgData = tempCtx.getImageData(0, 0, 60, 60);
        currentAIResult = analyzeFrame(imgData);

        container.querySelector('#esc-hud-swatch').style.backgroundColor = currentAIResult.hex;
        container.querySelector('#esc-hud-text').textContent = `${currentAIResult.category} (${currentAIResult.colorName})`;

        const now = Date.now();
        if (autoScan && (now - lastScanTime > 3500)) {
          lastScanTime = now;
          triggerCapture();
        }
      }
      requestAnimationFrame(processFrame);
    }

    function analyzeFrame(imageData) {
      const data = imageData.data;
      let r = 0, g = 0, b = 0, edges = 0, count = 0;
      let prevVal = 0;

      for (let i = 0; i < data.length; i += 16) {
        r += data[i]; g += data[i+1]; b += data[i+2];
        count++;
        const currentVal = (data[i] + data[i+1] + data[i+2]) / 3;
        if (Math.abs(currentVal - prevVal) > 30) edges++;
        prevVal = currentVal;
      }

      const avgR = r / count, avgG = g / count, avgB = b / count;
      const bright = (avgR + avgG + avgB) / 3;

      let colorName = "Gris";
      let hex = `#${Math.round(avgR).toString(16).padStart(2,'0')}${Math.round(avgG).toString(16).padStart(2,'0')}${Math.round(avgB).toString(16).padStart(2,'0')}`;

      if (bright < 45) { colorName = "Negro Matte"; hex = "#1e1e1e"; }
      else if (bright > 210) { colorName = "Blanco"; hex = "#f1f5f9"; }
      else if (avgR > avgG && avgR > avgB) { colorName = "Rojo"; hex = "#ef4444"; }
      else if (avgB > avgR && avgB > avgG) { colorName = "Azul Cobalto"; hex = "#2563eb"; }
      else if (avgG > avgR && avgG > avgB) { colorName = "Verde Menta"; hex = "#10b981"; }

      let category = "Funda de Teléfono";
      if (edges > 90) category = "Auriculares";
      else if (edges > 60) category = "Mouse / Ratón";
      else if (bright > 180 && edges < 35) category = "Cargador / Cable";

      return { category, colorName, hex };
    }

    function triggerCapture() {
      toast.style.display = 'block';
      setTimeout(() => toast.style.display = 'none', 1200);

      const capCanvas = document.createElement('canvas');
      capCanvas.width = 350; capCanvas.height = 350;
      const capCtx = capCanvas.getContext('2d');

      const boxW = video.videoWidth * 0.55;
      const boxH = video.videoHeight * 0.45;
      const x = (video.videoWidth - boxW) / 2;
      const y = (video.videoHeight - boxH) / 2;

      capCtx.drawImage(video, x, y, boxW, boxH, 0, 0, 350, 350);

      currentTempCapture = {
        img: capCanvas.toDataURL('image/jpeg', 0.85),
        ai: currentAIResult,
        date: new Date().toLocaleString()
      };

      container.querySelector('#esc-input-title').value = `${currentAIResult.category} (${currentAIResult.colorName})`;
      container.querySelector('#esc-select-cat').value = currentAIResult.category;
      modalSave.style.display = 'flex';
    }

    // Renderizar Galería
    function updateLibraryUI() {
      countBadge.textContent = items.length;
      const filter = searchInput.value.toLowerCase();

      const filtered = items.filter(item => 
        item.title.toLowerCase().includes(filter) || 
        item.category.toLowerCase().includes(filter) ||
        item.colorName.toLowerCase().includes(filter)
      );

      grid.innerHTML = filtered.map(item => `
        <div class="card" data-id="${item.id}">
          <img src="${item.image}" alt="${item.title}">
          <div class="card-body">
            <div class="card-title">${item.title}</div>
            <div class="card-meta">
              <span class="color-swatch" style="background:${item.colorHex}"></span>
              ${item.category}
            </div>
          </div>
        </div>
      `).join('');

      // Eventos de toque para ver detalles
      grid.querySelectorAll('.card').forEach(card => {
        card.onclick = () => {
          const id = Number(card.dataset.id);
          activeDetailItem = items.find(i => i.id === id);
          if (activeDetailItem) {
            container.querySelector('#esc-detail-img').src = activeDetailItem.image;
            container.querySelector('#esc-detail-title').textContent = activeDetailItem.title;
            container.querySelector('#esc-detail-cat').textContent = `Categoría: ${activeDetailItem.category}`;
            container.querySelector('#esc-detail-color').textContent = `Color: ${activeDetailItem.colorName}`;
            container.querySelector('#esc-detail-date').textContent = `Registrado: ${activeDetailItem.date}`;
            modalDetail.style.display = 'flex';
          }
        };
      });
    }

    // Manejo de Pestañas Internas
    container.querySelector('#esc-tab-cam').onclick = (e) => {
      container.querySelectorAll('.escaner-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.escaner-section').forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
      container.querySelector('#esc-sec-cam').classList.add('active');
    };

    container.querySelector('#esc-tab-lib').onclick = (e) => {
      container.querySelectorAll('.escaner-tab-btn').forEach(b => b.classList.remove('active'));
      container.querySelectorAll('.escaner-section').forEach(s => s.classList.remove('active'));
      e.target.classList.add('active');
      container.querySelector('#esc-sec-lib').classList.add('active');
      updateLibraryUI();
    };

    // Botones y Eventos
    autoBtn.onclick = () => {
      autoScan = !autoScan;
      autoBtn.classList.toggle('active', autoScan);
      autoBtn.textContent = `Auto: ${autoScan ? 'ON' : 'OFF'}`;
    };

    captureBtn.onclick = () => triggerCapture();
    searchInput.oninput = () => updateLibraryUI();

    container.querySelector('#esc-btn-cancel-save').onclick = () => modalSave.style.display = 'none';
    container.querySelector('#esc-btn-confirm-save').onclick = () => {
      const newItem = {
        id: Date.now(),
        title: container.querySelector('#esc-input-title').value || 'Producto',
        category: container.querySelector('#esc-select-cat').value,
        image: currentTempCapture.img,
        colorName: currentTempCapture.ai.colorName,
        colorHex: currentTempCapture.ai.hex,
        date: currentTempCapture.date
      };
      items.unshift(newItem);
      localStorage.setItem('scanned_items_hub', JSON.stringify(items));
      updateLibraryUI();
      modalSave.style.display = 'none';
    };

    container.querySelector('#esc-btn-close-detail').onclick = () => modalDetail.style.display = 'none';
    container.querySelector('#esc-btn-delete').onclick = () => {
      if (activeDetailItem) {
        items = items.filter(i => i.id !== activeDetailItem.id);
        localStorage.setItem('scanned_items_hub', JSON.stringify(items));
        updateLibraryUI();
        modalDetail.style.display = 'none';
      }
    };

    // Iniciar Módulo
    initCamera();
    updateLibraryUI();
  }
});
