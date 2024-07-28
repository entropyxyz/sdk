# Hello sdk dev!

This is your home base for how to develop on the project locally and process around that

## Branches

- `dev`
  in development
- `main`
  "stable" what is on npm

- `<name>/<issue_number>-<short_title>` (personal branches)
  for example `frankie/i123-docs`

all PRS go into `dev`

## Versions

The SDK version must match a compatible [`entropy-core`](https://github.com/entropyxyz/entropy-core) version.

<!-- TODO: -->

| module            | tag               |
| ----------------- | ----------------- |
| `@entropyxyz/sdk` | `main` TODO       |
| `entropy-core`    | `release/v0.0.12` |


## Tests

For the tests to run you **must** edit your `/etc/hosts` file, adding:

```
127.0.0.1   alice-tss-server
127.0.0.1   bob-tss-server
127.0.0.1   dave-tss-server
127.0.0.1   eve-tss-server
```

### Gotcha 1 - dirty docker

The tests use docker to spin up test networks to run against. Sometimes when
interupted docker containers will be left running in the background, meaning you
don't get a "clean" startup, and your tests will fail (saying things like "ERROR
that program is already deployed boo").

Have a look what's running:

```bash
docker container list
```

You can close them down like this:

```bash
docker compose --file dev/docker-scripts/two-nodes.yaml down
```

### Gotcha 2 - ports still in use?

Is something still using port 9944?

```bash
ps auxw | grep 9944
```

NOTE: this just kills + removes everything

```bash
docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)
```

### Gotcha 3 - `latest` tag

If you use the `latest` tag ... this is a moving target

```bash
export ENTROPY_CORE_VERSION=latest
```

If you must do this you should run

```bash
docker compose --file dev/docker-scripts/two-nodes.yaml pull
```

## When updating core version:

1. change docker version in `./dev/bin/ENTROPY_CORE_VERSION.sh`
2. generate types: this usually can be done through `yarn generate:types`
   however if it fails because of docker you may need to call the spin-up script
   directly from the root directory and then call the generate types script and
   then the spin down script:

- `dev/bin/spin-up.sh two-nodes`
- `dev/bin/generate-types.sh`
- `dev/bin/spin-down.sh two-nodes`

2. run `yarn tsc` just to make sure that went "okay" or as okay as it can be.
   generated types are ignored in tsc check but are used in project (kind of not
   really if you fix it frankie will love you and that will secure you a seat at
   her round table)
   3 [ ] fix crate renamings etc in sdk
3. [ ] run `yarn test`
4. [ ] push up and PR

## Linting

We've got automated linting set up as a pre-commit hook.
Setup

- dependencies: `husky`, `pinst`, `lint-staged`
- files: `.husky/`

If you are blocked from committing, you can skip these hooks

```bash
git commit --no-verify
```

## Cutting a new release

- [ ] Check out new version branch `release/v#Number` example: `release/v0.2.0`
- [ ] Update CHANGELOG
  - change logs should be hand written as apart of the version pr
- [ ] update package.json
  - `yarn version patch #or major.minor.patch`
- [ ] merge release branch into main and push tag
- [ ] `git push origin main --tags`

### Publish from version tag

- [ ] check out version tag
- [ ] `yarn burn`
- [ ] `yarn build`
- [ ] `yarn test`


  <!-- TO-DO: figure out with him an automated system -->

- [ ] minimum day ideally two day before ping @johnnymatthews on version bump pr set 48 hour timer
- [ ] after timer merge into main
- [ ] make sure we have a version tag
- [ ] `npm publish`
- [ ] create release on github

```bash
git checkout $version-tag
yarn burn
yarn
yarn version --patch # patch|minor|major
npm publish
```
