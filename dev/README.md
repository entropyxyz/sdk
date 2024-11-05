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
127.0.0.1   charlie-tss-server
127.0.0.1   dave-tss-server
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
docker compose --file dev/docker-scripts/four-nodes.yaml down
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
docker compose --file dev/docker-scripts/four-nodes.yaml pull
```

## When updating core version:

1. change docker version in `./dev/bin/ENTROPY_CORE_VERSION.sh`
2. generate types: this usually can be done through `yarn generate:types`
   however if it fails because of docker you may need to call the spin-up script
   directly from the root directory and then call the generate types script and
   then the spin down script:

- `dev/bin/spin-up.sh four-nodes`
- `dev/bin/generate-types.sh`
- `dev/bin/spin-down.sh four-nodes`

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

## sdk "boot script"

For convenience, at [./deploy-faucets.mjs](./deploy-faucets.mjs ) is a script we use to "deploy" and fund the faucets for our entropy network. You can refer to this section of the README and the script itself to deploy your own faucets! Here it is running with a dev environment setup from the root of this project:

```bash
dev/bin/spin-up.sh four-nodes
```
I would take a deep breath here to allow for the 4 nodes to connect before running the next command bellow. On that note the deploy faucet script takes 3 arguments as you can see right now this script assumes you know what your doing if you are running it. So not a lot of bells and whitelist here.

the first argument is the `endpoint` to target, the second is the `fundingSeed` and the third `faucetLookUpSeed` <!--yes seeds()! not mnemonic go play alone this script will never take a mnemonic maybe one day i'll make it preterite to use like asci fireworks or something else integrated with the cli-->

```bash
node dev/deploy-facuets.mjs ws://127.0.0.1:9944 0x786ad0e2df456fe43dd1f91ebca22e235bc162e0bb8d53c633e8c85b2af68b7a 0x20423b5ff4984bcb8922483c98afb7eaa056c40fc431f8a314211e3d94a4222f

```
this example above should run in a dev enviroment the funding seed is eve and the report looks something like this and will log to your console:

```
{
  'jump start status at start': 'Ready',
  'using faucet program pointer': '0x3a1d45fecdee990925286ccce71f78693ff2bb27eae62adf8cfb7d3d61e142aa',
  'faucet program pointer from deployment': '0x3a1d45fecdee990925286ccce71f78693ff2bb27eae62adf8cfb7d3d61e142aa',
  'faucet config': {
    max_transfer_amount: 20000000000,
    genesis_hash: 'a4b29c6895ae775fd291377fde31882f66244eaecbdc81e017ebb64d13b27b72'
  },
  'initial balance for funding account': 99999880954644628n,
  'initial funding faucet amount': 24999970238661157n,
  'modifiableKeys on chain': [
    '0x03cd98af667e48b4912c66576f5cdf18aee3764c7aad1c40b9c61d5ac012acf1f6',
    '0x0228aba3e529d3b78b0cd7454a5f694eb09a648ec488b0b4b8ce7cd9abedd96c28',
    '0x03b7c87542f57895d37f1a37a3460e27ec74de7216e6ed48609ffd2fac976ea94a'
  ],
  'faucet look up address': '5EqZMUYz7jjaG2baQWJRzUzM7YhBP4E8TAj6GgqDqWdXriTn',
  faucets: [
    {
      vk: '0x03cd98af667e48b4912c66576f5cdf18aee3764c7aad1c40b9c61d5ac012acf1f6',
      address: '5Gm6JA2ikMK1FfNn3MRmUPLWfi4p6eBzcFtKE1dnJvQpJgpg',
      balance: '24,999,970,238,661,157'
    },
    {
      vk: '0x0228aba3e529d3b78b0cd7454a5f694eb09a648ec488b0b4b8ce7cd9abedd96c28',
      address: '5FqourMb6c3z4rogDnaBb36Ku53ndy3eCiSdjRg2TUAztJ3X',
      balance: '24,999,970,238,661,157'
    },
    {
      vk: '0x03b7c87542f57895d37f1a37a3460e27ec74de7216e6ed48609ffd2fac976ea94a',
      address: '5CUQuSMxTzx74Zb8gsDobhaYSte9vt9a3Db5X6oio4X1pSX1',
      balance: '24,999,970,238,661,157'
    }
  ],
  endpoint: 'ws://127.0.0.1:9944'
}
```