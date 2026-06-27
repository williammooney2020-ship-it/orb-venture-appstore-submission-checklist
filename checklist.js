// App Store Submission Checklist — browser-only, state persisted in localStorage.

const CHECKLIST = [
  {
    category: "Metadata",
    icon: "📝",
    items: [
      { id: "name",        text: "App name is 30 characters or less", detail: "Counted in bytes — emoji count as multiple bytes." },
      { id: "subtitle",    text: "Subtitle is 30 characters or less", detail: "Appears below the app name on the product page." },
      { id: "keywords",    text: "Keywords field is 100 characters or less (no spaces)", detail: "Use commas with no spaces: habit,tracker,goals" },
      { id: "promo",       text: "Promotional text is 170 characters or less", detail: "Only text you can update without a new app version." },
      { id: "desc",        text: "Description is 4,000 characters or less", detail: "The first 3–4 lines are visible before 'more'." },
      { id: "no_super",    text: "No superlatives in metadata (#1, best, top)", detail: "Apple 2.3.7: avoid misleading or unverifiable claims." },
      { id: "support_url", text: "Support URL is live and resolves", detail: "Required field — Apple checks this manually." },
      { id: "privacy_url", text: "Privacy policy URL is live and resolves", detail: "Required for any app — especially if you collect data." },
    ],
  },
  {
    category: "Screenshots & Preview",
    icon: "📸",
    items: [
      { id: "ss_iphone67", text: "iPhone 6.7\" screenshots uploaded (1320×2868px)", detail: "Required for all iPhone apps from Xcode 16+." },
      { id: "ss_iphone65", text: "iPhone 6.5\" screenshots uploaded (1284×2778px)", detail: "Displays on older iPhone Pro Max and Plus models." },
      { id: "ss_ipad129",  text: "iPad 12.9\" screenshots uploaded if app supports iPad", detail: "Required if your app runs on iPad." },
      { id: "ss_no_alpha", text: "Screenshots have no alpha/transparency", detail: "Apple rejects screenshots with transparent backgrounds." },
      { id: "ss_correct",  text: "Screenshots show the actual app (no mockups only)", detail: "UI must match the submitted binary." },
    ],
  },
  {
    category: "Binary & Build",
    icon: "⚙️",
    items: [
      { id: "build_up",    text: "Build is uploaded and shows in App Store Connect", detail: "Allow 15–30 minutes after upload to appear." },
      { id: "build_64",    text: "App is 64-bit only (no 32-bit slices)", detail: "Required since iOS 11 — modern Xcode handles this automatically." },
      { id: "min_ios",     text: "Minimum OS version set correctly", detail: "Don't target an OS older than you've tested on." },
      { id: "no_crash",    text: "App doesn't crash on launch on a real device", detail: "Apple's review team tests on device, not just simulator." },
      { id: "no_placeholders", text: "No placeholder content, lorem ipsum, or 'TODO' labels", detail: "Instant rejection for unfinished UI." },
      { id: "push_entitlement", text: "Push notifications entitlement is in provisioning profile if used", detail: "Missing entitlement = crash on first notification." },
    ],
  },
  {
    category: "Privacy & Permissions",
    icon: "🔒",
    items: [
      { id: "priv_label",  text: "App Privacy Nutrition Label is filled in correctly", detail: "Every data type you collect must be declared — Apple spot-checks." },
      { id: "usage_desc",  text: "All Info.plist usage description strings are filled in", detail: "Camera, location, microphone etc. need non-empty strings or Xcode rejects the archive." },
      { id: "no_email",    text: "No hardcoded emails or phone numbers in the app", detail: "Personal contact info in binaries can cause privacy rejections." },
      { id: "gdpr_dialog", text: "If app targets EU users: GDPR consent dialog is implemented", detail: "Required for any tracking or analytics SDK." },
      { id: "coppa",       text: "Age rating is set correctly (17+ if any mature content)", detail: "Incorrect age rating → immediate rejection." },
    ],
  },
  {
    category: "In-App Purchases",
    icon: "💳",
    items: [
      { id: "iap_created", text: "All IAPs are created in App Store Connect", detail: "You can't submit without at least one IAP created if your binary references StoreKit." },
      { id: "iap_disclose", text: "Subscription IAP pricing is disclosed in the description", detail: "Required under guideline 3.1.2 — price + billing period." },
      { id: "restore_btn", text: "'Restore Purchases' button is present", detail: "Required for any non-consumable or subscription IAP." },
      { id: "sandbox_test", text: "All IAPs tested with a sandbox account", detail: "Never test IAPs on a real transaction until launch." },
    ],
  },
  {
    category: "Review Information",
    icon: "👀",
    items: [
      { id: "demo_acct",   text: "Demo account credentials provided (if login required)", detail: "Apple's reviewers need to log in. Use a test account, not your personal one." },
      { id: "review_notes",text: "Review notes explain any unusual functionality", detail: "If your app uses VoIP, device location, NFC — explain why." },
      { id: "no_third_party_ref", text: "No references to other platforms in binary or metadata", detail: "Guideline 2.3.8 — no 'Android', 'Google Play', etc." },
      { id: "testflight",  text: "App has been tested via TestFlight externally", detail: "External testers catch issues that internal testers miss." },
    ],
  },
  {
    category: "App Store Presence",
    icon: "🌟",
    items: [
      { id: "icon_1024",   text: "App icon 1024×1024px uploaded (no alpha channel)", detail: "Required for App Store Connect. PNG format, sRGB color space." },
      { id: "category",    text: "Primary and secondary categories are set", detail: "Choose the most specific category that fits — affects search ranking." },
      { id: "pricing",     text: "Pricing and availability is configured", detail: "Don't forget to set the price tier and availability dates." },
      { id: "version_notes", text: "'What's New' text is filled in for the version", detail: "First line is visible in the App Store update list without 'more'." },
    ],
  },
];

