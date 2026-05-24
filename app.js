// ══════════════════════════════════════════════
//  Clínica Noble Corazón – RR. HH. app.js
// ══════════════════════════════════════════════

// ─── Seed data (simula los inserts del DML) ───
let employees = [
  { id: 1, primer_nombre: 'Carlos',  segundo_nombre: 'Andrés', primer_apellido: 'Reyes',     segundo_apellido: 'Mora',     tipo_doc: 'Cédula de Ciudadanía', num_doc: '1098234567', fecha_nac: '1985-03-12', correo: 'c.reyes@noblecorazon.com',     telefono: '3101234567', cargo: 'Médico General',        departamento: 'Medicina General', tipo_contrato: 'Término Indefinido', salario: 4800000, estado: 'Activo'   },
  { id: 2, primer_nombre: 'Luisa',   segundo_nombre: 'Fernanda', primer_apellido: 'Torres',   segundo_apellido: 'Garzón',   tipo_doc: 'Cédula de Ciudadanía', num_doc: '1099876543', fecha_nac: '1990-07-25', correo: 'l.torres@noblecorazon.com',    telefono: '3209876543', cargo: 'Enfermero Jefe',        departamento: 'Enfermería',       tipo_contrato: 'Término Indefinido', salario: 3800000, estado: 'Activo'   },
  { id: 3, primer_nombre: 'Jorge',   segundo_nombre: '',         primer_apellido: 'Méndez',   segundo_apellido: 'Castillo', tipo_doc: 'Cédula de Ciudadanía', num_doc: '1097654321', fecha_nac: '1978-11-05', correo: 'j.mendez@noblecorazon.com',    telefono: '3157654321', cargo: 'Médico Urgenciólogo',   departamento: 'Urgencias',        tipo_contrato: 'Término Fijo',       salario: 6200000, estado: 'Inactivo' },
  { id: 4, primer_nombre: 'Ana',     segundo_nombre: 'María',    primer_apellido: 'Suárez',   segundo_apellido: 'Pérez',    tipo_doc: 'Cédula de Ciudadanía', num_doc: '1096543210', fecha_nac: '1992-04-18', correo: 'a.suarez@noblecorazon.com',    telefono: '3116543210', cargo: 'Coordinador RR. HH.',   departamento: 'Recursos Humanos', tipo_contrato: 'Término Indefinido', salario: 3200000, estado: 'Activo'   },
  { id: 5, primer_nombre: 'Pedro',   segundo_nombre: 'Luis',     primer_apellido: 'Vargas',   segundo_apellido: 'Rincón',   tipo_doc: 'Cédula de Ciudadanía', num_doc: '1095432109', fecha_nac: '1988-09-30', correo: 'p.vargas@noblecorazon.com',    telefono: '3185432109', cargo: 'Auxiliar de Enfermería', departamento: 'Enfermería',       tipo_contrato: 'Término Fijo',       salario: 2800000, estado: 'Activo'   },
  { id: 6, primer_nombre: 'Sandra',  segundo_nombre: '',         primer_apellido: 'Cifuentes', segundo_apellido: 'López',   tipo_doc: 'Cédula de Ciudadanía', num_doc: '1094321098', fecha_nac: '1995-01-14', correo: 's.cifuentes@noblecorazon.com', telefono: '3124321098', cargo: 'Auxiliar Administrativo',departamento: 'Administración',  tipo_contrato: 'Prestación de Servicios', salario: 2000000, estado: 'Inactivo' },
  { id: 7, primer_nombre: 'Camila',  segundo_nombre: 'Sofía',    primer_apellido: 'Herrera',  segundo_apellido: 'Blanco',   tipo_doc: 'Cédula de Ciudadanía', num_doc: '1093210987', fecha_nac: '1993-06-20', correo: 'c.herrera@noblecorazon.com',   telefono: '3133210987', cargo: 'Bacteriólogo',          departamento: 'Laboratorio Clínico', tipo_contrato: 'Término Indefinido', salario: 3500000, estado: 'Activo' },
  { id: 8, primer_nombre: 'Mauricio',segundo_nombre: 'Alberto',  primer_apellido: 'Pineda',   segundo_apellido: 'Ossa',     tipo_doc: 'Cédula de Ciudadanía', num_doc: '1092109876', fecha_nac: '1980-12-03', correo: 'm.pineda@noblecorazon.com',    telefono: '3142109876', cargo: 'Médico Especialista',   departamento: 'Medicina General', tipo_contrato: 'Término Indefinido', salario: 7500000, estado: 'Activo' },
];
let nextId = 9;
let editingId = null;

// ─── Navigation ───────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelector('[data-page="' + page + '"]').classList.add('active');

  const titles = {
    dashboard: 'Dashboard', empleados: 'Empleados', nomina: 'Nómina',
    turnos: 'Turnos', capacitaciones: 'Capacitaciones', evaluaciones: 'Evaluaciones'
  };
  document.getElementById('topbar-title').textContent = titles[page] || page;

  if (page === 'empleados') renderTable();
}

// ─── Dashboard init ────────────────────────────
function initDashboard() {
  // Date
  const d = new Date();
  document.getElementById('date-today').textContent =
    d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

  // Animate KPI counters
  document.querySelectorAll('.kpi-value[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 30);
  });

  // Nomina KPI
  animateMoney('kpi-nomina', 0, 412600000, 50);

  // Bar chart
  drawBarChart();
}

