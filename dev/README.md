# Hello sdk dev!

### When updating core version:

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

### When publishing

- [ ] run: `yarn burn`
- [ ] run: `yarn lint --fix`
- [ ] run: `yarn bundle`
- [ ] run: `yarn version --patch` (or whatever)
- [ ] run: `npm publish`
