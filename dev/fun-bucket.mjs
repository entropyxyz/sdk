const monkeys = ['🙉 - pandemonium', '🙈 - chaos', '🙊 - anarchy', '🐵 - entropy']
/**
 * starts a monkey animation
 * @returns {function} to stop animation
**/
export function evilMonkeyAnimation () {
  const clear = () => process.stdout.write("\r\x1b[K")
  let frame = 0
  process.stdout.write(monkeys[frame])
  ++frame
  const animate = setInterval(() => {
    clear()
    process.stdout.write(monkeys[frame])
    if (frame === 3) frame = 0
    else ++frame
  }, 1000)
  return () => {
    clearInterval(animate)
  }
}