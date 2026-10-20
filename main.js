// ZY Nexa site script: mobile menu, footer year, service preselect, and lead forms -> Google Sheets

// Paste your Google Apps Script web app URL (ends in /exec) between the quotes
var SHEET_URL = 'https://script.google.com/macros/s/AKfycbxaU9tzV8FPBGNyprDTFIc7oouYhvdsL1Mt_riufG2PNkgPJz0lWvZ13sg7Ee0GDQz0/exec';

var menu = document.getElementById('menu');
var nav = document.getElementById('nav');
if (menu && nav) {
  menu.addEventListener('click', function () { nav.classList.toggle('open'); });
}

var yr = document.getElementById('yr');
if (yr) { yr.textContent = new Date().getFullYear(); }

// Preselect the service on the contact page, e.g. contact.html?service=Meta%20ads
var params = new URLSearchParams(location.search);
var svc = document.getElementById('c-service');
if (svc && params.get('service')) {
  for (var i = 0; i < svc.options.length; i++) {
    if (svc.options[i].text === params.get('service')) { svc.selectedIndex = i; }
  }
}

var today = new Date().toISOString().split('T')[0];
document.querySelectorAll('input[type=date]').forEach(function (d) { d.min = today; });

document.querySelectorAll('.lead-form').forEach(function (f) {
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var msg = f.querySelector('.msg');
    var btn = f.querySelector('button[type=submit]');
    function err(n, m) { var el = f.querySelector('[data-err="' + n + '"]'); if (el) { el.textContent = m; } }
    function val(n) { return f.elements[n] ? f.elements[n].value.trim() : ''; }
    err('name', ''); err('phone', ''); err('email', '');
    msg.className = 'msg';
    if (!val('name')) { err('name', 'Enter your name'); ok = false; }
    if (val('phone').replace(/\D/g, '').length < 10) { err('phone', 'Enter a valid phone number'); ok = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val('email'))) { err('email', 'Enter a valid email'); ok = false; }
    if (!ok) { return; }
    if (SHEET_URL.indexOf('script.google.com') < 0) {
      msg.textContent = 'The form is not connected yet. Please WhatsApp us on 8489741069.';
      msg.className = 'msg bad';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Sending...';
    fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(new FormData(f)) })
      .then(function () {
        msg.textContent = 'Got it. We will confirm your call within one business day.';
        msg.className = 'msg ok';
        f.reset();
      })
      .catch(function () {
        msg.textContent = 'Something went wrong. Please WhatsApp us on 8489741069.';
        msg.className = 'msg bad';
      })
      .then(function () {
        btn.disabled = false;
        btn.textContent = btn.getAttribute('data-label');
      });
  });
});
