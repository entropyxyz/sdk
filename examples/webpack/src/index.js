import _ from 'lodash'
import Entropy from '@entropyxyz/x25519-chacha20poly1305-bundler'
function component() {
  const element = document.createElement('div')
  console.log(Entropy)

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ')

  return element
}

document.body.appendChild(component())
