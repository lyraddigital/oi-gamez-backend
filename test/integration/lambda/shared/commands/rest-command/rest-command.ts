import axios from "axios";

export class RestCommand {
  constructor(private baseUrl: string) {}

  protected async postToEndpoint<TResponse>(
    endpoint: string
  ): Promise<TResponse> {
    return await this.makePost(endpoint);
  }

  private async makePost<TResponse>(endpoint: string): Promise<TResponse> {
    const response = await axios({
      url: `${this.baseUrl}/${endpoint}`,
      method: "POST",
    });

    return response.data as TResponse;
  }
}