const STORAGE_KEY = "asc_checklist_v1";

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function buildChecklist() {
  const state = loadState();
  const container = document.getElementById("checklist");
  let totalItems = 0;
  let totalChecked = 0;

  CHECKLIST.forEach(section => {
    const sectionEl = document.createElement("div");
    sectionEl.className = "section";

    const checkedInSection = section.items.filter(i => state[i.id]).length;
    const allDone = checkedInSection === section.items.length;

    sectionEl.innerHTML = `
      <div class="section-header">
        <span class="section-icon">${section.icon}</span>
        <span class="section-title">${section.category}</span>
        <span class="section-count ${allDone ? 'all-done' : ''}">${checkedInSection}/${section.items.length}</span>
      </div>
    `;

    section.items.forEach(item => {
      totalItems++;
      const checked = !!state[item.id];
      if (checked) totalChecked++;

      const itemEl = document.createElement("label");
      itemEl.className = "item" + (checked ? " checked" : "");
      itemEl.innerHTML = `
        <input type="checkbox" ${checked ? "checked" : ""} data-id="${item.id}" />
        <div class="item-body">
          <div class="item-text">${item.text}</div>
          <div class="item-detail">${item.detail}</div>
        </div>
      `;
      itemEl.querySelector("input").addEventListener("change", function () {
        const s = loadState();
        s[this.dataset.id] = this.checked;
        saveState(s);
        buildChecklist();
      });

      sectionEl.appendChild(itemEl);
    });

    container.appendChild(sectionEl);
  });

  updateProgress(totalChecked, totalItems);
}

function updateProgress(checked, total) {
  const pct = total ? Math.round((checked / total) * 100) : 0;
  document.getElementById("progressBar").style.width = pct + "%";
  document.getElementById("progressText").textContent = `${checked} of ${total} checked`;
  document.getElementById("progressPct").textContent = pct + "%";

  const statusEl = document.getElementById("progressStatus");
  if (pct === 100) {
    statusEl.textContent = "Ready to submit!";
    statusEl.className = "progress-status ok";
  } else if (pct >= 70) {
    statusEl.textContent = "Almost there";
    statusEl.className = "progress-status warn";
  } else {
    statusEl.textContent = "Keep going";
    statusEl.className = "progress-status muted";
  }
}

function resetAll() {
  if (!confirm("Reset all checkboxes?")) return;
  localStorage.removeItem(STORAGE_KEY);
  document.getElementById("checklist").innerHTML = "";
  buildChecklist();
}

document.addEventListener("DOMContentLoaded", buildChecklist);
