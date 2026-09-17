(function () {
  "use strict";
  var DAY = 86400000;
  var form = document.getElementById("exit-clock-form");
  if (!form) return;
  var results = document.getElementById("tool-results");
  var firstTwo = document.getElementById("first-two");
  var fullSchedule = document.getElementById("full-schedule");
  var locked = document.getElementById("locked-panel");
  var emailForm = document.getElementById("email-form");
  var message = document.getElementById("tool-message");
  var state = {};

  function date(v) { if (!v) return null; var p = v.split("-"); var d = new Date(+p[0], +p[1] - 1, +p[2], 12); return isNaN(d) ? null : d; }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function addMonths(d, n) { var x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
  function addWorkingDays(d, n) { var x = new Date(d), count = 0; while (count < n) { x = addDays(x, 1); if (x.getDay() !== 0 && x.getDay() !== 6) count++; } return x; }
  function fmt(d) { return String(d.getDate()).padStart(2, "0") + " " + ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()] + " " + d.getFullYear(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function getState() {
    var data = new FormData(form);
    state = {
      lwd: date(data.get("lwd")),
      service: parseFloat(data.get("service")),
      empType: data.get("empType"),
      coverEnds: date(data.get("coverEnds")),
      hasPF: data.get("hasPF") === "on",
      cash: parseFloat(data.get("cash")),
      burn: parseFloat(data.get("burn"))
    };
  }
  function build() {
    var lwd = state.lwd, items = [];
    if (!lwd) return items;
    items.push({ date: null, title: "Get the separation terms in writing", text: "Ask for the separation letter and a component-wise breakdown of every amount: salary due, notice pay, severance, variable pay, leave encashment, gratuity, reimbursements. One lump-sum figure is not enough to check anything against.", rule: "There is no statutory deadline for this, which is exactly why it slips." });
    items.push({ date: addWorkingDays(lwd, 2), title: "Wages due", text: "Earned salary up to your last working day should be settled by now. If it has not landed, ask in writing and keep the reply.", rule: "Code on Wages: where an employee is removed, dismissed, retrenched, resigns, or becomes unemployed on closure, wages are generally payable within two working days." });
    if (state.coverEnds) items.push({ date: addDays(state.coverEnds, -21), title: "Start arranging replacement health cover", text: "Ask the insurer about migrating the group policy to an individual or family floater, and what waiting-period credits carry over.", rule: "The IRDAI framework recognises migration and portability, but the credits and timing depend on the policy and insurer." });
    else items.push({ date: null, title: "Confirm the exact date your health cover ends", text: "Get the date in writing from HR and from the insurer or TPA. Cover can end on your last working day, at month end, or on another policy-defined date.", rule: "Employer group cover is governed by the policy, not by your notice period." });
    items.push({ date: addDays(lwd, 14), title: "Check what public support you actually qualify for", text: "Check National Career Service for vacancies and counsellors, and ESIC schemes if you were an insured person.", rule: "Eligibility depends on your status and contribution conditions. Confirm before planning around it." });
    items.push({ date: addDays(lwd, 30), title: "Chase your exit documents", text: "Relieving or experience letter, full-and-final statement, PF exit date, gratuity calculation if eligible, and a post-exit HR contact with a ticket number.", rule: "Timelines are set by company policy. Thirty days is a practical escalation point, not a statutory limit." });
    if (isFinite(state.service) && (state.service >= 5 || (state.empType === "fixed" && state.service >= 1))) {
      items.push({ date: addDays(lwd, 30), title: "Gratuity should be paid", text: "Ask for the wage base used, the completed years counted, and how the part-year was treated.", rule: "Standard rate is 15 days' wages per completed year, currently capped at ₹20 lakh, generally payable within 30 days of becoming due." });
    }
    items.push({ date: addDays(lwd, 30), title: "Leave encashment settled", text: "Confirm your leave balance at exit, the encashment policy applied, and the amount included in the settlement.", rule: "Entitlement is set by employer policy. For non-government employees, exemption is subject to a lower-of calculation with a statutory ceiling currently at ₹25 lakh." });
    if (state.hasPF) {
      items.push({ date: addDays(addMonths(lwd, 1), 1), title: "PF unemployment advance becomes available", text: "Available if you are still unemployed. Treat it as a decision, not automatic emergency cash — work out your runway first.", rule: "EPFO's current FAQ allows a non-refundable advance of up to 75% of the PF balance after more than one month of unemployment." });
      items.push({ date: addMonths(lwd, 2), title: "PF final settlement window opens", text: "If you join another EPF-covered employer, evaluate transfer rather than withdrawing by default.", rule: "EPFO's current FAQ allows final settlement on retirement or two months after ceasing employment. A taxable withdrawal before five years can attract 10% TDS under section 192A above ₹50,000." });
    }
    if (isFinite(state.cash) && isFinite(state.burn) && state.burn > 0) {
      items.push({ date: addDays(new Date(), Math.round((state.cash / state.burn) * 30)), title: "Stress date — decide before this, not on it", text: "Your runway is " + (state.cash / state.burn).toFixed(1) + " months. Move to a defensive budget now and make pipeline decisions weekly rather than monthly.", rule: "Runway sets your negotiating position." });
    }
    return items.sort(function (a, b) { if (!a.date && !b.date) return 0; if (!a.date) return -1; if (!b.date) return 1; return a.date - b.date; });
  }
  function renderItem(item) {
    return '<article class="deadline-item"><div class="tool-date">' + (item.date ? esc(fmt(item.date)) : "DO NOW") + '</div><div><h4>' + esc(item.title) + '</h4><p>' + esc(item.text) + '</p><p class="rule-line">' + esc(item.rule) + '</p></div></article>';
  }
  function render(items) {
    firstTwo.innerHTML = items.slice(0, 2).map(renderItem).join("");
    fullSchedule.innerHTML = items.slice(2).map(renderItem).join("");
    document.getElementById("summary-next").textContent = items[0].date ? fmt(items[0].date) : "Do now";
    document.getElementById("summary-count").textContent = String(items.length);
    results.hidden = false;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  form.addEventListener("submit", function (event) {
    event.preventDefault(); getState();
    if (!state.lwd) { message.textContent = "Enter your last working day to build the schedule."; return; }
    var items = build();
    render(items);
    message.textContent = "The first two deadlines are shown below. Your dates stay in this browser.";
  });
  if (emailForm) emailForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = emailForm.querySelector("input").value.trim();
    if (!email || !email.includes("@")) { message.textContent = "Enter a valid email address."; return; }
    var endpoint = window.EXIT_CLOCK_CONFIG && window.EXIT_CLOCK_CONFIG.formEndpoint;
    var finish = function () {
      locked.hidden = true;
      fullSchedule.classList.add("is-visible");
      var printButton = document.getElementById("print-schedule");
      printButton.hidden = false;
      printButton.classList.add("is-visible");
      message.textContent = endpoint === "FORM_ENDPOINT_PLACEHOLDER" ? "Full schedule shown. Add your form endpoint in site.js before publishing to send it by email." : "Your full schedule is shown below.";
    };
    if (!endpoint || endpoint === "FORM_ENDPOINT_PLACEHOLDER") { finish(); return; }
    fetch(endpoint, { method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({ email: email, lastWorkingDay: form.lwd.value }) })
      .then(function (response) { if (!response.ok) throw new Error("Request failed"); finish(); })
      .catch(function () { message.textContent = "We could not send the email. Your first two deadlines are still available; try again later."; });
  });
  var print = document.getElementById("print-schedule");
  if (print) print.addEventListener("click", function () { window.print(); });
})();