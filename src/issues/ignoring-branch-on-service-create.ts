import { RailwayClient } from '../railway-client';

/*
 * This is minimal reproducible example showing that `branch` parameter of `serviceCreate` is ignored.
 *
 * How to run:
 *  - install node 18.20.2 (https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
 *  - run `npm ci` in project root
 *  - run `TOKEN=<your-token-here> npx ts-node ./src/issues/ignoring-branch-on-service-create.ts`
 *    - <your-token-here> is the Railway token used for API access
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

  const projectId = existingProjectId ?? (await client.projectCreate({ name: `My-Project-${Date.now()}` }));
  console.log(`projectId: ${projectId}`);

  // works good! (deployment eventually will fail due to lack of env vars, but this is not relevant here)
  const postgresServiceId = await client.serviceCreate({
    projectId,
    name: `PG-${Date.now()}`,
    source: {
      image: 'postgis/postgis:11-3.3'
    }
  });
  console.log(`postgresServiceId: ${postgresServiceId}`);

  // `branch` value is completely ignored (check UI)
  const serviceId = await client.serviceCreate({
    projectId,
    name: `S-${Date.now()}`,
    branch: 'main', // this parameter has no effect
    source: {
      repo: 'wertlex/railway-playground-node'
    }
  });
  console.log(`serviceId: ${serviceId}`);
}

main();
