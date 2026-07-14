import type {
  RequestConfig,
  ResponseConfig,
  ResponseErrorConfig,
} from '@kubb/plugin-client/clients/axios';
import { api } from '@/lib/axios';

export type { RequestConfig, ResponseConfig, ResponseErrorConfig };

/**
 * Client Axios compartilhado usado pelo código gerado pelo Kubb.
 */
export async function client<
  TResponseData,
  TError = unknown,
  TRequestData = unknown,
>(
  config: RequestConfig<TRequestData>,
): Promise<ResponseConfig<TResponseData>> {
  try {
    const response = await api.request<TRequestData, ResponseConfig<TResponseData>>({
      ...config,
    });
    return response;
  } catch (error) {
    throw error as ResponseErrorConfig<TError>;
  }
}

export default client;
