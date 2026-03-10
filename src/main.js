import { Client, Users } from 'node-appwrite';
import dotenv from 'dotenv';
import axios from 'axios';
import { pruneAndRecordProjects } from './db-functions.js';
dotenv.config();

export default async ({ req, res, log, error }) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');
  const users = new Users(client);

  const URL = JSON.parse(process.env.URL);
  const total = Object.keys(URL).length;
  let number = total;

  const parseProjects = () => {
    try {
      const parsed = JSON.parse(process.env.PRUNE_TARGETS ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const pruneTargets = parseProjects(); 

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

    if (pruneTargets.length) await pruneAndRecordProjects(pruneTargets, String(total));
  } catch (err) {
    error("Could not list users: " + err.message);
  }

  return res.json({
    succes: true,
    message: `${number} cron jobs successfully executed!`,
  });
};
