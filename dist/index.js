/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 774:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 699:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 522:
/***/ ((module) => {

module.exports = eval("require")("@actions/tool-cache");


/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
const core = __nccwpck_require__(774);
const tc = __nccwpck_require__(522);
const exec = __nccwpck_require__(699);
const os = __nccwpck_require__(37);

(async function () {
  try {
    const version = core.getInput("dafny-version", { required: true });
    const distribution = getDistribution(os.platform(), version);
    const { url, fullVersion } = await dafnyURLAndFullVersion(
      version,
      distribution
    );

    core.info(`Dafny Version: ${fullVersion}`);
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

    core.exportVariable("DAFNY_VERSION", fullVersion);
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
exports.dafnyURLAndFullVersion = dafnyURLAndFullVersion;
exports.getDistribution = getDistribution;
exports.resolveNightlyVersionFromDotnetToolSearch =
  resolveNightlyVersionFromDotnetToolSearch;

async function dafnyURLAndFullVersion(version, distribution) {
  const versionPath = version.startsWith("nightly") ? "nightly" : `v${version}`;
  var fullVersion;
  if (version.startsWith("nightly")) {
    fullVersion = await resolveNightlyVersion(version);
    // Slice off the "3.11.0.50201-" from 3.11.0.50201-nightly-2023-02-13-14bc57f, for e.g.
    version = fullVersion.slice(fullVersion.indexOf("-") + 1);
  } else {
    fullVersion = version;
  }
  const root = "https://github.com/dafny-lang/dafny/releases/download";
  // using the same approach as the dafny-lang/ide-vscode
  const url = `${root}/${versionPath}/dafny-${
    version == "2.3.0" ? "2.3.0.10506" : version
  }-${os.arch()}-${distribution}.zip`;
  return { url, fullVersion };
}

async function resolveNightlyVersion(nightlyVersion) {
  const output = await dotnetToolSearch();
  return resolveNightlyVersionFromDotnetToolSearch(output, nightlyVersion);
}

async function dotnetToolSearch() {
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
  return stdout;
}

function resolveNightlyVersionFromDotnetToolSearch(output, nightlyVersion) {
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
  var toolVersion;
  if (nightlyVersion == "nightly-latest") {
    const dates = nightlies.map((nightly) => {
      const date = new Date(nightly.split("-").slice(2, 5).join("-"));
      return { nightly, date };
    });
    dates.sort((a, b) => (a.date < b.date ? 1 : -1));
    toolVersion = dates[0].nightly;
  } else {
    const matchingVersions = versions.filter((nightly) =>
      nightly.includes(nightlyVersion)
    );
    if (matchingVersions.length != 1) {
      throw new Error(
        `Did not find exactly one version matching ${nightlyVersion}: ${matchingVersions}"`
      );
    }
    toolVersion = matchingVersions[0];
  }

  core.info(`Using nightly version: ${toolVersion}`);
  return toolVersion;
}

function versionToNumeric(version) {
  // Also copied and modified from dafny-lang/ide-vscode.
  // Switching to dotnet tool install would avoid having to do this...
  const numbers = version.split(".").map((x) => Number.parseInt(x));
  return (numbers[0] * 1000 + (numbers[1] ?? 0)) * 1000 + (numbers[2] ?? 0);
}

function getDistribution(platform, version) {
  // Also copied and modified from dafny-lang/ide-vscode.

  // Since every nightly published after this edit will be configured in the post-3.12 fashion, and this script
  // fetches the latest nightly, it's safe to just condition this on 'nightly' and not 'nightly-date' for a date
  // after a certain point.
  const post312 =
    version.includes("nightly") ||
    versionToNumeric(version) >= versionToNumeric("3.13");
  if (post312) {
    switch (platform) {
      case "win32":
        return "windows-2019";
      case "darwin":
        return "macos-11";
      default:
        return "ubuntu-20.04";
    }
  } else {
    switch (platform) {
      case "win32":
        return "win";
      case "darwin":
        return version == "2.3.0" ? "osx-10.14.1" : "osx-10.14.2";
      default:
        return "ubuntu-16.04";
    }
  }
}

})();

module.exports = __webpack_exports__;
/******/ })()
;