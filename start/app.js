/* DataSupply funnel · datasupplyai.com.au/start
   One question per screen. Branches: owner (20+ staff → quote) or connector (→ partner).
   Leads post to GoHighLevel via an inbound-webhook URL set below; empty = skip posting. */
const CONFIG = {
  GHL_WEBHOOK: '',                                   // paste the GHL "Inbound Webhook" URL here
  COMPANY_LINK: 'https://datasupply.ai/data-partnership?ref=uobRtF82&utm_source=funnel&utm_medium=ads&utm_campaign=start',
  PARTNER_LINK: 'https://datasupply.ai/w/p/6Lw9PmLt',
  VIDEO_LINK: 'https://datasupplyai.com.au/private-invite-Ty/',
  TOTAL_STEPS: 4
};
const LOGOS = ['openai','anthropic','deepmind','meta','microsoft','amazon','nvidia','xai','mistral','perplexity','huggingface'];
const answers = { utm: location.search.slice(1) };
const history = [];
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

const opt = (val, label, sub, img) => `<button class="opt ${img?'photo':''}" data-v="${esc(val)}">${img?`<img src="img/${img}.jpg" alt="">`:''}<span class="t">${esc(label)}${sub?`<small>${esc(sub)}</small>`:''}</span><span class="arr">→</span></button>`;

const STEPS = {
  start: { n: 1, html: () => `
    <p class="kick">AI data licensing · 3 quick questions</p>
    <h1>Is your company sitting on <span class="g">$100K to $5M</span> of data?</h1>
    <p class="sub">AI labs are paying established companies for the records their work leaves behind. Let's see where you fit.</p>
    <div class="opts">
      ${opt('owner','Yes, I own a business','See if it qualifies for a data licence','cover-office')}
      ${opt('connector','No, but I know business owners','See how one introduction pays','who-handshake')}
    </div>`,
    next: v => { answers.owner = v === 'owner'; return v === 'owner' ? 'staff' : 'knows'; } },

  staff: { n: 2, html: () => `
    <p class="kick">Your company · 1 of 2</p>
    <h1>How many <span class="g">desk staff</span> are on payroll?</h1>
    <p class="sub">Office and desk-based employees, not field or hourly crews. Labs verify with a payroll export later.</p>
    <div class="opts">
      ${opt('u20','Under 20','','fit-whiteboard')}
      ${opt('20-49','20 to 49','','cover-office')}
      ${opt('50-199','50 to 199','','opp-servers')}
      ${opt('200+','200 or more','','close-agreement')}
    </div>`,
    next: v => { answers.staff = v; return v === 'u20' ? 'small' : 'years'; } },

  years: { n: 3, html: () => `
    <p class="kick">Your company · 2 of 2</p>
    <h1>How many years of <span class="g">records</span> are still in your systems?</h1>
    <p class="sub">Email, accounting, CRM, support tickets, project tools. The longer the history, the more a lab can learn from it.</p>
    <div class="opts">
      ${opt('u3','Under 3 years','')}
      ${opt('3-5','3 to 5 years','')}
      ${opt('6-10','6 to 10 years','')}
      ${opt('10+','More than 10 years','')}
    </div>`,
    next: v => { answers.years = v; return 'contact'; } },

  small: { n: 3, html: () => `
    <p class="kick">Not a fit yet, but</p>
    <h1>You can still <span class="g">earn from this.</span></h1>
    <p class="sub">Data licences start at 20 desk staff. But you know owners who are bigger than you. One introduction can pay $70,000+ when their deal closes, and you do none of the work.</p>
    <div class="opts">
      ${opt('yes','Yes, I know owners with 20+ staff','Show me how I get paid','who-handshake')}
      ${opt('no','Not right now','Just send me the 4-minute video')}
    </div>`,
    next: v => { answers.owner = false; answers.knows = v === 'yes'; return v === 'yes' ? 'contact' : 'exit'; } },

  knows: { n: 2, html: () => `
    <p class="kick">Quick one</p>
    <h1>Do you know any business owners with <span class="g">20+ staff?</span></h1>
    <p class="sub">Accountants, consultants, brokers, realtors, sales pros: if owners take your call, you're already halfway there.</p>
    <div class="opts">
      ${opt('yes','Yes, I know a few','Show me how one introduction pays','who-handshake')}
      ${opt('no','Not really','I’m just curious')}
    </div>`,
    next: v => { answers.knows = v === 'yes'; return v === 'yes' ? 'hook' : 'exit'; } },

  hook: { n: 3, html: () => `
    <p class="kick">The partner model</p>
    <div class="big">$70,000+</div>
    <h1>from <span class="g">one introduction.</span></h1>
    <p class="sub">You open the door. DataSupply's engineers do the manifest, the security review and the negotiation. You're paid from both fees when it closes. Free to join, no quota, no selling.</p>
    <div class="stat"><div><b>85%</b><span>of the origination fee to you</span></div><div><b>35%</b><span>of the seller fee to you</span></div><div><b>$0</b><span>to join, nothing to sell</span></div></div>
    <div class="opts">${opt('go','Show me how to join','Takes 30 seconds','close-agreement')}</div>`,
    next: () => 'contact' },

  contact: { n: 4, html: () => answers.owner ? `
    <p class="kick">Last step</p>
    <h1>Your company <span class="g">could qualify.</span></h1>
    <p class="sub">Tell us where to send your indicative range, then finish the 60-second quote on DataSupply's secure page. No files, no dataset.</p>
    ${formHtml('Get my indicative range')}` : `
    <p class="kick">Last step</p>
    <h1>Lock in your <span class="g">partner seat.</span></h1>
    <div class="proof"><img src="headshot.jpg" alt="Ty Yturralde"><p><b>Ty Yturralde</b>, Head of Partnerships APAC. You'll join under me, and I'll walk you through your first introduction.</p></div>
    ${formHtml('Join the team now')}` },

  done: { n: 4, html: () => answers.owner ? `
    <p class="kick">You're in · one more step</p>
    <h1>Finish your quote on <span class="g">DataSupply's page.</span></h1>
    <p class="sub">We've saved your details. The quote itself takes 60 seconds on DataSupply's secure form, and your introduction is credited to Ty.</p>
    <a class="cta" href="${CONFIG.COMPANY_LINK}" id="finalLink">Get my quote now →</a>
    <a class="ghost" href="${CONFIG.VIDEO_LINK}">Watch the 4-minute explainer first</a>` : `
    <p class="kick">You're in · one more step</p>
    <h1>Claim your seat <span class="g">under Ty.</span></h1>
    <p class="sub">Sign-up is free and takes a minute. Your own referral link is ready the moment you're in, and Ty will reach out to get you started.</p>
    <a class="cta" href="${CONFIG.PARTNER_LINK}" id="finalLink">Join the team now →</a>
    <a class="ghost" href="${CONFIG.VIDEO_LINK}">See the full presentation first</a>` },

  exit: { n: 4, html: () => `
    <p class="kick">No problem</p>
    <h1>Watch the <span class="g">4-minute video</span> anyway.</h1>
    <p class="sub">Most people know a bigger owner than they think: a client, a supplier, a mate who runs an office. When one comes to mind, this is where to send them.</p>
    <a class="cta" href="${CONFIG.VIDEO_LINK}">Watch the presentation →</a>
    <a class="ghost" href="${CONFIG.PARTNER_LINK}">Or join as a partner now</a>` }
};

