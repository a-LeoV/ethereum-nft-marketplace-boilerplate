import { useWeb3ExecuteFunction } from "react-moralis";

export const useWeb3Contract = (options) => {
  const {
    data: contractResponse,
    error,
    fetch: runContractFunction,
    isFetching: isRunning,
    isLoading,
  } = useWeb3ExecuteFunction(options);

  return { runContractFunction, contractResponse, error, isRunning, isLoading };
};