function animateMoney(elId, start, end, steps) {
  const el = document.getElementById(elId);
  if (!el) return;
  let current = start;
  const step = Math.ceil(end / steps);
  const timer = setInterval(() => {
    current = Math.min(current + step, end);
    el.textContent = '$' + (current / 1000000).toFixed(1) + 'M';
    if (current >= end) clearInterval(timer);
  }, 30);
}

function drawBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const data = [398, 405, 401, 408, 412, 412.6];
  const labels = ['Dic', 'Ene', 'Feb', 'Mar', 'Abr', 'May'];
  const W = canvas.width, H = canvas.height;
  const padL = 10, padR = 10, padT = 10, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const maxVal = 430;
  const barW = chartW / data.length * 0.55;
  const gap = chartW / data.length;

  ctx.clearRect(0, 0, W, H);

  data.forEach((val, i) => {
    const x = padL + i * gap + (gap - barW) / 2;
    const barH = (val / maxVal) * chartH;
    const y = padT + chartH - barH;

    // Bar
    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, i === data.length - 1 ? '#0ea5e9' : '#93c5fd');
    grad.addColorStop(1, i === data.length - 1 ? '#065a82' : '#bfdbfe');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 6);
  });
}

// ─── Employees table ──────────────────────────
function renderTable() {
  const deptFilter   = document.getElementById('filter-dept').value;
  const estadoFilter = document.getElementById('filter-estado').value;
  const searchTerm   = document.getElementById('filter-search').value.toLowerCase();

  const filtered = employees.filter(e => {
    const name = (e.primer_nombre + ' ' + e.primer_apellido + ' ' + e.num_doc).toLowerCase();
    return (!deptFilter   || e.departamento === deptFilter) &&
           (!estadoFilter || e.estado === estadoFilter) &&
           (!searchTerm   || name.includes(searchTerm));
  });

  const tbody = document.getElementById('emp-tbody');
  tbody.innerHTML = filtered.map(e => {
    const initials = (e.primer_nombre[0] + e.primer_apellido[0]).toUpperCase();
    const colors = ['#0ea5e9','#10b981','#8b5cf6','#f59e0b','#ef4444','#06b6d4','#84cc16','#f97316'];
    const color = colors[e.id % colors.length];
    const badgeCls = e.estado === 'Activo' ? 'green' : 'red';
    return `
      <tr>
        <td><div class="cell-user"><div class="av" style="background:${color}">${initials}</div>${e.primer_nombre} ${e.primer_apellido}</div></td>
        <td>${e.num_doc}</td>
        <td>${e.cargo}</td>
        <td>${e.departamento}</td>
        <td>${e.tipo_contrato}</td>
        <td>${fmtCOP(e.salario)}</td>
        <td><span class="badge ${badgeCls}">${e.estado}</span></td>
        <td>
          <button class="action-btn edit" onclick="editEmployee(${e.id})">Editar</button>
          <button class="action-btn del" onclick="deleteEmployee(${e.id})">Eliminar</button>
        </td>
      </tr>`;
  }).join('');

  document.getElementById('emp-count').textContent =
    `Mostrando ${filtered.length} de ${employees.length} empleados`;
}

function fmtCOP(n) {
  return '$' + n.toLocaleString('es-CO');
}

// ─── CRUD ─────────────────────────────────────
function openModal(emp) {
  editingId = emp ? emp.id : null;
  document.getElementById('modal-title').textContent = emp ? 'Editar Empleado' : 'Nuevo Empleado';

  const fields = ['primer_nombre','segundo_nombre','primer_apellido','segundo_apellido',
                  'tipo_doc','num_doc','fecha_nac','correo','telefono',
                  'cargo','departamento','tipo_contrato','salario','estado'];
  fields.forEach(f => {
    const el = document.getElementById('f-' + f);
    if (el) el.value = emp ? (emp[f] || '') : '';
  });

  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal-overlay')) return;
  document.getElementById('modal-overlay').classList.remove('open');
  editingId = null;
}

function saveEmployee(e) {
  e.preventDefault();
  const fields = ['primer_nombre','segundo_nombre','primer_apellido','segundo_apellido',
                  'tipo_doc','num_doc','fecha_nac','correo','telefono',
                  'cargo','departamento','tipo_contrato','salario','estado'];
  const data = {};
  fields.forEach(f => { data[f] = document.getElementById('f-' + f).value; });
  data.salario = parseInt(data.salario);

  if (editingId) {
    const idx = employees.findIndex(x => x.id === editingId);
    employees[idx] = { ...employees[idx], ...data };
    showToast('✓ Empleado actualizado correctamente');
  } else {
    data.id = nextId++;
    employees.push(data);
    showToast('✓ Empleado registrado correctamente');
  }

  document.getElementById('modal-overlay').classList.remove('open');
  renderTable();
}

function editEmployee(id) {
  const emp = employees.find(e => e.id === id);
  if (emp) openModal(emp);
}

function deleteEmployee(id) {
  if (!confirm('¿Eliminar este empleado del sistema?')) return;
  employees = employees.filter(e => e.id !== id);
  renderTable();
  showToast('Empleado eliminado');
}

// ─── Toast ────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── Global search (topbar) ───────────────────
document.getElementById('search-input').addEventListener('input', function () {
  const val = this.value.toLowerCase();
  if (!val) return;
  const currentPage = document.querySelector('.nav-item.active').dataset.page;
  if (currentPage !== 'empleados') {
    navigate('empleados');
    setTimeout(() => {
      document.getElementById('filter-search').value = this.value;
      renderTable();
    }, 50);
  } else {
    document.getElementById('filter-search').value = this.value;
    renderTable();
  }
});

// ─── Init ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initDashboard();
  renderTable();
});
