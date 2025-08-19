    /* ====== Datos de ejemplo ====== */
const POSTS = [
{
    slug: "bienvenida-al-blog",
    title: "Bienvenida al blog: propósito, stack y hoja de ruta",
    date: "2025-08-01",
    tags: ["Personal", "JavaScript", "Arquitectura"],
    cover: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1200&auto=format&fit=crop",
    coverCaption: "Escritorio minimalista para programar en paz.",
    excerpt: "Por qué este blog existe, qué tecnologías uso y cómo planeo evolucionarlo en público.",
    content: `
# ¿Por qué otro blog?
Escribo para pensar mejor. Este blog será una bitácora pública de proyectos y aprendizajes.

## Stack base
- **HTML/CSS/JS** sin frameworks.
- Accesibilidad, rendimiento y *DX*.

## Roadmap corto
1. Mejorar buscador
2. Integrar analíticas de privacidad
3. Publicar serie sobre **arquitectura de software**

\`\`\`js
// Componente mínimo con Web Components
class MiSaludo extends HTMLElement {
connectedCallback(){ this.textContent = "Hola desde Web Component"; }
}
customElements.define('mi-saludo', MiSaludo);
\`\`\`

Más en [mi repositorio](https://example.com).`
},
{
    slug: "patrones-de-arquitectura-web",
    title: "Patrones de arquitectura web que realmente uso",
    date: "2025-08-08",
    tags: ["Arquitectura", "Buenas prácticas"],
    cover: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop",
    coverCaption: "Capas, módulos y contratos.",
    excerpt: "Hexagonal, CQRS, módulos, contratos… sin dogma y con ejemplos.",
    content: `
# Introducción
No hay balas de plata. Pero sí decisiones conscientes.

## Hexagonal (Ports & Adapters)
Aísla dominio de infraestructura. Útil para mantener **tests** sanos.

## CQRS, ¿siempre?
- Lectura optimizada VS escritura
- Úsalo cuando lo pida el **negocio**, no por moda.

## Módulos front aislados
- Comunicación por eventos
- Versionado semántico de contratos`
},
{
    slug: "guia-productividad-dev",
    title: "Mi guía práctica de productividad para developers",
    date: "2025-08-12",
    tags: ["Productividad", "Vida"],
    cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
    coverCaption: "Energía, foco y descanso.",
    excerpt: "Sistemas, no fuerza de voluntad. Rutinas, no hacks.",
    content: `
# Sistema mínimo viable
- **Captura** todo
- Procesa por bloques
- Calendario primero, tareas después

## Regla 3x3
Cada día: 3 bloques de foco. Cada bloque: 3 objetivos micro.

## Descanso
Dormir es la *tech debt* del cuerpo.`
},
{
    slug: "javascript-que-si-importa-2025",
    title: "JavaScript que sí importa en 2025",
    date: "2025-08-16",
    tags: ["JavaScript"],
    cover: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    coverCaption: "El lenguaje sigue vivo.",
    excerpt: "Lo que estoy usando hoy: módulos, Intl, Web Share, Streams, Acceso a archivos…",
    content: `
# Features
- \`Intl\` para formatos
- Web Share API
- Streams API
- File System Access (cuando aplica)

## Ejemplo rápido
\`\`\`js
const n = 1234567.89;
console.log(new Intl.NumberFormat('es-BO').format(n));
\`\`\``
},
{
    slug: "taller-ia-para-desarrolladores",
    title: "Taller: IA práctica para desarrolladores",
    date: "2025-08-18",
    tags: ["IA", "Taller"],
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    coverCaption: "Modelos útiles sin humo.",
    excerpt: "Cómo integrar IA paso a paso sin sobreprometer.",
    content: `
# Objetivos
- Casos reales
- Evaluación
- Métricas y *guardrails*

## Entregables
- Demo funcional
- Checklist de riesgos
- Roadmap de adopción`
},
];

/* ====== Estado / elementos ====== */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

const els = {
year: $("#year"),
search: $("#search"),
clearSearch: $("#clearSearch"),
posts: $("#posts"),
pager: $("#pager"),
homeView: $("#home-view"),
postView: $("#post-view"),
tagsView: $("#tags-view"),
aboutView: $("#about-view"),
tagCloud: $("#tagCloud"),
tagHeading: $("#tagHeading"),
article: $("#article"),
title: $("#post-title"),
date: $("#post-date"),
read: $("#post-read"),
tags: $("#post-tags"),
coverWrap: $("#post-cover-wrap"),
cover: $("#post-cover"),
coverCap: $("#post-cover-cap"),
content: $("#post-content"),
toc: $("#toc"),
shareBtn: $("#shareBtn"),
copyBtn: $("#copyLinkBtn"),
cForm: $("#commentForm"),
cName: $("#cName"),
cText: $("#cText"),
cList: $("#commentList"),
themeToggle: $("#themeToggle"),
rssBtn: $("#rssBtn"),
progress: $("#progress"),
drawer: $("#drawer"),
menuBtn: $("#menuBtn"),
};

