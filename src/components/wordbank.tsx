import React, { memo, useEffect, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import chunk from "lodash.chunk";
import useWordList from "../hooks/useWordlist";

interface WordBankProps {
  allowedLetters: string[];
  blockedLetters: string[];
}

const ITEM_LENGTH = 68;

const WordBank: React.FC<WordBankProps> = ({
  allowedLetters,
  blockedLetters,
}) => {
  const { wordList, isLoading, error } = useWordList();
  const [words, setWords] = useState<string[]>([]);

  // Prevent lag when filtering thousands of words

  useEffect(() => {
    if (allowedLetters.length > 0 || blockedLetters.length > 0) {
      const cleanedWords = wordList?.filter((word) => {
        return blockedLetters.every((letter) => !word.includes(letter));
      });
      // Remove all words that don't have all allowed letters
      const filteredWords = cleanedWords?.filter((word) => {
        return allowedLetters.every((letter) => word.includes(letter));
      });
      // Split filteredWords into chunks of 5
      //const chunkedWords = chunk(filteredWords, 5);
      setWords(filteredWords ?? []);
    }
    // The hook was refreshing this far to often, so we will only run this when the other props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedLetters, blockedLetters]);

  if (isLoading) {
    // Create Skeleton for Loading
    return (
      <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-slate-700 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-700 rounded col-span-2"></div>
                <div className="h-2 bg-slate-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    // Create Error Message
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }

  return (
    // 4 Columns
    <div className="w-2/3 h-full">
      <div className="rounded-md border-2 border-gray-700 text-white text-xl h-full flex">
        {(allowedLetters.length > 0 || blockedLetters.length > 0) &&
        words.length !== 0 ? (
          <div className="flex flex-auto h-full">
            <AutoSizer disableHeight>
              {({ width }) => {
                const chunked = chunk(words, Math.floor(width / ITEM_LENGTH));
                return (
                  <List
                    height={300}
                    itemCount={chunked.length}
                    itemSize={30}
                    width={width}
                  >
                    {({ index, style }) => (
                      <div className="flex w-full" style={style}>
                        {chunked[index].map((word) => (
                          <div
                            className="m-2 capitalize w-[68px] text-center"
                            key={word}
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    )}
                  </List>
                );
              }}
            </AutoSizer>
          </div>
        ) : (
          <div className="m-2 flex align-middle justify-center content-center w-full">
            <div>
              <p>No Words Found</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(WordBank);
