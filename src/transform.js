const DEFAULT_AUTHOR = "itscryptune";
const CUSTOM_QUOTES = [
 { text: "The hardest part of a project is write the readme.md", author: "itscryptune" },
 { text: "My journey. My rules. My time... still tracked by Hackatime", author: "itscryptune" }
];
function fromCustom() {
 const item = CUSTOM_QUOTES.find(q => q && typeof q.text === "string" && q.text.trim());
 if (!item) return null;
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