const POSTS_PER_PAGE = 6;
let currentTag = null;
let currentSearch = "";
let currentPage = 1;

/* ====== Utils ====== */
const fmtDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString("es-BO",
{ year: "numeric", month: "short", day: "2-digit" });

const readingTime = (text) => {
const words = text.replace(/[`#*_>!-]/g," ").split(/\s+/).filter(Boolean).length;
const min = Math.max(1, Math.round(words / 180));
return `${min} min de lectura`;
};

const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
.replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

/* ====== Mini Markdown ====== */
function mdToHtml(md) {
let out = md.trim();

// Code blocks
out = out.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
    `<pre><code class="lang-${lang||'code'}">${escapeHtml(code)}</code></pre>`);

// Inline code
out = out.replace(/`([^`]+)`/g, (_, c) => `<code>${escapeHtml(c)}</code>`);

// Images
out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img alt="$1" src="$2">`);

// Links
out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noopener">$1</a>`);

// Headings
out = out.replace(/^###\s+(.*)$/gm, `<h3 id="$1">$1</h3>`);
out = out.replace(/^##\s+(.*)$/gm, `<h2 id="$1">$1</h2>`);
out = out.replace(/^#\s+(.*)$/gm, `<h1>$1</h1>`);

// Bold / Italic
out = out.replace(/\*\*([^*]+)\*\*/g, `<strong>$1</strong>`);
out = out.replace(/\*([^*]+)\*/g, `<em>$1</em>`);

// Lists
out = out.replace(/^(?:- .+(?:\n|$))+?/gm, (block) => {
    const items = block.trim().split("\n").map(line => `<li>${line.replace(/^- /,'')}</li>`).join("");
    return `<ul>${items}</ul>`;
});

// Paragraphs (simple)
out = out.replace(/(^|\n)([^\n<][^\n]*)(?=\n|$)/g, (m, a, line) => {
    if (/^\s*</.test(line)) return m; // no p si ya es tag
    return `${a}<p>${line.trim()}</p>`;
});

// IDs amigables para h2/h3
out = out.replace(/<h(2|3) id="([^"]+)">/g, (_, lvl, text) => {
    const id = slugify(text);
    return `<h${lvl} id="${id}">`;
});

return out;
}
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ====== Render ====== */
function renderList() {
els.homeView.hidden = false;
els.postView.hidden = true;
els.tagsView.hidden = true;
els.aboutView.hidden = true;

const filtered = POSTS
    .filter(p => !currentTag || p.tags.includes(currentTag))
    .filter(p => !currentSearch || (p.title+ p.excerpt+ p.content).toLowerCase().includes(currentSearch.toLowerCase()))
    .sort((a,b)=> new Date(b.date)-new Date(a.date));

// heading por tag
if (currentTag) {
    els.tagHeading.textContent = `Filtrando por etiqueta: #${currentTag}`;
    els.tagHeading.hidden = false;
} else {
    els.tagHeading.hidden = true;
}

// paginación
const total = filtered.length;
const pages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
currentPage = Math.min(currentPage, pages);
const start = (currentPage-1)*POSTS_PER_PAGE;
const pageData = filtered.slice(start, start+POSTS_PER_PAGE);

els.posts.innerHTML = "";
const tpl = $("#card-tpl");
pageData.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const coverLink = $(".card-cover-link", node);
    const cover = $(".card-cover", node);
    const title = $(".card-title", node);
    const excerpt = $(".card-excerpt", node);
    const time = $("time", node);
    const tags = $(".tags", node);

    cover.src = p.cover;
    cover.alt = p.title;
    coverLink.href = `#/post/${p.slug}`;
    title.textContent = p.title;
    title.href = `#/post/${p.slug}`;
    excerpt.textContent = p.excerpt;
    time.textContent = fmtDate(p.date);

    tags.innerHTML = p.tags.map(t=> `<a class="tag" href="#/tag/${encodeURIComponent(t)}">#${t}</a>`).join("");
    els.posts.appendChild(node);
});

// pintar paginador
els.pager.innerHTML = "";
const addBtn = (label, page, disabled=false, current=false) => {
    const b = document.createElement("button");
    b.className = "pill" + (current ? " current" : "");
    b.textContent = label;
    b.disabled = disabled;
    b.onclick = () => {
    currentPage = page;
    location.hash = buildListHash();
    };
    els.pager.appendChild(b);
};
addBtn("«", 1, currentPage===1);
for(let p=1; p<=pages; p++){
    addBtn(String(p), p, false, p===currentPage);
}
addBtn("»", pages, currentPage===pages);
}

