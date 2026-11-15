const QUOTE_MODE = "mixed"; // available modes: "zen", "custom", "mixed"
const CUSTOM_QUOTE_PERCENT = 70;

const DEFAULT_AUTHOR = "itscryptune";
const CUSTOM_QUOTES = [
 { text: "The hardest part of a project is write the readme.md", author: "itscryptune" },
 { text: "My journey. My rules. My time... still tracked by Hackatime", author: "itscryptune" }
];

function daySeed(input) {
 const zone = input?.trmnl?.user?.time_zone_iana || "Asia/Kolkata";
 let parts;
 try {
  parts = new Intl.DateTimeFormat("en-US", { timeZone:zone, year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date());
 } catch {
  parts = new Intl.DateTimeFormat("en-US", { timeZone:"Asia/Kolkata", year:"numeric", month:"2-digit", day:"2-digit" }).formatToParts(new Date());
 }
 const value = type => parts.find(part => part.type === type)?.value || "01";
 const date = Number(value("year") + value("month") + value("day"));
 return Math.imul(date ^ (date >>> 11), 1597334677) >>> 0;
}
function fromCustom(input) {
 const valid = CUSTOM_QUOTES.filter(q => q && typeof q.text === "string" && q.text.trim());
 if (!valid.length) return null;
 const item = valid[daySeed(input) % valid.length];
 return { quote_text:item.text.trim(), quote_author:item.author?.trim() || DEFAULT_AUTHOR, quote_source:"custom" };
}
function fromZen(input) {
 let data = input?.data;
 if (data && !Array.isArray(data)) data = data.data;
 const item = Array.isArray(data) ? data[0] : null;
 if (!item || typeof item.q !== "string" || !item.q.trim()) return null;
 return {
  quote_text: item.q.trim(),
  quote_author: typeof item.a === "string" && item.a.trim() ? item.a.trim() : "Unknown Author",
  quote_source: "zenquotes"
 };
}
function run(input) {
 return fromZen(input) || fromCustom() || {
  quote_text: "A small step forward still counts.",
  quote_author: "Daily Spark", quote_source: "fallback"
 };
} 