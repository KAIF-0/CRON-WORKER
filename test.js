import { config } from 'dotenv';

config();
(async () => {  const parseProjects = () => {
    try {
      const parsed = JSON.parse(process.env.PRUNE_TARGETS ?? '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const pruneTargets = parseProjects();
  console.log("Prune targets:", pruneTargets);
  if(pruneTargets.length) {
    const { pruneAndRecordProjects } = await import('./src/db-functions.js');
    await pruneAndRecordProjects(pruneTargets, "23");
  }
})();