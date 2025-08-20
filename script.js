/**
 * Portafolio de Marco Saul Ramos Morales
 * - Render dinámico de habilidades, proyectos y experiencia
 * - Filtro por etiquetas en proyectos
 * - Modal de detalle de proyecto
 * - Tema persistente (light/dark) con localStorage
 * - Validación accesible del formulario de contacto
 * - Navegación responsiva y back-to-top
 * Clean Code: funciones puras, datos separados, early returns, nombres descriptivos.
 */

/* ==============================
Datos (edítalos a tu gusto)
============================== */
const PROFILE = {
name: "Marco Saul Ramos Morales",
role: "Ingeniero de Sistemas",
location: "Cochabamba, Bolivia",
email: "marco.saul@gmail.com",
phone: "+59179962272",
linkedin: "https://www.linkedin.com/in/marco-saul-ramos",
github: "https://github.com/MSaulRM",
};

const SKILLS = [
{ name: "HTML5/CSS3", level: 90, category: "Frontend" },
{ name: "JavaScript/TypeScript", level: 88, category: "Frontend" },
{ name: "Angular", level: 85, category: "Frontend" },
{ name: "React", level: 80, category: "Frontend" },
{ name: "Laravel (PHP)", level: 86, category: "Backend" },
{ name: "Node.js", level: 78, category: "Backend" },
{ name: "MySQL/PostgreSQL", level: 82, category: "Base de Datos" },
{ name: "Firebase", level: 74, category: "Cloud" },
{ name: "Git/GitHub", level: 90, category: "Herramientas" },
{ name: "Docker", level: 70, category: "DevOps" },
{ name: "Testing (Jest/PHPUnit)", level: 65, category: "Calidad" },
{ name: "Scrum / XP", level: 80, category: "Metodologías" },
];

const PROJECTS = [
{
    id: "waste-vision",
    title: "Waste Vision App",
    summary: "App móvil de visión artificial para clasificación de residuos y educación ambiental.",
    description:
    "Aplicación híbrida con Flutter + TensorFlow Lite para clasificar residuos en tiempo real, notificar puntos de acopio y educar al usuario con retos y logros. Incluye panel web de indicadores y mapa con rutas óptimas.",
    tags: ["Flutter", "TFLite", "Firebase", "Google Maps"],
    links: {
    repo: "#",
    demo: "#",
    },
},
{
    id: "taller-calyfer",
    title: "Gestión de Taller Automotriz",
    summary: "Sistema web para órdenes, inventario y facturación en taller mecánico.",
    description:
    "Arquitectura Laravel + Angular + MySQL, módulos de clientes/vehículos/órdenes, control de stock, reportes PDF y flujos de caja. Autenticación JWT y control de roles.",
    tags: ["Laravel", "Angular", "MySQL", "JWT"],
    links: {
    repo: "#",
    demo: "#",
    },
},
{
    id: "sentry-bo",
    title: "SENTRY-BO (Monitoreo en Tiempo Real)",
    summary: "Electron app con Firebase para localización y gestión de emergencias.",
    description:
    "Plataforma en escritorio (Electron) con rastreo en tiempo real, asignación de móviles, registros de enrutamientos e integración con Google Maps. Notificaciones y auditoría.",
    tags: ["Electron", "Firebase", "Google Maps"],
    links: {
    repo: "#",
    demo: "#",
    },
},
{
    id: "pharma-local",
    title: "Farmacia Local (Offline-First)",
    summary: "Gestión de ventas e inventario sin depender de hosting externo.",
    description:
    "Aplicación local-first con respaldo periódico, códigos de barras, reportes diarios y módulo de usuarios. Enfoque en resiliencia y facilidad de uso.",
    tags: ["Laravel", "Angular", "SQLite", "PWA"],
    links: {
    repo: "#",
    demo: "#",
    },
},
];

const EXPERIENCE = [
{
    role: "Desarrollador Full Stack",
    company: "Freelance",
    period: "2022 — Actualidad",
    details: [
    "Diseño e implementación de sistemas web end-to-end.",
    "Optimización de consultas y mejora de performance hasta 35%.",
    "Automatización de despliegues con GitHub Actions y contenedores.",
    ],
},
{
    role: "Ingeniero de Software",
    company: "Proyectos Académico-Industriales",
    period: "2020 — 2022",
    details: [
    "Integración de modelos ML en apps web/móviles.",
    "Documentación técnica y coaching en metodologías ágiles.",
    ],
},
];

