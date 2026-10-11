#!/usr/bin/env node
// Holt einen oder mehrere Affiliate-Produkt-Feeds (CSV, auch .gz) und schreibt offers.json für die App.
// Aufruf:  FEED_URLS="https://…feed1…" node scripts/import-feed.mjs
// Mehrere Feeds: URLs durch Zeilenumbruch oder Leerzeichen trennen.
// Ohne Internet testen:  node scripts/import-feed.mjs pfad/zum/feed.csv
// Keine Abhängigkeiten, läuft mit Node 18 oder neuer.

import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(join(ROOT, "scripts", "feed-config.json"), "utf8"));

// ---------- Reiseziele: Reisezeit ab Zürich (Flug, ca.), Flughafen, Bildstil ----------
const DEST = {
  "Spanien": [2.25, "PMI", "beach"], "Griechenland": [2.75, "ATH", "island"], "Italien": [1.5, "FCO", "city"], "Portugal": [2.75, "LIS", "beach"],
  "Frankreich": [1.25, "NCE", "beach"], "Kroatien": [1.5, "SPU", "beach"], "Zypern": [3.75, "LCA", "island"], "Malta": [2.25, "MLA", "island"],
  "Montenegro": [1.75, "TIV", "beach"], "Albanien": [2, "TIA", "beach"], "Türkei": [3.25, "AYT", "beach"], "Ägypten": [4.5, "HRG", "desert"],
  "Tunesien": [2.5, "DJE", "desert"], "Marokko": [3.25, "RAK", "desert"], "Island": [3.75, "KEF", "volcano"], "Norwegen": [2.5, "OSL", "volcano"],
  "Schweden": [2.25, "ARN", "city"], "Dänemark": [1.75, "CPH", "city"], "Finnland": [3, "HEL", "volcano"], "England": [1.75, "LHR", "city"],
  "Irland": [2.25, "DUB", "city"], "Schottland": [2.25, "EDI", "volcano"], "Niederlande": [1.5, "AMS", "city"], "Deutschland": [1.25, "BER", "city"],
  "Österreich": [1, "VIE", "city"], "Tschechien": [1.25, "PRG", "city"], "Ungarn": [1.5, "BUD", "city"], "Polen": [1.75, "KRK", "city"],
  "Schweiz": [0, "ZRH", "city"], "Kap Verde": [6, "SID", "beach"], "Vereinigte Arabische Emirate": [6.25, "DXB", "desert"], "Oman": [6.75, "MCT", "desert"],
  "Jordanien": [4.25, "AQJ", "desert"], "Malediven": [10.5, "MLE", "lagoon"], "Mauritius": [12, "MRU", "lagoon"], "Seychellen": [10.5, "SEZ", "lagoon"],
  "Thailand": [11.5, "BKK", "lagoon"], "Vietnam": [13, "SGN", "lagoon"], "Indonesien": [16, "DPS", "lagoon"], "Sri Lanka": [11, "CMB", "lagoon"],
  "Japan": [14, "NRT", "city"], "Singapur": [12.5, "SIN", "city"], "USA": [9.5, "JFK", "city"], "Kanada": [9, "YUL", "volcano"],
  "Mexiko": [12, "CUN", "beach"], "Dominikanische Republik": [10, "PUJ", "beach"], "Kuba": [11, "VRA", "beach"], "Costa Rica": [13, "SJO", "lagoon"],
  "Südafrika": [11.5, "CPT", "desert"], "Kenia": [9, "MBA", "desert"], "Tansania": [10, "ZNZ", "lagoon"], "Australien": [22, "SYD", "beach"],
};
// Bekannte Orte, damit das Land auch erkannt wird, wenn nur die Insel oder Stadt im Feed steht
const PLACES = {
  "Mallorca": "Spanien", "Ibiza": "Spanien", "Menorca": "Spanien", "Teneriffa": "Spanien", "Gran Canaria": "Spanien", "Fuerteventura": "Spanien", "Lanzarote": "Spanien",
  "Barcelona": "Spanien", "Andalusien": "Spanien", "Costa Brava": "Spanien", "Kreta": "Griechenland", "Rhodos": "Griechenland", "Kos": "Griechenland", "Korfu": "Griechenland",
  "Santorini": "Griechenland", "Mykonos": "Griechenland", "Zakynthos": "Griechenland", "Chalkidiki": "Griechenland", "Sardinien": "Italien", "Sizilien": "Italien",
  "Apulien": "Italien", "Kalabrien": "Italien", "Toskana": "Italien", "Rom": "Italien", "Venedig": "Italien", "Algarve": "Portugal", "Madeira": "Portugal", "Lissabon": "Portugal",
  "Korsika": "Frankreich", "Paris": "Frankreich", "Côte d'Azur": "Frankreich", "Antalya": "Türkei", "Side": "Türkei", "Bodrum": "Türkei", "Hurghada": "Ägypten",
  "Marsa Alam": "Ägypten", "Sharm el Sheikh": "Ägypten", "Djerba": "Tunesien", "Hammamet": "Tunesien", "Marrakesch": "Marokko", "Agadir": "Marokko", "Dubai": "Vereinigte Arabische Emirate",
  "Abu Dhabi": "Vereinigte Arabische Emirate", "Phuket": "Thailand", "Koh Samui": "Thailand", "Krabi": "Thailand", "Bali": "Indonesien", "New York": "USA", "Florida": "USA",
  "Punta Cana": "Dominikanische Republik", "Cancún": "Mexiko", "Riviera Maya": "Mexiko", "London": "England", "Wien": "Österreich", "Prag": "Tschechien", "Amsterdam": "Niederlande",
};
const EN = { Spain: "Spanien", Greece: "Griechenland", Italy: "Italien", France: "Frankreich", Croatia: "Kroatien", Cyprus: "Zypern", Turkey: "Türkei", Egypt: "Ägypten",
  Tunisia: "Tunesien", Morocco: "Marokko", Iceland: "Island", Norway: "Norwegen", "United Arab Emirates": "Vereinigte Arabische Emirate", Maldives: "Malediven", Thailand: "Thailand",
  "United States": "USA", Mexico: "Mexiko", "Dominican Republic": "Dominikanische Republik", Portugal: "Portugal", Austria: "Österreich", Germany: "Deutschland" };

