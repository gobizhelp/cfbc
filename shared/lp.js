/* CFBC Landing Pages — shared JS
   Tweaks panel, Copy Lab, Calendar, Countdown, Nav.
   Each page initializes with CFBC_PAGE_CONFIG = { ... } before loading this script.
*/
(function(){
  const CFG = window.CFBC_PAGE_CONFIG || {};
  const $ = (s, p=document) => p.querySelector(s);
  const $$ = (s, p=document) => Array.from(p.querySelectorAll(s));

  /* ============================================================
     TWEAKS — wire up panel, apply state live, persist via parent
  ============================================================ */
  let TWEAKS = Object.assign({
    headline: 0,
    hero_treatment: 'photo',   // 'photo' | 'video' | 'lockup'
    iron_ales_banner: true,
    cta_copy: 'book_intro',    // 'book_intro' | 'start_class' | 'claim_trial'
    price_display: 'monthly',  // 'monthly' | 'daily' | 'weekly'
    risk_reversal: 'free_trial'// 'free_trial' | '7day_guarantee'
  }, CFG.tweakDefaults || {});

  const CTA_COPY = {
    book_intro: 'Book Your Free Intro',
    start_class: 'Start Your First Class',
    claim_trial: 'Claim 7-Day Free Trial'
  };
  const RISK = {
    free_trial: 'Free 1-on-1 Intro · No Obligation',
    '7day_guarantee': '7-Day Money-Back Guarantee'
  };

  function applyTweaks(){
    // Headlines
    if (CFG.headlines) {
      const idx = Math.min(TWEAKS.headline, CFG.headlines.length-1);
      const h = CFG.headlines[idx];
      const el = $('.hero h1');
      if (el && h) el.innerHTML = h.html;
      const subEl = $('.hero p.sub');
      if (subEl && h && h.sub) subEl.innerHTML = h.sub;
    }
    // Hero treatment
    document.body.dataset.heroTreatment = TWEAKS.hero_treatment;
    // Iron & Ales banner
    const strip = $('.promo-strip');
    if (strip) strip.style.display = TWEAKS.iron_ales_banner ? '' : 'none';
    // CTA copy on primary CTAs
    $$('.btn-primary[data-cta-slot]').forEach(b => {
      b.childNodes[0] && (b.innerHTML = CTA_COPY[TWEAKS.cta_copy]);
    });
    // Price display
    const priceEl = $('[data-price-display]');
    if (priceEl){
      const map = {
        monthly: { big:'140', unit:'/mo', note:'Billed monthly · Cancel anytime' },
        daily:   { big:'4.66', unit:'/day', note:'Less than a latte. $140 billed monthly.' },
        weekly:  { big:'32', unit:'/wk', note:'Average weekly · $140 billed monthly.' }
      };
      const p = map[TWEAKS.price_display];
      priceEl.querySelector('[data-price-num]').textContent = p.big;
      priceEl.querySelector('[data-price-unit]').textContent = p.unit;
      const note = priceEl.querySelector('[data-price-note]');
      if (note) note.textContent = p.note;
    }
    // Risk reversal
    $$('[data-risk]').forEach(el => { el.innerHTML = '<span>✓</span> ' + RISK[TWEAKS.risk_reversal]; });

    // Update chip / select UI state
    $$('.tweak-chip[data-key]').forEach(chip => {
      const k = chip.dataset.key, v = chip.dataset.val;
      const cur = TWEAKS[k];
      if (chip.dataset.type === 'bool') {
        chip.classList.toggle('on', cur === (v === 'true'));
      } else {
        chip.classList.toggle('on', String(cur) === v);
      }
    });
    $$('select[data-key]').forEach(sel => { sel.value = String(TWEAKS[sel.dataset.key]); });
  }

  function setTweak(k, v){
    TWEAKS[k] = v;
    applyTweaks();
    try {
      window.parent && window.parent.postMessage({ type:'__edit_mode_set_keys', edits:{ [k]: v } }, '*');
    } catch(e){}
  }

  /* ============================================================
     TWEAKS PANEL build
  ============================================================ */
  function buildTweaksPanel(){
    if (!CFG.headlines) return;
    const fab = document.createElement('button');
    fab.className = 'tweaks-fab'; fab.textContent = '⚙ Tweaks';
    const panel = document.createElement('aside');
    panel.className = 'tweaks-panel';
    panel.innerHTML = `
      <div class="tweaks-head">
        <h5>Tweaks</h5>
        <button aria-label="close">✕</button>
      </div>
      <div class="tweaks-body">
        <div class="tweak-group">
          <h6>Headline Variation</h6>
          <div class="tweak-row">
            <select data-key="headline">
              ${CFG.headlines.map((h,i) => `<option value="${i}">${i+1}. ${h.label}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="tweak-group">
          <h6>Hero Treatment</h6>
          <div class="tweak-toggles">
            <button class="tweak-chip" data-key="hero_treatment" data-val="photo">Photo</button>
            <button class="tweak-chip" data-key="hero_treatment" data-val="video">Video</button>
            <button class="tweak-chip" data-key="hero_treatment" data-val="lockup">Lockup</button>
          </div>
        </div>
        <div class="tweak-group">
          <h6>Iron &amp; Ales Banner</h6>
          <div class="tweak-toggles">
            <button class="tweak-chip" data-key="iron_ales_banner" data-type="bool" data-val="true">Show</button>
            <button class="tweak-chip" data-key="iron_ales_banner" data-type="bool" data-val="false">Hide</button>
          </div>
        </div>
        <div class="tweak-group">
          <h6>Primary CTA Copy</h6>
          <div class="tweak-toggles">
            <button class="tweak-chip" data-key="cta_copy" data-val="book_intro">Book Intro</button>
            <button class="tweak-chip" data-key="cta_copy" data-val="start_class">Start 1st Class</button>
            <button class="tweak-chip" data-key="cta_copy" data-val="claim_trial">Claim Trial</button>
          </div>
        </div>
        <div class="tweak-group">
          <h6>Price Display</h6>
          <div class="tweak-toggles">
            <button class="tweak-chip" data-key="price_display" data-val="monthly">$140/mo</button>
            <button class="tweak-chip" data-key="price_display" data-val="daily">$4.66/day</button>
            <button class="tweak-chip" data-key="price_display" data-val="weekly">$32/wk</button>
          </div>
        </div>
        <div class="tweak-group">
          <h6>Risk Reversal</h6>
          <div class="tweak-toggles">
            <button class="tweak-chip" data-key="risk_reversal" data-val="free_trial">Free Intro</button>
            <button class="tweak-chip" data-key="risk_reversal" data-val="7day_guarantee">7-Day Guarantee</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(fab);
    document.body.appendChild(panel);
    fab.addEventListener('click', () => panel.classList.add('open'));
    panel.querySelector('.tweaks-head button').addEventListener('click', () => panel.classList.remove('open'));
    panel.addEventListener('click', e => {
      const chip = e.target.closest('.tweak-chip');
      if (chip) {
        const k = chip.dataset.key;
        let v = chip.dataset.val;
        if (chip.dataset.type === 'bool') v = (v === 'true');
        setTweak(k, v);
      }
    });
    panel.addEventListener('change', e => {
      const sel = e.target.closest('select[data-key]');
      if (sel) setTweak(sel.dataset.key, sel.dataset.key==='headline' ? parseInt(sel.value,10) : sel.value);
    });
    // tweaks-available protocol
    window.addEventListener('message', (ev) => {
      if (!ev.data) return;
      if (ev.data.type === '__activate_edit_mode') { fab.style.display='inline-flex'; }
      if (ev.data.type === '__deactivate_edit_mode') { fab.style.display='none'; panel.classList.remove('open'); }
    });
    try { window.parent.postMessage({ type:'__edit_mode_available' }, '*'); } catch(e){}
  }

  /* ============================================================
     COPY LAB
  ============================================================ */
  function buildCopyLab(){
    if (!CFG.copylab) return;
    return; // Copy Lab disabled — keep data available via CFG.copylab but hide UI
    const fab = document.createElement('button');
    fab.className = 'copylab-fab'; fab.textContent = '📋 Copy Lab';
    const modal = document.createElement('div');
    modal.className = 'copylab';
    const tabs = ['Headlines','CTAs','Iron & Ales','Objections','Visual & Trust'];
    modal.innerHTML = `
      <div class="copylab-inner">
        <div class="copylab-head">
          <div>
            <h4>Copy Lab · ${CFG.pageLabel || ''}</h4>
            <div class="sub">${CFG.pageAngle || ''}</div>
          </div>
          <button class="copylab-close">✕</button>
        </div>
        <div class="copylab-tabs">
          ${tabs.map((t,i) => `<button class="copylab-tab ${i===0?'active':''}" data-tab="${i}">${t}</button>`).join('')}
        </div>
        <div class="copylab-body"></div>
      </div>`;
    document.body.appendChild(fab);
    document.body.appendChild(modal);
    fab.addEventListener('click', () => { modal.classList.add('open'); renderTab(0); });
    modal.querySelector('.copylab-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
    modal.querySelectorAll('.copylab-tab').forEach(t => {
      t.addEventListener('click', () => {
        modal.querySelectorAll('.copylab-tab').forEach(x => x.classList.remove('active'));
        t.classList.add('active');
        renderTab(parseInt(t.dataset.tab,10));
      });
    });

    const body = modal.querySelector('.copylab-body');
    function renderTab(i){
      const L = CFG.copylab;
      if (i === 0) {
        body.innerHTML = `
          <div class="copylab-sec">
            <h5>Chosen Hero Headline</h5>
            <ul class="copylab-list"><li class="active"><span class="n">★</span><div>${CFG.headlines[0].html}<div class="copylab-note">Sub: ${CFG.headlines[0].sub}</div></div><button class="apply" data-idx="0">In Use</button></li></ul>
          </div>
          <div class="copylab-sec">
            <h5>Headline Variations (${CFG.headlines.length})</h5>
            <ul class="copylab-list">
              ${CFG.headlines.map((h,idx) => `<li data-idx="${idx}"><span class="n">${idx+1}</span><div>${h.html}<div class="copylab-note">${h.sub}</div></div><button class="apply" data-idx="${idx}">Apply</button></li>`).join('')}
            </ul>
          </div>`;
        body.querySelectorAll('.apply').forEach(b => b.addEventListener('click', () => {
          setTweak('headline', parseInt(b.dataset.idx,10));
          modal.classList.remove('open');
        }));
      } else if (i === 1) {
        body.innerHTML = `
          <div class="copylab-sec">
            <h5>Primary CTA — Live Swap</h5>
            <ul class="copylab-list">
              ${Object.entries(CTA_COPY).map(([k,v]) => `<li data-key="${k}"><span class="n">→</span><div>${v}</div><button class="apply" data-key="${k}">Apply</button></li>`).join('')}
            </ul>
          </div>
          <div class="copylab-sec">
            <h5>Additional CTA Variations</h5>
            <ul class="copylab-list">
              ${L.ctas.map((c,idx) => `<li><span class="n">${idx+1}</span><div>${c}</div></li>`).join('')}
            </ul>
          </div>`;
        body.querySelectorAll('.apply[data-key]').forEach(b => b.addEventListener('click', () => {
          setTweak('cta_copy', b.dataset.key);
        }));
      } else if (i === 2) {
        body.innerHTML = `
          <div class="copylab-sec">
            <h5>Iron &amp; Ales — Core Copy</h5>
            <ul class="copylab-list">
              ${L.ironAles.map((c,idx) => `<li><span class="n">${idx+1}</span><div>${c}</div></li>`).join('')}
            </ul>
          </div>`;
      } else if (i === 3) {
        body.innerHTML = `
          <div class="copylab-sec">
            <h5>Top Objections &amp; Reframes</h5>
            <ul class="copylab-list">
              ${L.objections.map((o,idx) => `<li><span class="n">${idx+1}</span><div><b>${o.q}</b><div class="copylab-note">${o.a}</div></div></li>`).join('')}
            </ul>
          </div>`;
      } else if (i === 4) {
        body.innerHTML = `
          <div class="copylab-sec">
            <h5>Visual Direction</h5>
            <ul class="copylab-list">
              ${L.visuals.map((v,idx) => `<li><span class="n">${idx+1}</span><div>${v}</div></li>`).join('')}
            </ul>
          </div>
          <div class="copylab-sec">
            <h5>Trust Elements</h5>
            <ul class="copylab-list">
              ${L.trust.map((t,idx) => `<li><span class="n">${idx+1}</span><div>${t}</div></li>`).join('')}
            </ul>
          </div>`;
      }
    }
  }

  /* ============================================================
     COUNTDOWN — enrollment closes Friday 6pm local (weekly)
  ============================================================ */
  function buildCountdown(){
    const root = $('.countdown');
    if (!root) return;
    function nextClose(){
      const now = new Date();
      const target = new Date(now);
      // Next Friday 18:00
      const diffDay = (5 - now.getDay() + 7) % 7;
      target.setDate(now.getDate() + (diffDay === 0 && now.getHours() >= 18 ? 7 : diffDay));
      target.setHours(18, 0, 0, 0);
      if (target <= now) target.setDate(target.getDate() + 7);
      return target;
    }
    const target = nextClose();
    function tick(){
      let diff = Math.max(0, target - new Date());
      const d = Math.floor(diff/86400000); diff -= d*86400000;
      const h = Math.floor(diff/3600000);  diff -= h*3600000;
      const m = Math.floor(diff/60000);    diff -= m*60000;
      const s = Math.floor(diff/1000);
      const cells = root.querySelectorAll('.cd-cell .n');
      if (cells.length >= 4) {
        cells[0].textContent = String(d).padStart(2,'0');
        cells[1].textContent = String(h).padStart(2,'0');
        cells[2].textContent = String(m).padStart(2,'0');
        cells[3].textContent = String(s).padStart(2,'0');
      }
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ============================================================
     SPOTS — decay gently over session
  ============================================================ */
  function buildSpots(){
    const bar = $('.spots-bar-fill');
    const n = $('[data-spots-n]');
    if (!bar || !n) return;
    let spots = parseInt(localStorage.getItem('cfbc_spots') || '7', 10);
    if (isNaN(spots) || spots < 2) spots = 7;
    function draw(){
      n.textContent = spots;
      bar.style.width = ((12 - spots) / 12 * 100) + '%';
    }
    draw();
    // decay one every ~50s of active session
    setInterval(() => {
      if (spots > 2 && Math.random() < 0.25) { spots--; localStorage.setItem('cfbc_spots', spots); draw(); }
    }, 50000);
  }

  /* ============================================================
     CALENDAR (Calendly-style placeholder)
  ============================================================ */
  function buildCalendar(){
    const root = $('.cal');
    if (!root) return;
    const now = new Date();
    let month = now.getMonth(), year = now.getFullYear();
    let selDay = null, selSlot = null;

    function render(){
      const first = new Date(year, month, 1);
      const last = new Date(year, month+1, 0);
      const startDow = first.getDay();
      const monthLbl = first.toLocaleString('en-US', { month:'long', year:'numeric' });
      root.querySelector('[data-cal-head]').textContent = monthLbl;
      const grid = root.querySelector('.cal-grid');
      grid.innerHTML = ['S','M','T','W','T','F','S'].map(d => `<div class="cal-dow">${d}</div>`).join('');
      for (let i=0; i<startDow; i++) grid.innerHTML += '<div class="cal-day none"></div>';
      for (let d=1; d<=last.getDate(); d++){
        const date = new Date(year, month, d);
        const dow = date.getDay();
        const isPast = date < new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const isToday = date.toDateString() === now.toDateString();
        const avail = !isPast && dow !== 0; // Sun closed
        grid.innerHTML += `<div class="cal-day ${avail?'avail':''} ${isToday?'today':''} ${selDay===d?'selected':''}" data-day="${d}">${d}</div>`;
      }
      // slots for selected day
      const slotsEl = root.querySelector('.cal-slots');
      if (selDay) {
        const slots = ['6:00 AM','7:30 AM','9:00 AM','12:00 PM','4:30 PM','6:00 PM'];
        slotsEl.innerHTML = slots.map(s => `<button class="cal-slot ${selSlot===s?'selected':''}" data-slot="${s}">${s}</button>`).join('');
        slotsEl.style.display = '';
      } else {
        slotsEl.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:18px;color:#4A4A52;font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:600">Select a date →</div>';
      }
      // footer
      const foot = root.querySelector('.cal-foot .sel');
      if (selDay && selSlot) {
        const d = new Date(year, month, selDay);
        foot.innerHTML = `Selected <b>${d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})} · ${selSlot}</b>`;
        root.querySelector('.cal-confirm').disabled = false;
        root.querySelector('.cal-confirm').style.opacity = 1;
      } else {
        foot.innerHTML = 'Pick a date &amp; time';
        root.querySelector('.cal-confirm').disabled = true;
        root.querySelector('.cal-confirm').style.opacity = .45;
      }
    }
    root.addEventListener('click', (e) => {
      const d = e.target.closest('.cal-day.avail');
      if (d) { selDay = parseInt(d.dataset.day,10); selSlot = null; render(); return; }
      const s = e.target.closest('.cal-slot');
      if (s) { selSlot = s.dataset.slot; render(); return; }
      const prev = e.target.closest('[data-cal-prev]');
      const next = e.target.closest('[data-cal-next]');
      if (prev || next) {
        if (prev) { month--; if (month<0){month=11;year--;} }
        if (next) { month++; if (month>11){month=0;year++;} }
        selDay = null; selSlot = null; render();
      }
      const confirm = e.target.closest('.cal-confirm');
      if (confirm && !confirm.disabled) {
        const overlay = document.createElement('div');
        overlay.className = 'copylab open';
        overlay.innerHTML = `<div class="copylab-inner" style="max-width:520px;text-align:center;padding:48px 40px">
          <div class="copylab-head" style="border:none;justify-content:center;padding:0 0 20px">
            <div><h4 style="color:var(--cfbc-red)">You're In.</h4><div class="sub">See you at CFBC</div></div>
          </div>
          <p style="color:#D6D6DB;line-height:1.6;font-size:15px;margin:0 0 24px">Your No-Sweat Intro is booked for <b style="color:#fff">${new Date(year,month,selDay).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})} at ${selSlot}</b>. We'll text you a confirmation + parking tips shortly.</p>
          <button class="btn btn-primary" onclick="this.closest('.copylab').remove()">Got It</button>
        </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.remove(); });
      }
    });
    render();
  }

  /* ============================================================
     BOOT
  ============================================================ */
  function boot(){
    buildTweaksPanel();
    buildCopyLab();
    buildCountdown();
    buildSpots();
    buildCalendar();
    applyTweaks();

    // smooth anchor scrolling
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (id.length <= 1) return;
        const t = $(id);
        if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 80, behavior:'smooth' }); }
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
