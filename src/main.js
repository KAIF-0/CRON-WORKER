import { Client, Users } from 'node-appwrite';
import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  const URL = JSON.parse(process.env.URL);
  let number = Object.keys(URL).length;

  try {
    while (number) {
      const url = URL[`${number}`];
      log(`Executing cron job for URL: ${url}`);
      await axios.get(url)
        .then((response) => {
          log(`Cron job for ${url} executed successfully:`, response.data);
        })
        .catch((err) => {
          error(`Error executing cron job for ${url}:`, err.message);
        });
      number--;
    }
  } catch (err) {
    error("Could not list users: " + err.message);
  }

  return res.json({
    succes: true,
    message: `${number} cron jobs successfully executed!`,
  });
};



//for testing
// (async () => {
//   const { default: main } = await import('./main.js');
//   const req = {
//     headers: {
//       'x-appwrite-key': process.env.APPWRITE_FUNCTION_API_KEY,
//     },
//   };
//   const res = {
//     json: (data) => console.log('Response:', data),
//   };
//   const log = console.log;
//   const error = console.error;

//   await main({ req, res, log, error });
// })();
