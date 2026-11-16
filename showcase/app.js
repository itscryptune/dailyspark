const sizes = { full:[800,480], horizontal:[800,240], vertical:[400,480], quadrant:[400,240] };
const quotes = [
 { text:'The weak can never forgive. Forgiveness is the attribute of the strong.', author:'Mahatma Gandhi', source:'example' },
 { text:'The hardest part of a project is write the readme.md', author:'itscryptune', source:'custom' },
 { text:'My journey. My rules. My time... still tracked by Hackatime', author:'itscryptune', source:'custom' }
];
let layout = 'full', index = 0, edited = null;
const screen = document.getElementById('screen');
const frame = document.getElementById('display-frame');
const editor = document.getElementById('quote-form');
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const current = () => edited || quotes[index];
function dateInfo() {
 const now = new Date(), hour = now.getHours();
 return {
  weekday:new Intl.DateTimeFormat('en',{weekday:'long'}).format(now),
  day:String(now.getDate()), month:new Intl.DateTimeFormat('en',{month:'long'}).format(now),
  year:now.getFullYear(), time:`${String(hour % 12 || 12).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
  period:hour < 12 ? 'AM' : 'PM'
 };
}
function short(text, max) {
 if (text.length <= max) return text;
 const part = text.slice(0,max + 1), breakAt = part.lastIndexOf(' ');
 return (breakAt > 20 ? part.slice(0,breakAt) : text.slice(0,max)).replace(/[ ,;:.!?-]+$/,'') + '…';
}
function quoteInfo(max) {
 const item = current(), text = short(item.text,max);
 const size = text.length > 190 ? 'tiny' : text.length > 130 ? 'small' : text.length > 75 ? 'medium' : '';
 const source = item.source === 'zenquotes' ? 'zenquotes.io' : item.source === 'custom' || item.source === 'edited' ? 'PERSONAL QUOTE' : 'DAILY SPARK';
 return { text:escapeHtml(text), author:escapeHtml(item.author), source, size,
  heading:item.source === 'custom' || item.source === 'edited' ? 'FROM MY COLLECTION' : 'QUOTE OF THE DAY' };
}
function markup() {
 const d = dateInfo(), day = d.weekday.toUpperCase(), month = d.month.toUpperCase();
 const q = quoteInfo(({full:245,horizontal:125,vertical:160,quadrant:90})[layout]);
 if (layout === 'full') return `<div class="left"><div class="brand">✦ DAILY SPARK</div><div><div class="weekday">${day}</div><div class="date-line"><strong class="day">${d.day}</strong><div class="month-year"><span>${month}</span><span>${d.year}</span></div></div><div class="clock">${d.time}</div><div class="period">${d.period} · LOCAL TIME</div></div><div class="left-footer">MAKE TODAY COUNT.</div></div><div class="right"><div class="right-head"><strong>${q.heading}</strong><span>✦</span></div><div class="quote-area"><div class="quote-mark">“</div><div class="quote serif ${q.size}">${q.text}</div><div class="author">— ${q.author}</div></div><div class="right-foot"><span>ONE DAY. ONE THOUGHT.</span><span class="credit">${q.source}</span></div></div>`;
 if (layout === 'horizontal') return `<div class="top"><strong>✦ DAILY SPARK</strong><span>${q.heading}</span></div><div class="body"><div class="date-col"><span class="weekday">${day}</span><strong class="day">${d.day}</strong><span class="month">${month}</span><strong class="clock">${d.time} ${d.period}</strong></div><div class="quote-col"><div class="quote serif ${q.size}">“${q.text}”</div><div class="author">— ${q.author}</div></div></div><div class="bottom"><span>ONE DAY. ONE THOUGHT.</span><span class="credit">${q.source}</span></div>`;
 if (layout === 'vertical') return `<div class="top"><strong>✦ DAILY SPARK</strong></div><div class="main"><strong class="clock">${d.time}</strong><div class="date">${d.period} · ${d.weekday}, ${d.day} ${d.month}</div><div class="rule"></div><div class="quote serif ${q.size}">“${q.text}”</div><div class="author">— ${q.author}</div></div><div class="bottom"><span class="credit">${q.source}</span></div>`;
 return `<div class="top"><strong>✦ DAILY SPARK</strong></div><div class="date">${day} · ${d.time} ${d.period}</div><div class="quote serif ${q.size}">“${q.text}”</div><div class="author">— ${q.author}</div><div class="bottom"><span class="credit">${q.source}</span></div>`;
}
function fit() {
 const [w,h] = sizes[layout], available = document.querySelector('.preview-area').clientWidth - 4;
 const scale = Math.min(1.125,available / w);
 frame.style.width = `${Math.round(w * scale) + 4}px`;
 frame.style.height = `${Math.round(h * scale) + 4}px`;
 screen.style.transform = `scale(${scale})`;
}
function render() {
 screen.className = `ds-screen ${layout === 'full' ? 'full' : 'compact ' + layout}`;
 screen.innerHTML = markup();
 const item = current(), source = item.source === 'zenquotes' ? "Today's ZenQuotes quote" : item.source === 'custom' ? 'A quote from the DailySpark repository' : item.source === 'edited' ? 'Your edited quote' : 'An example quote';
 document.getElementById('status').textContent = `${source}. This is preview of your TRMNL device screen.`;
 requestAnimationFrame(fit);
}
function toggleEditor(open) {
 editor.hidden = !open;
 document.getElementById('edit-toggle').setAttribute('aria-expanded',String(open));
 if (open) {
  const q = current();
  document.getElementById('custom-text').value = q.text;
  document.getElementById('custom-author').value = q.author;
  document.getElementById('custom-text').focus();
 }
}
document.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click',() => {
 layout = button.dataset.layout;
 document.querySelectorAll('[data-layout]').forEach(tab => { tab.classList.toggle('active',tab === button); tab.setAttribute('aria-pressed',String(tab === button)); });
 render();
}));
document.getElementById('refresh').addEventListener('click',() => { edited = null; index = (index + 1) % quotes.length; toggleEditor(false); render(); });
document.getElementById('edit-toggle').addEventListener('click',() => toggleEditor(editor.hidden));
document.getElementById('cancel-edit').addEventListener('click',() => toggleEditor(false));
editor.addEventListener('submit',event => {
 event.preventDefault();
 const text = document.getElementById('custom-text').value.trim(), author = document.getElementById('custom-author').value.trim();
 if (!text || !author) return;
 edited = {text,author,source:'edited'};
 toggleEditor(false);
 render();
});
window.addEventListener('resize',fit);
setInterval(render,30000);
render();
fetch('./api/quote').then(response => { if (!response.ok) throw Error('Unavailable'); return response.json(); }).then(data => {
 if (typeof data.text !== 'string' || !data.text.trim()) return;
 quotes[0] = {text:data.text.slice(0,450),author:String(data.author || 'Unknown').slice(0,100),source:'zenquotes'};
 if (!edited && index === 0) render();
}).catch(() => {});