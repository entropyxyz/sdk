import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execFileSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const moduleRoot = join(__dirname, '..')

// NOTE: you need to edit your /etc/hosts file to use these. See dev/README.md

export async function spinNetworkUp (networkType = 'two-nodes') {
  return new Promise((resolve, reject) => {
    try {
      execFileSync(
        'dev/bin/spin-up.sh',
        [networkType],
        { 
          shell: true, 
          cwd: moduleRoot,
          stdio: 'inherit'
        } // Use shell's search path.
      )
      resolve(true)

    } catch (err) {
      reject(err)
    }
  })
}

export async function spinNetworkDown (networkType = 'two-nodes') {
  return new Promise((resolve, reject) => {
    try {
      execFileSync(
        'dev/bin/spin-down.sh',
        [networkType],
        { 
          shell: true, 
          cwd: moduleRoot,
          stdio: 'inherit'
        } // Use shell's search path.
      )
      resolve(true)

    } catch (err) {
      reject(err)
    }
  })
}
