const core = require("@actions/core");
const tc = require("@actions/tool-cache");
const exec = require("@actions/exec");
const os = require("os");

(async function () {
  try {
    const version = core.getInput("dafny-version", { required: true });
    const distribution = getDistribution(os.platform(), version);
    const url = await dafnyURL(version, distribution);

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
    await installDotnetTool("dafny-reportgenerator", "1.*");
  } catch (error) {
    core.setFailed(error.message);
  }
})();

async function installDotnetTool(toolName, version) {
  await exec.exec("dotnet", [
    "tool",
    "install",
    "-g",
    toolName,
    "--version",
    version,
  ]);
}

// Export functions for testing
exports.dafnyURL = dafnyURL;
exports.getDistribution = getDistribution;

async function dafnyURL(version, distribution) {
  const versionPath = version.startsWith("nightly") ? "nightly" : `v${version}`;
  if (version == "nightly-latest") {
    version = await latestNightlyVersion();
  }
  const root = "https://github.com/dafny-lang/dafny/releases/download";
  return `${root}/${versionPath}/dafny-${
    version == "2.3.0" ? "2.3.0.10506" : version
  }-x64-${distribution}.zip`;
}

async function latestNightlyVersion() {
  // Shamelessly copied and modified from dafny-lang/ide-vscode
  // I'd prefer to use the GitHub API to list the assets under the "nightly" release,
  // but @actions/github requires authentication.
  const { exitCode, stdout, stderr } = await exec.getExecOutput(
    "dotnet",
    ["tool", "search", "Dafny", "--detail", "--prerelease"],
    { silent: true }
  );
  if (exitCode != 0) {
    throw new Error(
      `dotnet tool command failed (exitCode ${exitCode}):\n${stderr}"`
    );
  }
  const entries = stdout
    .split("----------------")
    .map((entry) => entry.split("\n").filter((e) => e !== ""));
  const dafnyEntry = entries.filter((entry) => entry[0] === "dafny")[0];
  const versionsIndex = dafnyEntry.findIndex((v) => v.startsWith("Versions:"));
  const versions = dafnyEntry
    .slice(versionsIndex + 1)
    .map((versionLine) => versionLine.trimStart().split(" ")[0]);

  const nightlies = versions.filter((l) => l.includes("nightly"));
  const dates = nightlies.map((n, index) => {
    const split = n.split("-");
    return { index, date: split[2] + split[3] + split[4] };
  });
  dates.sort((a, b) => (a.date < b.date ? 1 : -1));
  const toolVersion = nightlies[dates[0].index];

  // Slice off the "3.11.0.50201-" from 3.11.0.50201-nightly-2023-02-13-14bc57f, for e.g.
  const version = toolVersion.slice(toolVersion.indexOf("-") + 1);

  core.info(`Using latest nightly version: ${version}`);
  return version;
}

function getDistribution(platform, version) {
  return platform === "darwin" // Osx
    ? version == "2.3.0"
      ? "osx-10.14.1"
      : "osx-10.14.2"
    : platform === "win32" // windows
    ? "win"
    : "ubuntu-16.04"; // Everything else is linux...
}
