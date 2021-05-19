# Install Dafny

[![Validate 'setup-dafny-action'](https://github.com/tchajed/setup-dafny-action/actions/workflows/main.yml/badge.svg)](https://github.com/tchajed/setup-dafny-action/actions/workflows/main.yml)

A GitHub Action to download a binary release of Dafny and add it to the system
`$PATH`.

```yml
- name: "Install Dafny"
  uses: tchajed/setup-dafny-action@v1
```

If you need to use a specific version:

```yml
- name: "Install Dafny"
  uses: tchajed/setup-dafny-action@v1
  with:
    dafny-version: "2.3.0"
```

This action transparently works on macOS by detecting the running OS. You can
just set `runs-on` to a macOS virtual environment like `macos-latest`.
