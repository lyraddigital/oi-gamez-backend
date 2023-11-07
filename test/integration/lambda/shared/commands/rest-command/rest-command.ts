import axios, { AxiosError } from "axios";

import { RestCommandError } from "./rest-command-error";

export class RestCommand {
  constructor(private baseUrl: string) {}

  protected async getToCorsEndpoint<TResponse>(
    endpoint: string,
    corsOrigin: string
  ): Promise<TResponse> {
    return this.makeCorsRequest(endpoint, corsOrigin, "GET");
  }

  protected async postToEndpoint<TResponse>(
    endpoint: string
  ): Promise<TResponse> {
    return await this.makeRequest(endpoint, "POST");
  }

  protected async postToCorsEndpoint<TRequest, TResponse>(
    endpoint: string,
    corsOrigin: string,
    request: TRequest
  ): Promise<TResponse> {
    return await this.makeCorsRequest(endpoint, corsOrigin, "POST", request);
  }

  private async makeRequest<TRequest, TResponse>(
    endpoint: string,
    method: string,
    data?: TRequest
  ): Promise<TResponse> {
    try {
      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method,
        data,
      });

      return response.data as TResponse;
    } catch (e) {
      const axioError = (e as AxiosError<TResponse, TResponse>).response;
      throw new RestCommandError(axioError?.status, axioError?.data);
    }
  }

  private async makeCorsRequest<TRequest, TResponse>(
    endpoint: string,
    corsOrigin: string,
    method: string,
    data?: TRequest
  ): Promise<TResponse> {
    try {
      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method,
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