/* ==============================
Utilidades
============================== */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const createEl = (tag, opts = {}) => Object.assign(document.createElement(tag), opts);

function uniqueTags(projects) {
return [...new Set(projects.flatMap(p => p.tags))].sort((a, b) => a.localeCompare(b));
}

/* ==============================
Render de Habilidades
============================== */
function renderSkills(skills) {
const grid = qs("#skillsGrid");
grid.innerHTML = "";
skills.forEach(({ name, level, category }) => {
    const card = createEl("article", { className: "skill" });
    const title = createEl("div", { className: "skill__name", textContent: `${name} · ${category}` });
    const bar = createEl("div", { className: "skill__bar" });
    const fill = createEl("div", { className: "skill__bar-fill" });
    fill.style.width = "0%";
    bar.appendChild(fill);
    card.append(title, bar);
    grid.appendChild(card);
    // animación diferida
    requestAnimationFrame(() => (fill.style.width = `${Math.max(10, Math.min(level, 100))}%`));
});
}

/* ==============================
Render de Proyectos
============================== */
function renderProjects(projects) {
const grid = qs("#projectsGrid");
grid.innerHTML = "";
projects.forEach((p) => grid.appendChild(projectCard(p)));
}

function projectCard(project) {
const { id, title, summary, tags, links } = project;
const card = createEl("article", { className: "project" });

const thumb = createEl("div", { className: "project__thumb", role: "img", ariaLabel: title });
const body = createEl("div", { className: "project__body" });
const h3 = createEl("h3", { className: "project__title", textContent: title });
const p = createEl("p", { className: "project__summary", textContent: summary });

const tagList = createEl("div", { className: "tag-list" });
tags.forEach(t => tagList.appendChild(createEl("span", { className: "tag", textContent: t })));

const actions = createEl("div", { className: "project__actions" });
const btnDetails = createEl("button", { className: "btn btn--ghost", textContent: "Detalles" });
btnDetails.addEventListener("click", () => openProjectModal(project));

const linkRepo = createEl("a", { className: "btn", href: links.repo || "#", textContent: "Repositorio" });
linkRepo.target = "_blank"; linkRepo.rel = "noopener noreferrer";

const linkDemo = createEl("a", { className: "btn", href: links.demo || "#", textContent: "Demo" });
linkDemo.target = "_blank"; linkDemo.rel = "noopener noreferrer";

actions.append(btnDetails, linkRepo, linkDemo);
body.append(h3, p, tagList, actions);
card.append(thumb, body);
card.dataset.tags = tags.join(",");

// para enlace directo vía hash (#proyecto-id)
card.id = `proyecto-${id}`;

return card;
}

/* ==============================
Modal de Proyecto
============================== */
function openProjectModal(project) {
const modal = qs("#projectModal");
qs("#modalTitle", modal).textContent = project.title;

const body = qs("#modalBody", modal);
body.innerHTML = "";
const desc = createEl("p", { textContent: project.description });
const tags = createEl("div", { className: "tag-list" });
project.tags.forEach(t => tags.appendChild(createEl("span", { className: "tag", textContent: t })));
body.append(desc, tags);

const footer = qs("#modalFooter", modal);
footer.innerHTML = "";
const repo = createEl("a", { className: "btn", href: project.links.repo || "#", textContent: "Repositorio" });
repo.target = "_blank"; repo.rel = "noopener noreferrer";
const demo = createEl("a", { className: "btn btn--primary", href: project.links.demo || "#", textContent: "Ver Demo" });
demo.target = "_blank"; demo.rel = "noopener noreferrer";
footer.append(repo, demo);

modal.showModal();
}

/* ==============================
Filtro por etiqueta
============================== */
function setupTagFilter(projects) {
const select = qs("#tagFilter");
const tags = uniqueTags(projects);
// poblar select
tags.forEach(t => select.appendChild(createEl("option", { value: t, textContent: t })));

select.addEventListener("change", () => {
    const { value } = select;
    const all = qsa("#projectsGrid .project");
    if (value === "__ALL__") {
    all.forEach(el => (el.style.display = ""));
    return;
    }
    all.forEach(el => {
    const has = (el.dataset.tags || "").split(",").includes(value);
    el.style.display = has ? "" : "none";
    });
});
}

