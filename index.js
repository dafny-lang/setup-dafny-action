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
exports.latestNightlyVersionFromDotnetToolSearch =
  latestNightlyVersionFromDotnetToolSearch;

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
  return latestNightlyVersionFromDotnetToolSearch(stdout);
}

function latestNightlyVersionFromDotnetToolSearch(output) {
  // Shamelessly copied and modified from dafny-lang/ide-vscode.
  // Parsing the dotnet tool output is obviously not great,
  // and we could consider using the NuGet API in the future.
  // Alternatively if we move to installing Dafny using `dotnet tool install`
  // we could use the `--prerelease` flag, although that assumes
  // that all nightly builds use a fresh version number,
  // and can't be used together with `--version` to express something like
  // "install the latest 3.X version including prereleases".
  const entries = output
    .split("----------------")
    .map((entry) => entry.split(/\r?\n/).filter((e) => e !== ""));
  const dafnyEntry = entries.filter((entry) => entry[0] === "dafny")[0];
  const versionsIndex = dafnyEntry.findIndex((v) => v.startsWith("Versions:"));
  const versions = dafnyEntry
    .slice(versionsIndex + 1)
    .map((versionLine) => versionLine.trimStart().split(" ")[0]);

  const nightlies = versions.filter((l) => l.includes("nightly"));
  const dates = nightlies.map((nightly) => {
    const date = new Date(nightly.split("-").slice(2, 5).join("-"));
    return { nightly, date };
  });
  dates.sort((a, b) => (a.date < b.date ? 1 : -1));
  const toolVersion = dates[0].nightly;

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
