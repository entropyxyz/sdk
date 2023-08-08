
export function sleep(delay: number) {
    const start = new Date().getTime()
    while (new Date().getTime() < start + delay);
  }