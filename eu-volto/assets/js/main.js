/* Eu Volto — Só Pra Agradecer | Emerson Moraes
   Toda a configuração editável está nos objetos abaixo. */

(function () {
"use strict";

/* 1) STREAMING — cole cada URL quando estiver disponível.
      Enquanto estiver vazio, o botão fica desativado (não inventa link). */
var streamingLinks = {
spotify: "https://open.spotify.com/intl-pt/track/7a53b1eHcE1MMqrFYLT83Z?si=b4ee8813aadb4d1c",
deezer: "https://link.deezer.com/s/34oxBmXGD10fuGjcfpq5s",
appleMusic: "https://music.apple.com/us/song/eu-volto/6808007850",
youtubeMusic: "https://music.youtube.com/watch?v=xLiKw1wjYl8&si=WvRJM352_WExWYmZ",
amazonMusic: "https://music.amazon.com/tracks/B0HHL48XVH?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_P4vsETKZuJrmaGfnIZI4cRBXW"
};

/* 2) YOUTUBE — três destinos diferentes, não misturar. */
var youtubeLinks = {
euVolto: "https://www.youtube.com/watch?v=xLiKw1wjYl8",
embedId: "xLiKw1wjYl8",
canal: "https://www.youtube.com/@emersonmoraesbr",
playlistAutorais: "" // TODO: URL pública da playlist "Canções Autorais" (nunca a do YouTube Studio)
};

/* 3) PRODUTOS — preços em um lugar só. */
var products = {
standard: { name: "CD Padrão", price: 29.90 },
premium:  { name: "CD Premium (Caixa Acrílica)", price: 34.90 }
};

/* 4) PRAZOS — texto livre, aparece em "Como funciona". */
var timelines = {
producao: "7 a 10 dias úteis",
envio: "3 a 7 dias úteis, dependendo da localidade"
};

var CONTACT_EMAIL = "emersonmoraesbr@gmail.com";
var MAX_DEDIC = 50;

function brl(v) {
return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* GA4: só dispara se o gtag existir. Sem ID configurado, é inofensivo. */
function trackEvent(name, params) {
if (typeof window.gtag === "function") window.gtag("event", name, params || {});
}

function ready(fn) {
if (document.readyState !== "loading") fn();
else document.addEventListener("DOMContentLoaded", fn);
}

ready(function () {
applyStreaming();
applyYoutube();
setupNav();
setupScrollSpy();
setupReveal();
setupVideo();
setupProduct();
setupTimelines();
setupTracking();
});

function disable(el) {
el.setAttribute("href", "#");
el.setAttribute("aria-disabled", "true");
el.addEventListener("click", function (e) { e.preventDefault(); });
}

function applyStreaming() {
var nodes = document.querySelectorAll("[data-stream]");
for (var i = 0; i < nodes.length; i++) {
var el = nodes[i];
var url = streamingLinks[el.getAttribute("data-stream")];
if (url) {
el.setAttribute("href", url);
el.setAttribute("target", "_blank");
el.setAttribute("rel", "noopener noreferrer");
el.removeAttribute("aria-disabled");
} else {
disable(el);
}
}
}

function applyYoutube() {
var v = document.querySelectorAll("[data-yt='video']");
for (var i = 0; i < v.length; i++) v[i].setAttribute("href", youtubeLinks.euVolto);

var c = document.querySelectorAll("[data-yt='canal']");
for (var j = 0; j < c.length; j++) c[j].setAttribute("href", youtubeLinks.canal);

var p = document.querySelectorAll("[data-yt='playlist']");
for (var k = 0; k < p.length; k++) {
if (youtubeLinks.playlistAutorais) p[k].setAttribute("href", youtubeLinks.playlistAutorais);
else disable(p[k]);
}
}

function setupNav() {
var toggle = document.querySelector(".nav-toggle");
var nav = document.getElementById("mobile-nav");
if (!toggle || !nav) return;

function close() {
nav.classList.remove("open");
toggle.setAttribute("aria-expanded", "false");
}

toggle.addEventListener("click", function () {
var open = nav.classList.toggle("open");
toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

var links = nav.querySelectorAll("a");
for (var i = 0; i < links.length; i++) links[i].addEventListener("click", close);

document.addEventListener("keydown", function (e) {
if (e.key === "Escape") close();
});
}

function setupScrollSpy() {
var sections = document.querySelectorAll("section[id]");
var links = document.querySelectorAll(".main-nav a, .mobile-nav a");
if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

function setActive(id) {
for (var i = 0; i < links.length; i++) {
var match = links[i].getAttribute("href") === "#" + id;
links[i].classList.toggle("active", match);
if (match) links[i].setAttribute("aria-current", "true");
else links[i].removeAttribute("aria-current");
}
}

var obs = new IntersectionObserver(function (entries) {
for (var i = 0; i < entries.length; i++) {
if (entries[i].isIntersecting) setActive(entries[i].target.id);
}
}, { rootMargin: "-45% 0px -50% 0px" });

for (var s = 0; s < sections.length; s++) obs.observe(sections[s]);
}

function setupReveal() {
var items = document.querySelectorAll(".reveal");
var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// Sem observer ou com movimento reduzido, o conteudo fica visivel do jeito que ja esta no CSS.
if (reduced || !("IntersectionObserver" in window)) return;
// So a partir daqui o CSS pode esconder para animar: se este JS falhar, nada some.
document.documentElement.classList.add("js-reveal");
var obs = new IntersectionObserver(function (entries) {
for (var j = 0; j < entries.length; j++) {
if (entries[j].isIntersecting) {
entries[j].target.classList.add("in");
obs.unobserve(entries[j].target);
}
}
}, { threshold: .12 });
for (var k = 0; k < items.length; k++) obs.observe(items[k]);
}

/* O iframe só é criado no clique: nada do YouTube carrega antes disso. */
function setupVideo() {
var frame = document.getElementById("video-frame");
if (!frame) return;
var play = frame.querySelector(".play");
if (!play) return;

play.addEventListener("click", function () {
var iframe = document.createElement("iframe");
iframe.src = "https://www.youtube-nocookie.com/embed/" + youtubeLinks.embedId + "?autoplay=1&rel=0";
iframe.title = "Eu Volto — Só Pra Agradecer — Emerson Moraes (vídeo oficial)";
iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
iframe.setAttribute("allowfullscreen", "");
play.remove();
frame.appendChild(iframe);
trackEvent("click_video_youtube");
});
}

function setupTimelines() {
var a = document.getElementById("prazo-producao");
var b = document.getElementById("prazo-envio");
if (a) a.textContent = timelines.producao;
if (b) b.textContent = timelines.envio;
}

function setupProduct() {
var card = document.querySelector(".product");
if (!card) return;

var radios = card.querySelectorAll("input[name='edicao']");
var check = document.getElementById("dedic-check");
var fields = document.getElementById("dedic-fields");
var text = document.getElementById("dedic-text");
var count = document.getElementById("char-count");
var qtyEl = document.getElementById("qty-value");
var minus = document.getElementById("qty-minus");
var plus = document.getElementById("qty-plus");
var subtotal = document.getElementById("subtotal");
var buy = document.getElementById("buy");
var qty = 1;

var priceTags = card.querySelectorAll("[data-price]");
for (var t = 0; t < priceTags.length; t++) {
var key = priceTags[t].getAttribute("data-price");
if (products[key]) priceTags[t].textContent = brl(products[key].price);
}

function current() {
for (var i = 0; i < radios.length; i++) {
if (radios[i].checked) return { key: radios[i].value, data: products[radios[i].value] };
}
return { key: "standard", data: products.standard };
}

function paintOptions() {
for (var i = 0; i < radios.length; i++) {
var row = radios[i].closest(".opt");
if (row) row.classList.toggle("selected", radios[i].checked);
}
}

function update() {
if (subtotal) subtotal.textContent = brl(current().data.price * qty);
}

for (var r = 0; r < radios.length; r++) {
radios[r].addEventListener("change", function () { paintOptions(); update(); });
}

if (check && fields) {
check.addEventListener("change", function () {
fields.classList.toggle("open", check.checked);
if (check.checked && text) text.focus();
});
}

if (text && count) {
text.addEventListener("input", function () {
if (text.value.length > MAX_DEDIC) text.value = text.value.slice(0, MAX_DEDIC);
count.textContent = text.value.length + "/" + MAX_DEDIC;
count.classList.toggle("limit", text.value.length >= MAX_DEDIC);
});
}

if (minus && plus && qtyEl) {
minus.addEventListener("click", function () { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; update(); });
plus.addEventListener("click", function () { qty = Math.min(20, qty + 1); qtyEl.textContent = qty; update(); });
}

if (buy) {
buy.addEventListener("click", function () {
var sel = current();
trackEvent("click_comprar_cd", { produto: sel.data.name, quantidade: qty });
checkout({
product: sel.data,
quantity: qty,
dedication: check && check.checked && text ? text.value.trim() : null,
total: sel.data.price * qty
});
});
}

paintOptions();
update();
}

/* Checkout: ainda não existe backend nem gateway.
   Por enquanto abre um e-mail com o pedido montado.
   Quando houver Pix / Mercado Pago / WhatsApp, troque só o corpo desta função. */
function checkout(order) {
var lines = [
"Pedido: Eu Volto — Edição Física Limitada",
"Edição: " + order.product.name,
"Quantidade: " + order.quantity,
"Dedicatória: " + (order.dedication ? order.dedication : "não"),
"Total: " + brl(order.total),
"",
"Nome:",
"Endereço completo com CEP:",
"Telefone:"
];
window.location.href =
"mailto:" + CONTACT_EMAIL +
"?subject=" + encodeURIComponent("Pedido — Eu Volto (Edição Física)") +
"&body=" + encodeURIComponent(lines.join("\n"));
}

function setupTracking() {
var map = [
["[data-track='ouca-agora']", "click_ouca_agora"],
["[data-stream='spotify']", "click_spotify"],
["[data-stream='deezer']", "click_deezer"],
["[data-stream='appleMusic']", "click_apple_music"],
["[data-stream='youtubeMusic']", "click_youtube_music"],
["[data-stream='amazonMusic']", "click_amazon_music"],
["[data-yt='playlist']", "click_playlist_autorais"],
["[data-yt='canal']", "click_canal_youtube"],
["[data-social='instagram']", "click_instagram"],
["[data-social='tiktok']", "click_tiktok"],
["[data-social='facebook']", "click_facebook"],
["[data-track='email']", "click_email"]
];
for (var i = 0; i < map.length; i++) {
(function (pair) {
var nodes = document.querySelectorAll(pair[0]);
for (var j = 0; j < nodes.length; j++) {
nodes[j].addEventListener("click", function () { trackEvent(pair[1]); });
}
})(map[i]);
}
}

})();
