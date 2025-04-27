export default defineEventHandler(async () => {
  if (IS_DEV && useRuntimeConfig().delayResponse) {
    console.log('Delaying response');
    await sleep(50);
  }
});

export const sleep = (ms: number) => {
  return new Promise((re, _) => {
    setTimeout(re, ms);
  });
};
