# Hello sdk dev!

## When updating core version:

- [ ] change docker version in ./bin/ENTROPY_CORE_VERSION.sh
- [ ] generate types
      this usually can be done through `yarn generate:types` however if it fails because of docker you may need to call the spin-up script directly from the root directory and then call the generate types script and then the spin down script:
  - `dev/bin/spin-up.sh two-nodes`
  - `dev/bin/generate-types.sh`
  - `dev/bin/spin-down.sh two-nodes`
- [ ] run `yarn tsc` just to make sure that went "okay" or as okay as it can be. generated types are ignored in tsc check but are used in project (kind of not really if you fix it frankie will love you and that will secure you a seat at her round table)
- [ ] fix crate renamings etc in sdk
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

## Tests

For the tests to run you **must** edit your `/etc/hosts` file, adding:

```
127.0.0.1 alice-tss-server
127.0.0.1 bob-tss-server
```

The tests use docker to spin up test networks to run against.
Sometimes when interupted docker containers will be left runnin in the background, meaning you don't get a "clean" startup, and your tests will fail (saying things like "ERROR that program is already deployed boo").

Have a look what's running:

```bash
docker ps
```

Close them down like this (for example):

```bash
docker compose --file dev/docker-scripts/two-nodes.yaml down
```

## Publishing

Always publish from `stable` branch

```bash
git checkout stable
yarn burn
yarn
yarn bundle
yarn version --patch # patch|minor|major
npm publish
git push origin stable --tags
```
