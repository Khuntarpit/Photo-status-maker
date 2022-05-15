import axios from "axios";
import { useQuery, useMutation, QueryClient } from "react-query";

const client = axios.create({
  baseURL: "http://localhost:8000/api",
});

const queryClient = new QueryClient();

export const useFetch = (url, params, config) => {
  return useQuery([url, params], ({ queryKey }) => getData({ queryKey }), {
    enabled: !!url,
    ...config,
  });
};

export const usePost = (url, params, updater) => {
  return useGenericMutation(
    (data) => postData({ url, data }),
    url,
    params,
    updater
  );
};

export const useDelete = (url, params, updater) => {
  return useGenericMutation(
    (id) => deleteData(url + id),
    url,
    params,
    updater
  );
};

const useGenericMutation = (func, url, params, updater) => {
  return useMutation(func, {
    onMutate: async (data) => {
      await queryClient.cancelQueries([url, params]);
      const previousData = queryClient.getQueryData([url, params]);
      queryClient.setQueryData([url, params], (oldData) => {
        return updater ? (oldData, data) : data;
      });
      return previousData;
    },
    onError: (err, _, context) => {
      queryClient.setQueryData([url, params], context);
    },
    onSettled: () => {
      queryClient.invalidateQueries([url, params]);
    },
  });
};

export const getData = async ({ queryKey, pageParam }) => {
  const [url, params] = queryKey;
  return await client
    .get(url, { params: { ...params, pageParam } })
    .then((res) => res.data);
};

export const postData = async ({ url, data }) => {
  return await client.post(url, data).then((res) => res.data);
};

export const deleteData = async (url) => {
  return await client.delete(url).then((res) => res.data);
};
