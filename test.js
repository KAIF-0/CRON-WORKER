// for testing
(async () => {
  const { default: main } = await import('./src/main.js');
  const req = {
    headers: {
      'x-appwrite-key': process.env.APPWRITE_FUNCTION_API_KEY,
    },
  };
  const res = {
    json: (data) => console.log('Response:', data),
  };
  const log = console.log;
  const error = console.error;

  await main({ req, res, log, error });
})();
