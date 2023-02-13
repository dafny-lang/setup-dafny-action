const { dafnyURL, getDistribution } = require("../index");
const { expect } = require("chai");

describe("dafnyURL", () => {
  it("basic usage", async () => {
    const test = await dafnyURL("3.8.1", "win");
    expect(test).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/v3.8.1/dafny-3.8.1-x64-win.zip"
    );
  });

  it("nightly usage", async () => {
    const test = await dafnyURL("nightly-2022-09-23-2bc0042", "ubuntu-16.04");
    expect(test).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/nightly/dafny-nightly-2022-09-23-2bc0042-x64-ubuntu-16.04.zip"
    );
  });

  // TODO: Really we want to say "latest 3.x nightly" so that we don't automatically pick up major version bumps
  it("latest nightly usage", async () => {
    const test = await dafnyURL("nightly-latest", "ubuntu-16.04");
    expect(test).to.match(
      /^https:\/\/github.com\/dafny-lang\/dafny\/releases\/download\/nightly\/dafny-.*-nightly-/
    );
  });

  it("version 2.3.0", async () => {
    const test = await dafnyURL("2.3.0", "win");
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-osx-10.14.1.zip
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-ubuntu-16.04.zip
    // https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-win.zip
    expect(test).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/v2.3.0/dafny-2.3.0.10506-x64-win.zip"
    );
  });
});

describe("getDistribution", () => {
  // https://nodejs.org/docs/latest/api/os.html#os_os_platform
  [
    ["darwin", "3.8.1", "osx-10.14.2"],
    ["darwin", "2.3.0", "osx-10.14.1"],
    ["win32", "3.8.1", "win"],
    ["win32", "2.3.0", "win"],

    // Everything else is treated a ubuntu linux
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
