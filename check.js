function parseChromeVersion() {
  const match = navigator.userAgent.match(/Chrome\/(\d+)\.(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  const [major, minor, build, patch] = match.slice(1).map(Number);
  return { major, minor, build, patch };
}

function isVulnerable(version) {
  return (
    version.major < 137 ||
    (version.major === 137 && version.build < 7151) ||
    (version.major === 137 && version.build === 7151 && version.patch < 68)
  );
}

const version = parseChromeVersion();

if (version) {
  const versionString = `${version.major}.${version.minor}.${version.build}.${version.patch}`;
  document.getElementById("version").textContent = `Detected Chrome Version: ${versionString}`;

  if (isVulnerable(version)) {
    document.getElementById("status").innerHTML = `
      <span class="vulnerable">
        Your Chrome version <strong>${versionString}</strong> is vulnerable to CVE-2025-5419.<br>
        Please <a href="chrome://settings/help">update Chrome</a> immediately.
      </span>
    `;
  } else {
    document.getElementById("status").innerHTML = `
      <span class="safe">
        Your Chrome version <strong>${versionString}</strong> is not vulnerable. Good job keeping Chrome updated!
      </span>
    `;
  }
} else {
  document.getElementById("status").innerHTML = `
    <span class="not-chrome">
      Hollllld on... This isn't Chrome. You're not vulnerable to this specific 0day, but stay safe out there.
    </span>
  `;
}
