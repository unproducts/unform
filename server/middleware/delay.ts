export default defineEventHandler(async () => {
  if (IS_DEV && useRuntimeConfig().delayResponse) {
    await sleep(1000);
  }
});

export const sleep = (ms: number) => {
  return new Promise((re, _) => {
    setTimeout(re, ms);
  });
};
