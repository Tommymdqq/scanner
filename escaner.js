// escaner.js
window.registerTool({
  id: "escaner",
  name: "Escáner",
  icon: "📷",
  render: function(container) {
    container.innerHTML = `
      <div style="padding: 16px; text-align: center;">
        <h2 style="color: #38bdf8;">📷 Escáner de Productos</h2>
        <p style="color: #94a3b8; margin-top: 8px;">Herramienta cargada correctamente.</p>
      </div>
    `;
  }
});