function formHtml(btn){ return `
  <form id="f" novalidate>
    <div class="field"><label for="name">Full name</label><input id="name" name="name" autocomplete="name" placeholder="First and last name" required></div>
    <div class="field"><label for="phone">Mobile</label><input id="phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="+61 4..." required></div>
    <div class="field"><label for="email">Email</label><input id="email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@company.com" required></div>
    ${answers.owner ? `<div class="field"><label for="company">Company</label><input id="company" name="company" autocomplete="organization" placeholder="Your company" required></div>` : ''}
    <label class="consent"><input type="checkbox" id="consent" required> I agree to be contacted by Ty Yturralde (DataSupply Strategic Partner) about this request by call, text or email.</label>
    <p class="err" id="err"></p>
    <button class="cta" type="submit" id="submit">${btn} →</button>
  </form>`; }

function render(id, push=true){
  if (push && current) history.push(current);
  current = id;
  const st = STEPS[id];
  $('#main').innerHTML = `<div class="step on">${st.html()}</div>`;
  $('#bar').style.width = (st.n / CONFIG.TOTAL_STEPS * 100) + '%';
  $('#back').classList.toggle('show', history.length > 0 && id !== 'done');
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  $('#main').querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => render(st.next(b.dataset.v))));
  const f = $('#f'); if (f) f.addEventListener('submit', onSubmit);
  const first = $('#main input'); if (first && matchMedia('(min-width:720px)').matches) first.focus();
}
let current = null;

async function onSubmit(ev){
  ev.preventDefault();
  const f = ev.target, err = $('#err');
  let ok = true;
  f.querySelectorAll('input[required]').forEach(i => { const bad = i.type==='checkbox' ? !i.checked : (!i.value.trim() || (i.type==='email' && !/^\S+@\S+\.\S+$/.test(i.value)) || (i.type==='tel' && i.value.replace(/\D/g,'').length < 8)); i.classList.toggle('bad', bad); if (bad) ok = false; });
  if (!ok) { err.textContent = 'Please check the highlighted fields.'; return; }
  err.textContent = '';
  const btn = $('#submit'); btn.disabled = true; btn.textContent = 'Saving…';
  const lead = { ...answers, path: answers.owner ? 'owner' : 'partner', name: f.name.value.trim(), phone: f.phone.value.trim(), email: f.email.value.trim(), company: f.company ? f.company.value.trim() : '', source: 'datasupplyai.com.au/start', submitted_at: new Date().toISOString(), referral_code: 'uobRtF82' };
  try { if (CONFIG.GHL_WEBHOOK) await fetch(CONFIG.GHL_WEBHOOK, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify(lead) }); } catch(e) {}
  try { if (typeof fbq === 'function') fbq('track', 'Lead', { content_name: lead.path }); } catch(e) {}
  try { localStorage.setItem('ds_lead', JSON.stringify(lead)); } catch(e) {}
  render('done');
}

$('#back').addEventListener('click', () => { if (history.length) { const prev = history.pop(); render(prev, false); } });
$('#track').innerHTML = ['',''].map((_,i) => `<ul ${i?'aria-hidden="true"':''}>${LOGOS.map(l => `<li class="${/xai|mistral/.test(l)?'sq':''}"><img src="logos/${l}.svg" alt="${l}" loading="lazy"></li>`).join('')}</ul>`).join('');
render('start', false);
