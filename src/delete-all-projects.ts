import { RailwayClient } from './railway-client';

const railwayEndpoint = 'https://backboard.railway.app/graphql/v2';

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

  const projects = await client.listProjects();
  console.log(`Got projects: ${JSON.stringify(projects, null, 2)}`);
}

main();