/* ==============================
Experiencia (timeline)
============================== */
function renderExperience(items) {
const wrap = qs("#timeline");
wrap.innerHTML = "";
items.forEach(({ role, company, period, details }) => {
    const it = createEl("article", { className: "timeline__item" });
    const title = createEl("div", { className: "timeline__role", textContent: `${role} · ${company}` });
    const meta = createEl("div", { className: "timeline__meta", textContent: period });
    const list = createEl("ul");
    details.forEach(d => list.appendChild(createEl("li", { textContent: d })));
    it.append(title, meta, list);
    wrap.appendChild(it);
});
}

/* ==============================
Tema (dark/light)
============================== */
const THEME_KEY = "portfolio:theme";
function getSavedTheme() { return localStorage.getItem(THEME_KEY) || "light"; }
function setTheme(theme) {
document.documentElement.setAttribute("data-theme", theme);
localStorage.setItem(THEME_KEY, theme);
qs("#themeToggle").setAttribute("aria-pressed", theme === "dark");
}
function toggleTheme() {
const current = document.documentElement.getAttribute("data-theme") || "light";
setTheme(current === "light" ? "dark" : "light");
}

/* ==============================
Navegación y utilidades UI
============================== */
function setupNav() {
const toggle = qs("#navToggle");
const list = qs("#siteNav");
toggle.addEventListener("click", () => {
    const open = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
});

// Cerrar al navegar
qsa(".nav__link").forEach(a => a.addEventListener("click", () => list.classList.remove("is-open")));

// Active link on scroll
const sections = ["sobre-mi", "habilidades", "proyectos", "experiencia", "contacto"].map(id => qs(`#${id}`));
const links = qsa(".nav__link");
const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
    if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
    }
    });
}, { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 });
sections.forEach(s => s && obs.observe(s));
}

function setupBackToTop() {
const btn = qs("#backToTop");
window.addEventListener("scroll", () => {
    const show = window.scrollY > 500;
    btn.classList.toggle("is-visible", show);
});
btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* ==============================
Formulario (validación básica)
============================== */
function validateForm(data) {
const errors = {};
if (!data.name || data.name.trim().length < 2) errors.name = "Ingresa tu nombre.";
if (!/^\S+@\S+\.\S+$/.test(data.email || "")) errors.email = "Ingresa un email válido.";
if (!data.message || data.message.trim().length < 10) errors.message = "Cuéntame un poco más (≥ 10 caracteres).";
return errors;
}

function setupForm() {
const form = qs("#contactForm");
const feedback = qs("#formFeedback");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    feedback.textContent = "";

    const data = Object.fromEntries(new FormData(form).entries());
    const errors = validateForm(data);

    // limpiar errores previos
    qsa(".form__error").forEach(el => (el.textContent = ""));

    if (Object.keys(errors).length) {
    for (const [field, msg] of Object.entries(errors)) {
        const el = qs(`.form__error[data-for="${field}"]`);
        if (el) el.textContent = msg;
    }
    return;
    }

    // Aquí podrías integrar un servicio real (EmailJS, API propia, etc.)
    feedback.textContent = "¡Gracias! Tu mensaje ha sido enviado (simulado).";
    form.reset();
});
}

/* ==============================
Modal events
============================== */
function setupModal() {
const modal = qs("#projectModal");
const closeBtn = qs("#modalClose");
closeBtn.addEventListener("click", () => modal.close());
modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.open) modal.close();
});
}

/* ==============================
Inicialización
============================== */
function init() {
// Año en footer
qs("#year").textContent = new Date().getFullYear();

// Tema
setTheme(getSavedTheme());
qs("#themeToggle").addEventListener("click", toggleTheme);

// Render
renderSkills(SKILLS);
renderProjects(PROJECTS);
renderExperience(EXPERIENCE);
setupTagFilter(PROJECTS);

// UI
setupNav();
setupBackToTop();
setupForm();
setupModal();

// Enlace directo a un proyecto vía hash (#proyecto-id)
if (location.hash.startsWith("#proyecto-")) {
    const id = location.hash.replace("#proyecto-", "");
    const p = PROJECTS.find(x => x.id === id);
    if (p) openProjectModal(p);
}
}

document.addEventListener("DOMContentLoaded", init);
