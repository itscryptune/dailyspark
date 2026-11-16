const QUOTE_MODE = "mixed"; // available modes: "zen", "custom", "mixed"
const CUSTOM_QUOTE_PERCENT = 70;
const DEFAULT_AUTHOR = "itscryptune";
const CUSTOM_QUOTES = [
 { text:"The hardest part of a project is writing the README.", author:"itscryptune" },
 { text:"My journey. My rules. My time... still tracked by Hackatime.", author:"itscryptune" }
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
 return { quote_text:item.q.trim(), quote_author:typeof item.a === "string" && item.a.trim() ? item.a.trim() : "Unknown Author", quote_source:"zenquotes" };
}
function excerpt(text, limit) {
 if (text.length <= limit) return text;
 const words = text.trim().split(/\s+/), kept = [];
 for (const word of words) {
  if ((kept.join(" ") + (kept.length ? " " : "") + word + "…").length > limit) break;
  kept.push(word);
 }
 return kept.length ? kept.join(" ").replace(/[,.!:;]+$/, "") + "…" : text.slice(0, limit - 1) + "…";
}
function run(input) {
 const seed = daySeed(input), custom = fromCustom(input), zen = fromZen(input);
 let quote;
 if (QUOTE_MODE === "custom") quote = custom || zen;
 else if (QUOTE_MODE === "zen") quote = zen || custom;
 else quote = seed % 100 < CUSTOM_QUOTE_PERCENT ? custom || zen : zen || custom;
 quote ||= { quote_text:"A small step forward still counts.", quote_author:"Daily Spark", quote_source:"fallback" };
 return { ...quote, quote_horizontal:excerpt(quote.quote_text, 125), quote_vertical:excerpt(quote.quote_text, 150), quote_quadrant:excerpt(quote.quote_text, 90) };
}
