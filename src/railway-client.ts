import axios from 'axios';

type RailwayClientConfig = Readonly<{
  endpoint: string;
  token: string;
  teamId?: string;
}>;

type CreateProjectInput = Readonly<{
  name: string;
  teamId?: string;
}>;

type CreateServiceInput = Readonly<{
  name: string;
  projectId: string;
  branch?: string;
  source?: {
    image?: string;
    repo?: string;
  };
}>;

type ConnectServiceInput = Readonly<{
  serviceId: string;
  branch?: string;
  image?: string;
  repo?: string;
}>;

type GetProjectDefaultEnvironmentInput = Readonly<{
  projectId: string;
}>;

type ProjectData = {
  id: string;
  name: string;
};

export class RailwayClient {
  private readonly config: RailwayClientConfig;

  constructor(config: RailwayClientConfig) {
    this.config = config;
  }

  async createProject(input: CreateProjectInput): Promise<string> {
    const query = `
      mutation ProjectCreate($projectCreateInput: ProjectCreateInput!) {
        projectCreate(input: $projectCreateInput) {
          id
        }
      }
    `;

    const requestBody = {
      query,
      variables: {
        projectCreateInput: {
          name: input.name,
          teamId: input.teamId
        }
      }
    };

    const result = await axios.post(this.config.endpoint, requestBody, {
      headers: this.getAuthorizationHeaders(this.config.token),
      validateStatus: null
    });

    if (typeof result.data?.data?.projectCreate?.id === 'string') {
      return result.data.data.projectCreate.id;
    }

    if (Array.isArray(result.data?.errors) && result.data.errors.length > 0) {
      throw new Error(`Got an error: ${JSON.stringify(result.data.errors, null, 2)}`);
    }

    throw new Error(`Unexpected response from server`);
  }

  async listProjects(): Promise<ProjectData[]> {
    const query = `
      query ListProjects {
        projects {
          edges {
              node {
                  id
                  name
              }
          }
        }
      }
    `;

    const requestBody = {
      query
    };

    const result = await axios.post(this.config.endpoint, requestBody, {
      headers: this.getAuthorizationHeaders(this.config.token),
      validateStatus: null
    });

    const maybeEdges = result.data?.data?.projects?.edges;
    if (Array.isArray(maybeEdges)) {
      return maybeEdges.map(edge => edge.node);
    }

    if (Array.isArray(result.data?.errors) && result.data.errors.length > 0) {
      throw new Error(`Got an error: ${JSON.stringify(result.data.errors, null, 2)}`);
    }

    throw new Error(`Unexpected response from server`);
  }

  async createService(input: CreateServiceInput): Promise<string> {
    const query = `
      mutation ServiceCreate($serviceCreateInput: ServiceCreateInput!) {
        serviceCreate(input: $serviceCreateInput) {
          id
        }
      }
    `;

    const requestBody = {
      query,
      variables: {
        serviceCreateInput: {
          projectId: input.projectId,
          name: input.name,
          branch: input.branch,
          source: {
            image: input.source?.image,
            repo: input.source?.repo
          }
        }
      }
    };

    const result = await axios.post(this.config.endpoint, requestBody, {
      headers: this.getAuthorizationHeaders(this.config.token),
      validateStatus: null
    });

    if (typeof result.data?.data?.serviceCreate?.id === 'string') {
      return result.data.data.serviceCreate.id;
    }

    if (Array.isArray(result.data?.errors) && result.data.errors.length > 0) {
      throw new Error(`Got an error: ${JSON.stringify(result.data.errors, null, 2)}`);
    }

    throw new Error(`Unexpected response from server`);
  }

  async connectService(input: ConnectServiceInput): Promise<void> {
    const query = `
      mutation ServiceConnect($id: String!, $serviceConnectInput: ServiceConnectInput!) {
        serviceConnect(id: $id, input: $serviceConnectInput) {
          id
        }
      }
    `;

    const requestBody = {
      query,
      variables: {
        id: input.serviceId,
        serviceConnectInput: {
          branch: input.branch,
          image: input.image,
          repo: input.repo
        }
      }
    };

    const result = await axios.post(this.config.endpoint, requestBody, {
      headers: this.getAuthorizationHeaders(this.config.token),
      validateStatus: null
    });

    if (typeof result.data?.data?.serviceConnect?.id === 'string') {
      return result.data.data.serviceConnect.id;
    }

    if (Array.isArray(result.data?.errors) && result.data.errors.length > 0) {
      throw new Error(`Got an error: ${JSON.stringify(result.data.errors, null, 2)}`);
    }

    throw new Error(`Unexpected response from server`);
  }

  async getProjectDefaultEnvironmentId(input: GetProjectDefaultEnvironmentInput): Promise<string> {
    const query = `
      query GetProject($id: String!) {
        project(id: $id) {
          id
          environments {
              edges {
                  node {
                      createdAt
                      id
                      name
                  }
              }
          }
        }
      }
    `;

    const requestBody = {
      query,
      variables: {
        id: input.projectId
      }
    };

    const result = await axios.post(this.config.endpoint, requestBody, {
      headers: this.getAuthorizationHeaders(this.config.token),
      validateStatus: null
    });

    const maybeEdges = result.data?.data?.project?.environments?.edges;
    if (Array.isArray(maybeEdges) && maybeEdges.length > 0) {
      // considering that oldest one is default
      const sortedEdges = [...maybeEdges].sort((a, b) => {
        const aDate = new Date(a.node.createdAt);
        const bDate = new Date(b.node.createdAt);
        if (aDate < bDate) return -1;
        if (aDate > bDate) return 1;
        return 0;
      });

      return sortedEdges[0].node.id;
    }

    if (Array.isArray(result.data?.errors) && result.data.errors.length > 0) {
      throw new Error(`Got an error: ${JSON.stringify(result.data.errors, null, 2)}`);
    }

    throw new Error(`Unexpected response from server`);
  }

  private getAuthorizationHeaders(token: string): Record<'Authorization', string> {
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
