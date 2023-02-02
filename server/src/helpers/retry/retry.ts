const retryCount: number = 3;
const retryInterval: number = 1000;

export async function retry<T>(fn: () => Promise<T>): Promise<T> {
  let attempts = 0;
  while (attempts < retryCount) {
    try {
      return await fn();
    } catch (err) {
      attempts++;
      console.log(
        `Attempt ${attempts} failed. Error: ${err}. Retrying in ${retryInterval}ms...`
      );
      await new Promise(res => setTimeout(res, retryInterval));
    }
  }
  throw new Error(`Retry limit exceeded.`);
}
