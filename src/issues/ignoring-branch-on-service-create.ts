import { RailwayClient } from '../railway-client';

/*
 * This is minimal reproducible example showing that `branch` parameter of `serviceCreate` is ignored.
 */

const railwayEndpoint = 'https://backboard.railway.app/graphql/v2';

// using existing project when need to simplify debugging
const existingProjectId: string | undefined = undefined;

function getToken(): string {
  if (process.env.TOKEN) {
    return process.env.TOKEN;
  }
  throw new Error(`'TOKEN' env var is required`);
}

async function main() {
  const client = new RailwayClient({
    token: getToken(),
    endpoint: railwayEndpoint
  });

  const projectId = existingProjectId ?? (await client.createProject({ name: `My-Project-${Date.now()}` }));
  console.log(`projectId: ${projectId}`);

  // works good! (deployment eventually will failed due to lack of env vars, but this is not relevant here)
  const postgresServiceId = await client.createService({
    projectId,
    name: `PG-${Date.now()}`,
    source: {
      image: 'postgis/postgis:11-3.3'
    }
  });
  console.log(`postgresServiceId: ${postgresServiceId}`);

  // `branch` value is completely ignored (check UI)
  const serviceId = await client.createService({
    projectId,
    name: `S-${Date.now()}`,
    branch: 'TC-6461_file-storage-in-railway', // this parameter has no effect
    source: {
      repo: ''
    }
  });
  console.log(`serviceId: ${serviceId}`);
}

main();
