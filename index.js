const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const os = require("os");

(async function () {
  try {
    const version = core.getInput("version", { required: true });
    const distribution = getDistribution(os.platform());

    const { path, file } = dafnyURL(version, distribution);
    const zipFile = await tc.downloadTool(path + "/" + file);
    const dir = await tc.extractZip(zipFile);
    const cachedPath = await tc.cacheDir(dir, "dafny", version);
    core.addPath(cachedPath);
  } catch (error) {
    core.setFailed(error.message);
  }
})();

// Export functions for testing
exports.dafnyURL = dafnyURL;
exports.getDistribution = getDistribution;

function dafnyURL(version, distribution) {
  const versionPath = version.startsWith("nightly") ? "nightly" : `v${version}`;
  const root = "https://github.com/dafny-lang/dafny/releases/download";
  return `${root}/${versionPath}/dafny-${version}-x64-${distribution}.zip`;
}

function getDistribution(platform) {
  return platform === "darwin" // Osx
    ? "osx-10.14.2"
    : platform === "win32" // windows
    ? "win"
    : "ubuntu-16.04"; // Everything else is linux...
}