function buildListHash(){
// conserva filtros en hash
if (currentTag) return `#/tag/${encodeURIComponent(currentTag)}?p=${currentPage}&q=${encodeURIComponent(currentSearch)}`;
if (currentSearch) return `#/?p=${currentPage}&q=${encodeURIComponent(currentSearch)}`;
return `#/?p=${currentPage}`;
}

function renderTagsView(){
els.homeView.hidden = true;
els.postView.hidden = true;
els.tagsView.hidden = false;
els.aboutView.hidden = true;

const counts = {};
POSTS.forEach(p => p.tags.forEach(t => counts[t] = (counts[t]||0)+1));
els.tagCloud.innerHTML = Object.entries(counts)
    .sort((a,b)=> b[1]-a[1])
    .map(([t,c]) => `<a href="#/tag/${encodeURIComponent(t)}" style="font-size:${Math.min(2,1 + c*0.15)}rem">#${t} (${c})</a>`)
    .join("");
}

function renderAbout(){
els.homeView.hidden = true;
els.postView.hidden = true;
els.tagsView.hidden = true;
els.aboutView.hidden = false;
}

function renderPost(slug){
const post = POSTS.find(p => p.slug === slug);
if (!post) { location.hash = "#/"; return; }

els.homeView.hidden = true;
els.postView.hidden = false;
els.tagsView.hidden = true;
els.aboutView.hidden = true;

document.title = `${post.title} — Mi Blog`;
els.title.textContent = post.title;
els.date.textContent = fmtDate(post.date);
els.read.textContent = readingTime(post.content);
els.tags.innerHTML = post.tags.map(t=> `<a class="tag" href="#/tag/${encodeURIComponent(t)}">#${t}</a>`).join("");

if (post.cover) {
    els.cover.src = post.cover;
    els.coverCap.textContent = post.coverCaption || "";
    els.coverWrap.hidden = false;
} else {
    els.coverWrap.hidden = true;
}

els.content.innerHTML = mdToHtml(post.content);

// TOC automático (h2/h3)
const hs = $$(".prose h2, .prose h3", els.article);
if (hs.length){
    els.toc.innerHTML = `<h2>Contenido</h2>` + hs.map(h=>{
    const id = h.id || slugify(h.textContent);
    h.id = id;
    return `<a href="#${id}" style="padding-left:${h.tagName==='H3'? '12px':'0'}">${h.textContent}</a>`;
    }).join("");
    els.toc.style.display = "";
} else {
    els.toc.innerHTML = "";
    els.toc.style.display = "none";
}

// Comentarios
loadComments(slug);

// Progreso de lectura
observeProgress();
}

/* ====== Router ====== */
function router(){
const h = location.hash || "#/";
// drawer off
els.drawer.removeAttribute("open");
els.drawer.setAttribute("aria-hidden","true");

// params
const [path, queryString] = h.split("?");
const url = new URLSearchParams(queryString || "");
currentPage = parseInt(url.get("p") || "1", 10);
currentSearch = url.get("q") || "";

els.search.value = currentSearch;

if (path === "#/" || path.startsWith("#/page/")){
    currentTag = null;
    renderList();
} else if (path.startsWith("#/tag/")){
    currentTag = decodeURIComponent(path.split("/")[2] || "");
    renderList();
} else if (path.startsWith("#/post/")){
    const slug = decodeURIComponent(path.split("/")[2] || "");
    renderPost(slug);
} else if (path === "#/about"){
    renderAbout();
} else if (path === "#/tags"){
    renderTagsView();
} else {
    location.hash = "#/";
}
}

/* ====== Búsqueda ====== */
els.search.addEventListener("input", (e)=>{
currentSearch = e.target.value.trim();
currentPage = 1;
location.hash = buildListHash();
});
els.clearSearch.addEventListener("click", ()=>{
els.search.value = "";
currentSearch = "";
currentPage = 1;
location.hash = buildListHash();
});

/* ====== Tema ====== */
(function initTheme(){
const saved = localStorage.getItem("theme");
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const theme = saved || (prefersDark ? "dark" : "light");
document.documentElement.setAttribute("data-theme", theme);
els.themeToggle.textContent = theme === "dark" ? "☀️ Claro" : "🌙 Oscuro";
})();
els.themeToggle.addEventListener("click", ()=>{
const cur = document.documentElement.getAttribute("data-theme");
const next = cur === "dark" ? "light" : "dark";
document.documentElement.setAttribute("data-theme", next);
localStorage.setItem("theme", next);
els.themeToggle.textContent = next === "dark" ? "☀️ Claro" : "🌙 Oscuro";
});

