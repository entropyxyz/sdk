# Hello sdk dev!

This is your home base for how to develop on the project locally and process around that

## Branches

- `dev`
  in development
- `main`
  "stable" what is on npm

- `user-name/issue-number-short-title` (personal branches)
  for example `frankie/i123-docs`

all PRS go into `dev`

## versions

The SDK version must match a compatible [`entropy-core`](https://github.com/entropyxyz/entropy-core) version.

<!-- TODO: -->

| module            | tag               |
| ----------------- | ----------------- |
| `@entropyxyz/sdk` | `main` TODO       |
| `entropy-core`    | `release/v0.0.11` |

## When updating core version:

- [ ] change docker version in ./bin/ENTROPY_CORE_VERSION.sh
- [ ] generate types
      this usually can be done through `yarn generate:types` however if it fails because of docker you may need to call the spin-up script directly from the root directory and then call the generate types script and then the spin down script:
  - `dev/bin/spin-up.sh two-nodes`
  - `dev/bin/generate-types.sh`
  - `dev/bin/spin-down.sh two-nodes`
- [ ] run `yarn tsc` just to make sure that went "okay" or as okay as it can be. generated types are ignored in tsc check but are used in project (kind of not really if you fix it frankie will love you and that will secure you a seat at her round table)
- [ ] fix crate renaming etc in sdk
- [ ] run `yarn test`
- [ ] push up and PR

## Linting

We've got automated linting set up as a pre-commit hook.
Setup

- dependencies: `husky`, `pinst`, `lint-staged`
- files: `.husky/`

If you are blocked from committing, you can skip these hooks

```bash
git commit --no-verify
```

## Publishing

**Unfinished section**

Always publish from `stable` branch

- [ ] craft version pr for `dev` into `main`
- [ ] `yarn burn`
- [ ] `yarn build`
- [ ] `yarn test`

  - change logs should be hand written as apart of the version pr
  - `yarn version patch #or major.minor.patch`

  <!-- TO-DO: figure out with him an automated system -->

- [ ] minimum day ideally two day before ping @johnnymatthews on version bump pr set 48 hour timer
- [ ] after timer merge into main
- [ ] `git push origin main --tags`
- [ ] make sure we have a version tag
- [ ] check out version tag
- [ ] create a tag push to main? this might be handled by yarn needs to be checked
- [ ] `npm publish`

```bash
git checkout stable
yarn burn
yarn bundle
yarn version --patch # patch|minor|major
npm publish
git push origin stable --tags
```
