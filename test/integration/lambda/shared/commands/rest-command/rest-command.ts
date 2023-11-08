import axios, { AxiosError, RawAxiosRequestHeaders } from "axios";
import { setTimeout } from "node:timers/promises";

import { RestCommandError } from "./rest-command-error";

export class RestCommand {
  constructor(private baseUrl: string) {}

  protected async getToCorsEndpoint<TResponse>(
    endpoint: string,
    corsOrigin: string
  ): Promise<TResponse> {
    return this.makeCorsRequest(endpoint, "GET", undefined, {
      origin: corsOrigin,
    });
  }

  protected async postToEndpoint<TResponse>(
    endpoint: string
  ): Promise<TResponse> {
    return await this.makeRequest(endpoint, "POST");
  }

  protected async patchToEndpoint<TResponse>(
    endpoint: string,
    headers?: RawAxiosRequestHeaders
  ): Promise<TResponse> {
    return await this.makeRequest(endpoint, "PATCH", undefined, headers);
  }

  protected async postToCorsEndpoint<TRequest, TResponse>(
    endpoint: string,
    corsOrigin: string,
    request: TRequest
  ): Promise<TResponse> {
    return await this.makeCorsRequest(endpoint, "POST", request, {
      origin: corsOrigin,
    });
  }

  protected async patchToCorsEndpoint<TRequest, TResponse>(
    endpoint: string,
    corsOrigin: string,
    request: TRequest,
    headers?: RawAxiosRequestHeaders
  ): Promise<TResponse> {
    let requestHeaders: RawAxiosRequestHeaders = { origin: corsOrigin };

    if (headers) {
      requestHeaders = {
        ...requestHeaders,
        ...headers,
      } as RawAxiosRequestHeaders;
    }

    return await this.makeCorsRequest(
      endpoint,
      "PATCH",
      request,
      requestHeaders
    );
  }

  private async makeRequest<TRequest, TResponse>(
    endpoint: string,
    method: string,
    data?: TRequest,
    headers?: RawAxiosRequestHeaders
  ): Promise<TResponse> {
    try {
      await setTimeout(1000);

      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method,
        data,
        headers,
      });

      return response.data as TResponse;
    } catch (e) {
      const axioError = (e as AxiosError<TResponse, TResponse>).response;
      throw new RestCommandError(axioError?.status, axioError?.data);
    }
  }

  private async makeCorsRequest<TRequest, TResponse>(
    endpoint: string,
    method: string,
    data?: TRequest,
    headers?: RawAxiosRequestHeaders
  ): Promise<TResponse> {
    try {
      await setTimeout(1000);

      const response = await axios({
        url: `${this.baseUrl}/${endpoint}`,
        method,
        data,
        headers,
      });

      return response.data as TResponse;
    } catch (e) {
      const axioError = (e as AxiosError<TResponse, TResponse>).response;
      throw new RestCommandError(axioError?.status, axioError?.data);
    }
  }
}
