const {
  dafnyURLAndFullVersion,
  getDistribution,
  resolveNightlyVersionFromDotnetToolSearch,
} = require("../index");
const { expect } = require("chai");

describe("dafnyURLAndFullVersion", () => {
  it("basic usage", async () => {
    const { url, fullVersion } = await dafnyURLAndFullVersion("3.8.1", "win");
    expect(url).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/v3.8.1/dafny-3.8.1-x64-win.zip"
    );
    expect(fullVersion).to.equal("3.8.1");
  });

  it("nightly usage", async () => {
    const { url, fullVersion } = await dafnyURLAndFullVersion("nightly-2022-09-23-2bc0042", "ubuntu-16.04");
    expect(url).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/nightly/dafny-nightly-2022-09-23-2bc0042-x64-ubuntu-16.04.zip"
    );
    expect(fullVersion).to.equal("3.8.1.40901-nightly-2022-09-23-2bc0042");
  });

  it("latest nightly parsing logic", async () => {
    const test = resolveNightlyVersionFromDotnetToolSearch(
      sampleDotnetToolSearchOutput, "nightly-latest"
    );
    expect(test).to.equal("3.11.0.50201-nightly-2023-02-15-567a5ba");
  });

  it("latest nightly usage", async () => {
    const { url, fullVersion } = await dafnyURLAndFullVersion("nightly-latest", "ubuntu-16.04");
    expect(url).to.match(
      /^https:\/\/github.com\/dafny-lang\/dafny\/releases\/download\/nightly\/dafny-nightly-/
    );
    expect(fullVersion).to.contain("nightly");
  }).timeout(20_000); // Invoking and parsing the output of `dotnet tool search` can take well over 2 seconds

  it("version 2.3.0", async () => {
    const { url, fullVersion } = await dafnyURLAndFullVersion("2.3.0", "win");
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-osx-10.14.1.zip
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-ubuntu-16.04.zip
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-win.zip
    expect(url).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-win.zip"
    );
    expect(fullVersion).to.equal("2.3.0");
  });
});

const sampleDotnetToolSearchOutput = `
----------------
dafny
Latest Version: 3.11.0.50201
Authors: Dafny
Tags: 
Downloads: 16159
Verified: False
Description: Package Description
Versions: 
	3.10.0.41215-nightly-2023-01-24-fda11e6 Downloads: 54
	3.10.0.41215-nightly-2023-01-25-07932fc Downloads: 54
	3.10.0.41215-nightly-2023-01-26-97f1ced Downloads: 47
	3.10.0.41215-nightly-2023-01-27-5bd9203 Downloads: 50
	3.10.0.41215-nightly-2023-01-28-acb7991 Downloads: 52
	3.10.0.41215-nightly-2023-01-29-acb7991 Downloads: 51
	3.10.0.41215-nightly-2023-01-30-acb7991 Downloads: 53
	3.10.0.41215-nightly-2023-01-31-c23b224 Downloads: 57
	3.10.0.41215-nightly-2023-02-01-c5b4e15 Downloads: 46
	3.10.0.41215 Downloads: 166
	3.11.0.50201-nightly-2023-02-01-0cff53e Downloads: 43
	3.11.0.50201-nightly-2023-02-02-4e54d04 Downloads: 49
	3.11.0.50201-nightly-2023-02-03-9b97489 Downloads: 41
	3.11.0.50201-nightly-2023-02-04-b8d8816 Downloads: 34
	3.11.0.50201-nightly-2023-02-05-b8d8816 Downloads: 33
	3.11.0.50201-nightly-2023-02-06-b8d8816 Downloads: 34
	3.11.0.50201-nightly-2023-02-07-2461f1f Downloads: 30
	3.11.0.50201-nightly-2023-02-08-37cfcb0 Downloads: 31
	3.11.0.50201-nightly-2023-02-09-a86c579 Downloads: 31
	3.11.0.50201-nightly-2023-02-10-a2a4e1b Downloads: 27
	3.11.0.50201-nightly-2023-02-10-a86c579 Downloads: 26
	3.11.0.50201-nightly-2023-02-11-6aeaa2b Downloads: 28
	3.11.0.50201-nightly-2023-02-11-a2a4e1b Downloads: 30
	3.11.0.50201-nightly-2023-02-12-6aeaa2b Downloads: 29
	3.11.0.50201-nightly-2023-02-13-14bc57f Downloads: 27
	3.11.0.50201-nightly-2023-02-14-7cf7164 Downloads: 27
	3.11.0.50201-nightly-2023-02-15-567a5ba Downloads: 14
	3.11.0.50201 Downloads: 94

----------------
dafny-reportgenerator
Latest Version: 1.2.0
Authors: dafny-reportgenerator
Tags: 
Downloads: 11564
Verified: False
Description: Package Description
Versions: 
	1.0.0 Downloads: 248
	1.0.1 Downloads: 525
	1.2.0 Downloads: 10791
`;

describe("getDistribution", () => {
  // https://nodejs.org/docs/latest/api/os.html#os_os_platform
  [
    ["darwin", "4.0.0", "macos-11"],
    ["darwin", "3.13.1", "macos-11"],
    ["darwin", "3.8.1", "osx-10.14.2"],
    ["darwin", "2.3.0", "osx-10.14.1"],
    ["win32", "4.0.0", "windows-2019"],
    ["win32", "3.13.1", "windows-2019"],
    ["win32", "3.8.1", "win"],
    ["win32", "2.3.0", "win"],

    // Everything else is treated a ubuntu linux
    ["freebsd", "4.0.0", "ubuntu-20.04"],
    ["freebsd", "3.13.1", "ubuntu-20.04"],
    ["aix", "3.8.1", "ubuntu-16.04"],
    ["freebsd", "3.8.1", "ubuntu-16.04"],
    ["linux", "3.8.1", "ubuntu-16.04"],
    ["openbsd", "3.8.1", "ubuntu-16.04"],
    ["sunos", "3.8.1", "ubuntu-16.04"],
    ["aix", "2.3.0", "ubuntu-16.04"],
    ["freebsd", "2.3.0", "ubuntu-16.04"],
    ["linux", "2.3.0", "ubuntu-16.04"],
    ["openbsd", "2.3.0", "ubuntu-16.04"],
    ["sunos", "2.3.0", "ubuntu-16.04"],
  ].forEach(([platform, version, expectedDafnyDistribution]) => {
    it(`Platform: ${platform}, ${version}`, () => {
      const test = getDistribution(platform, version);
      expect(test).to.equal(expectedDafnyDistribution);
    });
  });
});
