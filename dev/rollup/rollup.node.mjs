import nodeResolve from "@rollup/plugin-node-resolve";
// import { wasm } from "@rollup/plugin-wasm";
// import stripCode from "rollup-plugin-strip-code"
// import copy from 'rollup-plugin-copy';
// import replace from '@rollup/plugin-replace';

import Base from "./rollup.base.mjs";

const nodePlugins = [
  nodeResolve({
    browser: false,
    preferBuiltins: true,
    // resolveOnly: ['anoncreds-node', 'didcomm-node'],
  }),
  // replace({
  //   preventAssignment: true,
  //   values: {
  //     'didcomm_js_bg.wasm': "../node-wasm/didcomm.wasm",
  //     'anoncreds_wasm_bg.wasm': "../node-wasm/anoncreds.wasm",
  //   }
  // }),
  // copy({
  //   targets: [
  //     { src: "./externals/generated/anoncreds-wasm-node/anoncreds_wasm_bg.wasm", dest: "build/node-wasm", rename: "anoncreds.wasm" },
  //     { src: "./externals/generated/didcomm-wasm-node/didcomm_js_bg.wasm", dest: "build/node-wasm", rename: 'didcomm.wasm' },
  //   ],
  // }),
  // wasm({
  //   targetEnv: "node",
  //   fileName: "[name][extname]",
  //   maxFileSize: 0
  // }),
  // stripCode({
  //   start_comment: 'START.BROWSER_ONLY',
  //   end_comment: 'END.BROWSER_ONLY'
  // }),
]

const outputs = [
  {
    dir: "dist/node",
    format: "es",
    entryFileNames: "[name].mjs"
  },
  {
    dir: "dist/node",
    format: "cjs",
    entryFileNames: "[name].cjs"
  }
]
export default Base(
  outputs,
  nodePlugins
);
