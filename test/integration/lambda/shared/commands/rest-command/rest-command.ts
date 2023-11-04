import axios, { AxiosError } from "axios";

import { RestCommandError } from "./rest-command-error";

export class RestCommand {
  constructor(private baseUrl: string) {}

  protected async postToEndpoint<TResponse>(
    endpoint: string
  ): Promise<TResponse> {
    return await this.makePost(endpoint);
  }

  protected async postToCorsEndpoint<TResponse>(
    endpoint: string,
    corsOrigin: string
  ): Promise<TResponse> {
    return await this.makeCorsPost(endpoint, corsOrigin);
  }

  private async makePost<TRequest, TResponse>(
    endpoint: string,
    data?: TRequest
  ): Promise<TResponse> {
    try {
      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method: "POST",
        data,
      });

      return response.data as TResponse;
    } catch (e) {
      const axioError = (e as AxiosError<TResponse, TResponse>).response;
      throw new RestCommandError(axioError?.status, axioError?.data);
    }
  }

  private async makeCorsPost<TRequest, TResponse>(
    endpoint: string,
    corsOrigin: string,
    data?: TRequest
  ): Promise<TResponse> {
    try {
      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method: "POST",
        data,
        headers: {
          origin: corsOrigin,
        },
      });

      return response.data as TResponse;
    } catch (e) {
      const axioError = (e as AxiosError<TResponse, TResponse>).response;
      throw new RestCommandError(axioError?.status, axioError?.data);
    }
  }
}
