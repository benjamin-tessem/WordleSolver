import useSWR from "swr";

const WORD_LIST =
  "https://raw.githubusercontent.com/tabatkins/wordle-list/main/words";

const fetcher = async (
  input: RequestInfo,
  init?: RequestInit
): Promise<string> => {
  const res = await fetch(input, init);
  return res.text();
};

const useWordList = () => {
  const { data, error, mutate } = useSWR<string>(WORD_LIST, fetcher);
  const wordList = data?.split("\n").filter(Boolean);

  return {
    wordList,
    error,
    mutate,
    isLoading: !wordList && !error,
  };
};

export default useWordList;
