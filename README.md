# dafny-install-action

A GitHub Action to download Dafny and add it the system `$PATH`.

```yml
- name: "Install Dafny"
  uses: tchajed/dafny-install-action@v1
```

If you need to use a specific version:

```yml
- name: "Install Dafny"
  uses: tchajed/dafny-install-action@v1
  with:
    version: "2.3.0"
```
