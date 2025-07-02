function parseChromeVersion() {
  const ua = navigator.userAgent;
  console.log("User Agent:", ua); // for debugging

  const match = ua.match(/Chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/);

  if (!match) return null;

  const [major, minor, build, patch] = match.slice(1).map(Number);
  return { major, minor, build, patch };
}

function isVulnerableTo5419(v) {
  return (
    v.major < 137 ||
    (v.major === 137 && v.build < 7151) ||
    (v.major === 137 && v.build === 7151 && v.patch < 68)
  );
}

function isVulnerableTo6554(v) {
  return (
    v.major < 138 ||
    (v.major === 138 && v.build < 7204) ||
    (v.major === 138 && v.build === 7204 && v.patch < 96)
  );
}

const version = parseChromeVersion();

if (version) {
  const display = `Detected Chrome Version: ${version.major}.${version.minor}.${version.build}.${version.patch}`;
  document.getElementById("version").textContent = display;

  const vulnerable5419 = isVulnerableTo5419(version);
  const vulnerable6554 = isVulnerableTo6554(version);
  let vulnMessage = "";

  if (version.build === 0 && version.patch === 0) {
    // macOS version anomaly
    document.getElementById("status").innerHTML = `<strong class="safe">⚠️ Unable to confirm full version details on macOS. Please check manually at <code>chrome://settings/help</code>.</strong>`;
  } else if (vulnerable5419 || vulnerable6554) {
    vulnMessage += `<strong class="vulnerable">Your Chrome version ${version.major}.${version.minor}.${version.build}.${version.patch} is vulnerable to:</strong><br>`;
    if (vulnerable5419) vulnMessage += `• CVE-2025-5419 (Out-of-bounds memory bug in V8)<br>`;
    if (vulnerable6554) vulnMessage += `• CVE-2025-6554 (Type confusion in V8)<br>`;
    vulnMessage += `<br><a href="chrome://settings/help" target="_blank" rel="noopener noreferrer">Update Chrome now</a>`;
    document.getElementById("status").innerHTML = vulnMessage;
  } else {
    document.getElementById("status").innerHTML = `<strong class="safe">✅ Good news! Your Chrome version is safe from CVE-2025-5419 and CVE-2025-6554. Thanks for keeping it updated.</strong>`;
  }
} else {
  document.getElementById("status").textContent = "Could not detect Chrome version. Are you using Chrome?";
}
