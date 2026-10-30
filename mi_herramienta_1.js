// mi_herramienta_1.js (en la raíz)
window.registerTool({
  id: "mi_herramienta_1",
  name: "Mi Nueva Herramienta",
  icon: "🚀",
  render: function(container) {
    container.innerHTML = `
      <div style="padding: 20px; max-width: 500px; margin: 0 auto;">
        <h2 style="margin-bottom: 10px; color: #38bdf8;">🚀 Mi Nueva Herramienta</h2>
        <p style="margin-bottom: 15px; color: #94a3b8;">
          Esta herramienta fue creada directamente en la raíz de GitHub.
        </p>
        <button id="btn-accion" style="padding: 10px 18px; background: #0284c7; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">
          Ejecutar Acción
        </button>
      </div>
    `;

    // Lógica JavaScript de tu herramienta
    container.querySelector('#btn-accion').addEventListener('click', () => {
      alert('¡Acción ejecutada desde mi_herramienta_1.js!');
    });
  }
});
