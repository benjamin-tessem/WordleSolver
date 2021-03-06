import React, { memo, useEffect, useState } from "react";

import AutoSizer from "react-virtualized-auto-sizer";
import { LetterTypes } from "../App";
import { FixedSizeList as List } from "react-window";
import chunk from "lodash.chunk";
import useWordList from "../hooks/useWordlist";

interface WordBankProps {
  allowedLetters: LetterTypes[];
  blockedLetters: string[];
  exactPlacement?: boolean;
}

const ITEM_LENGTH = 68;

const WordBank: React.FC<WordBankProps> = ({
  allowedLetters,
  blockedLetters,
  exactPlacement,
}) => {
  const { wordList, isLoading, error } = useWordList();
  const [words, setWords] = useState<string[]>([]);
  const [exactPositionWords, setExactPositionWords] = useState<string[]>([]);

  // Prevent lag when filtering thousands of words

  useEffect(() => {
    if (allowedLetters.length > 0 || blockedLetters.length > 0) {
      const cleanedWords = wordList?.filter((word) => {
        return blockedLetters.every((letter) => !word.includes(letter));
      });
      // Remove all words that don't have all allowed letters
      const filteredWords = cleanedWords?.filter((word) => {
        return allowedLetters.every((letter) => word.includes(letter.letter));
      });
      // Split filteredWords into chunks of 5
      //const chunkedWords = chunk(filteredWords, 5);
      setWords(filteredWords ?? []);
      if (exactPlacement) {
        wordsWithCharactersAtPositions();
      }
    }
    // The hook was refreshing this far to often, so we will only run this when the other props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowedLetters, blockedLetters]);

  const wordsWithCharactersAtPositions = () => {
    // Search for words that have the correct letters at the correct positions
    // This is a bit of a hack, but it works
    const wordsWithCharactersAtPositions = words.filter((word) => {
      const split = word.split("");
      // Check if the letters are in the correct positions
      return allowedLetters.every((letter) => {
        const index = letter.index;
        return split[index] === letter.letter;
      });
    });
    console.log("Running", wordsWithCharactersAtPositions);
    setExactPositionWords(wordsWithCharactersAtPositions);
  };

  if (isLoading) {
    // Create Skeleton for Loading
    return (
      <div className="w-full max-w-sm p-4 mx-auto border border-blue-300 rounded-md shadow">
        <div className="flex space-x-4 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-slate-700"></div>
          <div className="flex-1 py-1 space-y-6">
            <div className="h-2 rounded bg-slate-700"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 col-span-2 rounded bg-slate-700"></div>
                <div className="h-2 col-span-1 rounded bg-slate-700"></div>
              </div>
              <div className="h-2 rounded bg-slate-700"></div>
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

  if (exactPlacement) {
    return (
      <div className="w-2/3 h-full">
        <div className="flex h-full text-xl text-white border-2 border-gray-700 rounded-md">
          {(allowedLetters.length > 0 || blockedLetters.length > 0) &&
          exactPositionWords.length !== 0 ? (
            <div className="flex flex-auto h-full">
              <AutoSizer disableHeight>
                {({ width }) => {
                  const chunked = chunk(
                    exactPositionWords,
                    Math.floor(width / ITEM_LENGTH)
                  );
                  console.log("We are here now!", chunked);
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
            <div className="flex content-center justify-center w-full m-2 align-middle">
              <div>
                <p>No Words Found With Exact Positions</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    // 4 Columns
    <div className="w-2/3 h-full">
      <div className="flex h-full text-xl text-white border-2 border-gray-700 rounded-md">
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
          <div className="flex content-center justify-center w-full m-2 align-middle">
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
