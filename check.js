function parseChromeVersion() {
  const ua = navigator.userAgent;
  console.log("User Agent:", ua); // for debugging

  const match = ua.match(/Chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/);

  if (!match) return null;

  const [major, minor, build, patch] = match.slice(1).map(Number);
  return { major, minor, build, patch };
}

function isVulnerable(version) {
  // If build and patch are zero, assume safe to avoid false positives (common on macOS)
  if (version.build === 0 && version.patch === 0) return false;

  // Vulnerable if version < 137.0.7151.68
  return (
    version.major < 137 ||
    (version.major === 137 && version.build < 7151) ||
    (version.major === 137 && version.build === 7151 && version.patch < 68)
  );
}

const version = parseChromeVersion();

if (version) {
  const display = `Detected Chrome Version: ${version.major}.${version.minor}.${version.build}.${version.patch}`;
  document.getElementById("version").textContent = display;

  if (isVulnerable(version)) {
    document.getElementById("status").innerHTML = `<strong class="vulnerable">Your Chrome version ${version.major}.${version.minor}.${version.build}.${version.patch} is vulnerable to CVE-2025-5419.<br> Please update your Chrome immediately.<br><a href="chrome://settings/help" target="_blank" rel="noopener noreferrer">Update Chrome now</a></strong>`;
  } else {
    document.getElementById("status").innerHTML = `<strong class="safe">Good news! Your Chrome version appears safe. Thanks for keeping it updated.</strong>`;
  }

  // macOS version detection warning
  if (version.build === 0 && version.patch === 0) {
    const note = document.createElement("p");
    note.style.color = "#ffd166";
    note.style.marginTop = "1em";
    note.innerHTML = "⚠️ Note: On macOS, Chrome sometimes reports partial version info. If you're unsure, please manually check via <code>chrome://settings/help</code>.";
    document.body.appendChild(note);
  }
} else {
  document.getElementById("status").textContent = "Could not detect Chrome version. Are you using Chrome?";
}
