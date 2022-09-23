const { dafnyURL, getDistribution } = require("../index");
const { expect } = require("chai");

describe("dafnyURL", () => {
  it("basic usage", () => {
    const test = dafnyURL("3.8.1", "win");
    expect(test).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/v3.8.1/dafny-3.8.1-x64-win.zip"
    );
  });

  it("nightly usage", () => {
    const test = dafnyURL("nightly-2022-09-23-2bc0042", "ubuntu-16.04");
    expect(test).to.equal(
      "https://github.com/dafny-lang/dafny/releases/download/nightly/dafny-nightly-2022-09-23-2bc0042-x64-ubuntu-16.04.zip"
    );
  });
});

describe("getDistribution", () => {
  // https://nodejs.org/docs/latest/api/os.html#os_os_platform
  [
    ["darwin", "osx-10.14.2"],
    ["win32", "win"],

    // Everything else is treated a ubuntu linux
    ["aix", "ubuntu-16.04"],
    ["freebsd", "ubuntu-16.04"],
    ["linux", "ubuntu-16.04"],
    ["openbsd", "ubuntu-16.04"],
    ["sunos", "ubuntu-16.04"],
  ].forEach(([platform, expectedDafnyDistribution]) => {
    it(`Platform: ${platform}`, () => {
      const test = getDistribution(platform);
      expect(test).to.equal(expectedDafnyDistribution);
    });
  });
});
