import { RailwayClient } from '../railway-client';

/*
 * This is minimal reproducible example showing that `serviceConnect` not works with team tokens.
 * It is important to note, that using exactly the same repo with exactly the same branch works
 * flawlessly using UI without additional connecting repo step (it was done manually in UI first).
 *
 * How to run:
 *  - install node 18.20.2 (https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
 *  - run `npm ci` in project root
 *  - run `TOKEN=<your-token-here> npx ts-node ./src/issues/service-connect-with-team-token.ts`
 *    - <your-token-here> is the Railway **TEAM** token used for API access
 *    - using personal token - works smoothly
 */

const railwayEndpoint = 'https://backboard.railway.app/graphql/v2';

const teamId: string | undefined = undefined;
// using existing project when need to simplify debugging
const existingProjectId: string | undefined = undefined;

function getToken(): string {
  if (process.env.TOKEN) {
    return process.env.TOKEN;
  }
  throw new Error(`'TOKEN' env var is required`);
}

async function main() {
  // creating fresh instance of railway client
  const client = new RailwayClient({
    token: getToken(),
    endpoint: railwayEndpoint
  });

  // creating new project if `existingProjectId` was not provided. Using `existingProjectId` helps to reduce amount of trash generated
  const projectId = existingProjectId ?? (await client.createProject({ name: `My-Project-${Date.now()}`, teamId }));
  console.log(`projectId: ${projectId}`);

  // works good! (deployment eventually will fail due to lack of env vars, but this is not relevant here)
  // this one here is just to check that at least something really works
  const postgresServiceId = await client.createService({
    projectId,
    name: `PG-${Date.now()}`,
    source: {
      image: 'postgis/postgis:11-3.3'
    }
  });
  console.log(`postgresServiceId: ${postgresServiceId}`);

  // works good. just creating empty service here. Connection to the repo will be set using `connectService` below
  const serviceId = await client.createService({
    projectId,
    name: `S-${Date.now()}`
  });
  console.log(`serviceId: ${serviceId}`);

  // works bad. This is where the issue is. This call when using team token ends up with a failure, while
  // perfectly works with personal accounts in personal dashboard
  await client.connectService({
    serviceId,
    // this repo needs to be authorized using first
    repo: '<your-repo-here>',
    branch: '<your-branch-here>'
  });

  console.log('Done connecting service');
}

main();
