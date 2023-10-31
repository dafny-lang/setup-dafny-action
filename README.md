# Install Dafny

[![Validate action](https://github.com/dafny-lang/setup-dafny-action/actions/workflows/main.yml/badge.svg)](https://github.com/dafny-lang/setup-dafny-action/actions/workflows/main.yml)

A GitHub Action to download a binary release of Dafny and add it to the system
`$PATH`.

```yml
- name: "Install Dafny"
  uses: dafny-lang/setup-dafny-action@v1
```

If you need to use a specific version:

```yml
- name: "Install Dafny"
  uses: dafny-lang/setup-dafny-action@v1
  with:
    dafny-version: "2.3.0"
```

You can also use `nightly-latest` to install the most recent nightly pre-release.

This action sets a DAFNY_VERSION environment variable for the benefit of subsequent steps
containing the actual resolved Dafny version: particularly useful for `nightly-latest`!

This action transparently works on macOS by detecting the running OS. You can
just set `runs-on` to a macOS virtual environment like `macos-latest`.
