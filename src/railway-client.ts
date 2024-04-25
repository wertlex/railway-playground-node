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

  private getAuthorizationHeaders(token: string): Record<'Authorization', string> {
    return {
      Authorization: `Bearer ${token}`
    };
  }
}
