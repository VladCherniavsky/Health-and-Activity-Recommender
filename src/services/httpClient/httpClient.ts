import axios, { type AxiosResponse } from 'axios';
import retry from 'async-retry';

const axiosOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const httpClient = {
  post: async (url: string, data: any, options?: any) => {
    const sendPost = async (): Promise<AxiosResponse> => {
      return axios.post(url, data, axiosOptions);
    };

    if (options?.retry) {
      return await retry(async () => {
        const retryResponse = await sendPost();

        if (retryResponse.data.statusCode !== 200) {
          throw retryResponse;
        }
        return retryResponse;
      }, options.retry);
    }
    return await sendPost();
  },
};