// ---------- CSV ----------
function parseCSV(text, delim) {
  if (!delim) { const head = text.slice(0, text.indexOf("\n")); delim = [",", ";", "\t", "|"].sort((a, b) => head.split(b).length - head.split(a).length)[0]; }
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter(r => r.some(x => x.trim()));
  return body.map(r => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? "").trim()])));
}

async function load(src) {
  let buf;
  if (/^https?:/i.test(src)) { const res = await fetch(src); if (!res.ok) throw new Error(`Feed ${res.status}: ${src.replace(/apikey\/[^/]+/i, "apikey/***")}`); buf = Buffer.from(await res.arrayBuffer()); }
  else buf = await readFile(src);
  if (buf[0] === 0x1f && buf[1] === 0x8b) buf = gunzipSync(buf);
  return parseCSV(buf.toString("utf8").replace(/^﻿/, ""), config.delimiter);
}

// ---------- Umwandeln ----------
const pick = (row, keys) => { for (const k of [].concat(keys)) if (row[k]) return row[k]; return ""; };
const num = v => { const m = String(v).replace(/[’'\s]/g, "").replace(",", ".").match(/\d+(\.\d+)?/); return m ? +m[0] : 0; };
const strip = t => String(t).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

function findCountry(text) {
  for (const c of Object.keys(DEST)) if (new RegExp(`\\b${c}\\b`, "i").test(text)) return c;
  for (const [p, c] of Object.entries(PLACES)) if (text.toLowerCase().includes(p.toLowerCase())) return c;
  for (const [e, c] of Object.entries(EN)) if (new RegExp(`\\b${e}\\b`, "i").test(text)) return c;
  return "";
}
function findPlace(text, country) {
  for (const p of Object.keys(PLACES)) if (PLACES[p] === country && text.toLowerCase().includes(p.toLowerCase())) return p;
  return country;
}
function board(text) {
  if (/ultra.?all|all.?inclusive|alles inklusive/i.test(text)) return "All Inclusive";
  if (/vollpension|full board/i.test(text)) return "Vollpension";
  if (/halbpension|half board/i.test(text)) return "Halbpension";
  if (/frühstück|breakfast|b&b/i.test(text)) return "Frühstück";
  if (/ohne verpflegung|room only|selbstverpflegung/i.test(text)) return "Ohne Verpflegung";
  return "";
}
function types(text, b, nights) {
  const t = new Set();
  if (/kreuzfahrt|cruise/i.test(text)) t.add("Kreuzfahrt");
  if (/rundreise|round.?trip|tour\b/i.test(text)) t.add("Rundreise");
  if (/städtereise|city ?trip|city ?break/i.test(text)) t.add("Städtereise");
  if (/wellness|spa\b/i.test(text)) t.add("Wellness");
  if (/last.?minute/i.test(text)) t.add("Last Minute");
  if (/nur hotel|hotel only|ohne flug/i.test(text)) t.add("Nur Hotel");
  if (b === "All Inclusive") t.add("All Inclusive");
  if (!t.has("Nur Hotel") && !t.has("Kreuzfahrt") && !t.has("Rundreise") && !t.has("Städtereise")) t.add("Pauschalreise");
  return [...t];
}
const isoDate = v => { if (!v) return null; const d = new Date(v); return isNaN(d) ? null : d.toISOString().slice(0, 10); };

function convert(row, i) {
  const m = config.columns;
  const name = strip(pick(row, m.hotel)), desc = strip(pick(row, m.text)), cat = strip(pick(row, m.category));
  const all = [name, cat, pick(row, m.country), pick(row, m.place), desc].join(" ");
  const url = pick(row, m.url), price = num(pick(row, m.price));
  if (!url || !price) return null;
  const country = EN[pick(row, m.country)] || pick(row, m.country) || findCountry(all);
  if (!country) return null; // ohne erkennbares Ziel lässt sich die Reisezeit nicht filtern
  const [hours, iata, scene] = DEST[country] || [config.defaultHours, "", "beach"];
  const nights = num(pick(row, m.nights)) || num((all.match(/(\d{1,2})\s*(nächte|nights|n\.)/i) || [])[1]) || Math.max(0, num((all.match(/(\d{1,2})\s*(tage|days)/i) || [])[1]) - 1) || 7;
  const b = board(pick(row, m.board) + " " + all) || "laut Anbieter";
  const stars = num(pick(row, m.stars)) || num((name.match(/(\d)\s*(\*|sterne|stars)/i) || [])[1]);
  const images = [].concat(m.images).map(k => row[k]).filter(v => /^https?:\/\//.test(v || "")).filter((v, j, a) => a.indexOf(v) === j);
  const was = num(pick(row, m.was));
  return {
    id: "f-" + (pick(row, m.id) || i).toString().replace(/[^\w-]/g, "").slice(0, 40),
    place: strip(pick(row, m.place)) || findPlace(all, country), country, iata, mode: "Flug", hours,
    hotel: name.replace(/\s*[-–|]\s*\d+\s*(nächte|nights).*/i, "").replace(/\s*\d\s*(\*+|sterne|stars)/i, "").trim().slice(0, 80), stars: Math.min(5, stars),
    board: b, types: types(all, b, nights), nights, price: Math.round(price), was: was > price ? Math.round(was) : 0,
    child: null, kids: !/adults only|nur für erwachsene|ab 16|ab 18/i.test(all),
    from: isoDate(pick(row, m.from)), until: isoDate(pick(row, m.until)), dep: null,
    agency: "", agencyName: strip(pick(row, m.agency)) || config.defaultAgency, url, scene, images,
    text: desc.slice(0, 420),
  };
}

// ---------- Ablauf ----------
const sources = (process.argv.slice(2).length ? process.argv.slice(2) : (process.env.FEED_URLS || "").split(/\s+/)).filter(Boolean);
if (!sources.length) { console.error("Keine Feed-Quelle. FEED_URLS setzen oder Datei als Argument angeben."); process.exit(1); }

const offers = [];
for (const src of sources) {
  const rows = await load(src);
  let n = 0;
  rows.forEach((row, i) => { const o = convert(row, offers.length + i); if (o && (!config.currency || !row[config.columns.currency] || row[config.columns.currency] === config.currency)) { offers.push(o); n++; } });
  console.log(`${rows.length} Zeilen gelesen, ${n} Angebote übernommen`);
}
const seen = new Set();
const unique = offers.filter(o => !seen.has(o.id) && seen.add(o.id))
  .filter(o => o.price >= config.minPrice && (!o.until || o.until >= new Date().toISOString().slice(0, 10)))
  .sort((a, b) => (b.was ? (b.was - b.price) / b.was : 0) - (a.was ? (a.was - a.price) / a.was : 0))
  .slice(0, config.maxOffers);
if (!unique.length) { console.error("Keine verwertbaren Angebote gefunden, offers.json bleibt unverändert."); process.exit(1); }
await writeFile(join(ROOT, "offers.json"), JSON.stringify({ updated: new Date().toISOString(), offers: unique }, null, 1));
console.log(`offers.json geschrieben: ${unique.length} Angebote`);
