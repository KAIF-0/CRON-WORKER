import { Client, Databases, ID, Query } from 'node-appwrite';

const createClient = ({ endpoint, projectId, apiKey }) =>
  new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);

const pruneCollection = async (databases, databaseId, collectionId) => {
  for (;;) {
    const { documents } = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);
    if (!documents.length) break;
    for (const doc of documents) {
      await databases.deleteDocument(databaseId, collectionId, doc.$id);
    }
  }
};

const pruneAndRecord = async (
  { endpoint, projectId, apiKey, databaseId, collectionId, recordKey = 'number' },
  value,
) => {
  const client = createClient({ endpoint, projectId, apiKey });
  const databases = new Databases(client);
  await pruneCollection(databases, databaseId, collectionId);
  const data = recordKey ? { [recordKey]: value ?? Math.floor(Math.random() * 10) } : {};
  await databases.createDocument(databaseId, collectionId, ID.unique(), data);
};

export const pruneAndRecordProjects = async (projects, value="0") =>
  Promise.all(projects.map((project) => pruneAndRecord(project, value)));
