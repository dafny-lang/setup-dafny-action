const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const os = require("os");

(async function () {
  try {
    const version = core.getInput("dafny-version", { required: true });
    const distribution = getDistribution(os.platform(), version);
    const url = dafnyURL(version, distribution);

    core.info(`Dafny Url: ${url}`);
    core.info(`Dafny Distribution: ${distribution}`);

    const zipFile = await tc.downloadTool(url);
    const dir = await tc.extractZip(zipFile);
    // The zip file is expanded into a directory with the name of the zip file.
    const cachedPath = await tc.cacheDir(dir + "/dafny", "dafny", version);

    core.addPath(cachedPath);

    // Install related tools.
    // Hopefully in the future we can install Dafny itself this way as well.
    // For now the zipped releases are simpler because they include Z3.
    await installDotnetTool("dafny-reportgenerator", "1.*")
  } catch (error) {
    core.setFailed(error.message);
  }
})();

async function installDotnetTool(toolName, version) {
  core.info(`Installing version ${version} of ${toolName}`);
  await exec.exec("dotnet", ["tool", "install", "-g", toolName, "--version", version])
}

// Export functions for testing
exports.dafnyURL = dafnyURL;
exports.getDistribution = getDistribution;

function dafnyURL(version, distribution) {
  const versionPath = version.startsWith("nightly") ? "nightly" : `v${version}`;
  const root = "https://github.com/dafny-lang/dafny/releases/download";
  return `${root}/${versionPath}/dafny-${version == "2.3.0" ? "2.3.0.10506" : version}-x64-${distribution}.zip`;
}

function getDistribution(platform, version) {
  return platform === "darwin" // Osx
    ? version == "2.3.0" ? "osx-10.14.1" : "osx-10.14.2"
    : platform === "win32" // windows
    ? "win"
    : "ubuntu-16.04"; // Everything else is linux...
}