/* ====== Menú lateral ====== */
els.menuBtn.addEventListener("click", ()=>{
const isOpen = els.drawer.hasAttribute("open");
if (isOpen) {
    els.drawer.removeAttribute("open");
    els.drawer.setAttribute("aria-hidden","true");
} else {
    els.drawer.setAttribute("open","");
    els.drawer.setAttribute("aria-hidden","false");
}
});

/* ====== Compartir ====== */
els.shareBtn.addEventListener("click", async ()=>{
try {
    await navigator.share({
    title: document.title,
    url: location.href
    });
} catch {
    // ignorado si usuario cancela
}
});
els.copyBtn.addEventListener("click", async ()=>{
await navigator.clipboard.writeText(location.href);
toast("Enlace copiado");
});

/* ====== Comentarios (localStorage) ====== */
function commentsKey(slug){ return `comments:${slug}`; }

function loadComments(slug){
els.cList.innerHTML = "";
els.cForm.dataset.slug = slug;
const arr = JSON.parse(localStorage.getItem(commentsKey(slug)) || "[]");
arr.forEach(addCommentToList);
}

function addCommentToList(item){
const tpl = $("#comment-tpl");
const node = tpl.content.cloneNode(true);
$(".c-name", node).textContent = item.name;
$(".c-time", node).textContent = new Date(item.time).toLocaleString("es-BO");
$(".c-text", node).textContent = item.text;
els.cList.appendChild(node);
}

els.cForm.addEventListener("submit", (e)=>{
e.preventDefault();
const name = els.cName.value.trim();
const text = els.cText.value.trim();
if (!name || !text) return;
const slug = e.currentTarget.dataset.slug;
const item = { name, text, time: Date.now() };
const arr = JSON.parse(localStorage.getItem(commentsKey(slug)) || "[]");
arr.push(item);
localStorage.setItem(commentsKey(slug), JSON.stringify(arr));
els.cText.value = "";
addCommentToList(item);
});

/* ====== RSS dinámico ====== */
els.rssBtn.addEventListener("click", ()=>{
const xml = buildRSS();
const blob = new Blob([xml], {type: "application/rss+xml;charset=utf-8"});
const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "feed.xml";
a.click();
URL.revokeObjectURL(a.href);
});

function buildRSS(){
const items = POSTS.sort((a,b)=> new Date(b.date)-new Date(a.date)).map(p => `
    <item>
    <title>${escapeXml(p.title)}</title>
    <link>${location.href.replace(/#.*$/,'')}#/post/${p.slug}</link>
    <guid isPermaLink="false">${p.slug}</guid>
    <pubDate>${new Date(p.date+"T00:00:00").toUTCString()}</pubDate>
    <description><![CDATA[${p.excerpt}]]></description>
    </item>`).join("");
return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
    <title>Mi Blog</title>
    <link>${location.href.replace(/#.*$/,'')}</link>
    <description>Blog personal en JS/HTML/CSS</description>
    ${items}
    </channel>
</rss>`;
}
const escapeXml = (s)=> s.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[c]));

/* ====== Progreso de lectura ====== */
function observeProgress(){
const el = els.article;
function onScroll(){
    const rect = el.getBoundingClientRect();
    const total = el.scrollHeight - window.innerHeight;
    const scrolled = Math.min(Math.max(window.scrollY - el.offsetTop, 0), total);
    const pct = total > 0 ? (scrolled/total)*100 : 0;
    els.progress.style.width = pct + "%";
}
window.removeEventListener("scroll", onScroll);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
}

/* ====== Init ====== */
function init(){
els.year.textContent = new Date().getFullYear();

// construir nube de tags una vez
renderTagsView();

// primera ruta
router();
}
window.addEventListener("hashchange", router);
window.addEventListener("load", init);

/* ====== Toaster mínimo ====== */
function toast(msg){
const t = document.createElement("div");
t.textContent = msg;
Object.assign(t.style,{
    position:"fixed", bottom:"18px", left:"50%", transform:"translateX(-50%)",
    background:"var(--surface)", color:"var(--text)", border:"1px solid var(--border)",
    padding:".5rem .75rem", borderRadius:".6rem", boxShadow:"var(--shadow)", zIndex:9999
});
document.body.appendChild(t);
setTimeout(()=> t.remove(), 1500);
}
