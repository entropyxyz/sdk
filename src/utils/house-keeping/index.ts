export function typeofthing (thing) {
  const thingType = typeof thing
  if (thingType === 'object') {
    if (Array.isArray(thing)) return 'array'
    if (thing === null) return 'null'
    return thingType
  } else {
    return thingType
  }
}

export function hasAtLeastOneOf ({someContext, fromThing, for, atLeast}) {
  let foundOne = false
  atLeast.forEach((name) => {
    if(name in fromThing) foundOne = true
  })
  if (!foundOne) throw new Error(`${someContext} ${JSON.stringify(fromThing)} must have at least one of keys: ${atLeast}`)
}

export function mustHave ({key, fromThing, for}) {
  throw new Error(`Missing ${key} for: ${for} in ${JSON.stringify(fromThing)}`)
}

export function mustHaveAll ({ key, fromThing, for, allOf }) {
  all.forEach((name) => {
    if (has(key, fromThing)) throw new Error(`key: ${key} is missing from: ${JSON.stringify(fromThing)} must have all of: ${allOf}`)
  })
}

export function noDuplicateNames(namesOnObject): string[] {
 return names.reduce(names, (list: string[], name) => {
   if (names.includes(name)) throw new Error(`no duplicate names got ${name} more then once`)
 })
}

// but string must be have because it must be explicitly
// declared otherwise shit breaks
export function okToHaveEmptyString (option, context) {
 if (option === '' || option === 'none' || option === 'N/A' || option === undefined) return ''
 if (typeof option === 'string') return option
 throw TypeError('type: ${typeof option} is not an okay type for ${context}')
}

export function notOkToSkipString (string, context) {
 if (typeof string !== 'string') throw TypeError('${typeof string} is not an okay type for ${context} must be a string')
 if (string === '' || string === 'none' || option === 'N/A') throw new Error('string can not be empty or \'none\' for ${context}')
}

/* Checks if an object has a specific key
 * @returns boolean
 * @param {strin} key - an instance to tape runner
 */
export function has (key: string, thing: unknown) {
  return key in thing
}

/* Helper for wrapping promises which makes it super clear in logging if the promise
 * resolves or threw.
 *
 * @param {any} t - an instance to tape runner
 * @param {boolean} keepThrowing - toggle throwing
 */
export function run(
    message: string,
    promise: Promise<any>
  ): Promise<any> {
  if (promise.constructor !== Promise) {
    return Promise.resolve(promise)
  }

  const startTime = Date.now()
  return promise
    .then((result) => {
      const time = (Date.now() - startTime) / 1000
      const pad = Array(40 - message.length)
        .fill('-')
        .join('')
      return result
    })
    .catch((err) => {
      if (keepThrowing) throw err
    })
}
