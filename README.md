# Install Dafny

A GitHub Action to download a binary release of Dafny and add it the system
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
    version: "2.3.0"
```
