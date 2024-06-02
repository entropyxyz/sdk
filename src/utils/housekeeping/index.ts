



// maybe lodash maybe not?
// keep in mind registering can take over 20 seconds
// if we

/**
 * returns a deep copy of the object */
export function deepCopy (thing: any): any {
  return JSON.parse(JSON.stringify(thing))
}