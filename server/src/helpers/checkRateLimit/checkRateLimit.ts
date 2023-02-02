let rateLimit: number = 1000;
let rateLimitStartTime!: number;
let rateLimitEndTime!: number;
let requestsCount: number = 0;

export async function checkRateLimit(): Promise<void> {
  if (rateLimitStartTime && Date.now() < rateLimitEndTime) {
    const timeToWait = rateLimitEndTime - Date.now();
    console.log(`Waiting ${timeToWait}ms`);
    await new Promise(res => setTimeout(res, timeToWait));
  }
  rateLimitStartTime = Date.now();
  rateLimitEndTime = rateLimitStartTime + rateLimit;
  requestsCount++;
  if (requestsCount % 1000 === 0) {
    rateLimit = rateLimit * 2;
    requestsCount = 0;
  }
}
