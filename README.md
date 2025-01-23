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
    dafny-version: "4.9.1"
```

You can also use `nightly-latest` to install the most recent nightly pre-release.

This action sets a DAFNY_VERSION environment variable for the benefit of subsequent steps
containing the actual resolved Dafny version: particularly useful for `nightly-latest`!

This action transparently works on macOS by detecting the running OS. You can
just set `runs-on` to a macOS virtual environment like `macos-latest`.

You can also build Dafny from source,
if you want to run against a branch of Dafny still in development:

```yml
- name: "Install Dafny"
  uses: dafny-lang/setup-dafny-action@v1
  with:
    dafny-version: "4.9.1"
    build-from-source: support-puppies-and-rainbows

```

`build-from-source` can be set to a branch name, tag, commit sha,
and so on: anything that `actions/checkout` understands.
Note that `dafny-version` is still currently required
in order to still set the `DAFNY_VERSION` environment variable,
as it is not automatically extracted from the built Dafny.
