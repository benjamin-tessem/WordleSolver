import "./App.css";

import React, { useState } from "react";

import AddLetterBox from "./components/addletterbox";
import Button from "./components/button";
import LetterBox from "./components/letterbox";
import WordBank from "./components/wordbank";

export interface LetterTypes {
  letter: string;
  index: number;
  atLocation?: boolean;
}

const App = () => {
  const [allowedLetters, setAllowedLetters] = useState<LetterTypes[]>([]);
  const [blockedLetters, setBlockedLetters] = useState<LetterTypes[]>([]);
  const [totalBlocked, setTotalBlocked] = useState(0);

  const handleLetterChange = (
    letter: string,
    index: number,
    blocked?: boolean
  ) => {
    // Remove if letter is empty
    if (letter === "") {
      if (blocked) {
        setBlockedLetters(
          blockedLetters.filter((letter) => letter.index !== index)
        );
      } else {
        setAllowedLetters(
          allowedLetters.filter(
            (allowedLetter) => allowedLetter.index !== index
          )
        );
      }
    } else {
      const objectSetter = blocked ? setBlockedLetters : setAllowedLetters;
      objectSetter((prevState) =>
        [...prevState, { letter, index }].filter((x) => x.letter.length > 0)
      );
    }
  };

  const clearAllowedLetters = () => {
    setAllowedLetters([]);
  };
  // Center all content on the vertical axis
  return (
    <div className="flex flex-col content-center w-screen min-h-screen overflow-hidden bg-slate-900">
      <div className="flex flex-col items-center justify-center my-auto space-y-4">
        <h1 className="text-5xl font-bold text-center dark:text-white">
          Wordle Solver
        </h1>
        <h2 className="text-xl font-bold text-center dark:text-white">
          Enter the letters you know below
        </h2>
        <div className="flex">
          {
            // Create Box for each letter
            Array.from(Array(5)).map((_, i) => (
              <LetterBox
                key={i}
                value={allowedLetters.find((x) => x.index === i)?.letter ?? ""}
                onChange={(val) => handleLetterChange(val, i)}
              />
            ))
          }
        </div>
        <Button onClick={clearAllowedLetters}>Clear Letters</Button>

        <h2 className="text-xl font-bold text-center dark:text-white">
          Blocked Letters
        </h2>
        <div className="flex flex-wrap">
          {
            // Create Box for each letter
            Array.from(Array(totalBlocked)).map((_, i) => (
              <LetterBox
                key={i}
                value={blockedLetters[i] ? blockedLetters[i].letter : ""}
                onChange={(val) => handleLetterChange(val, i, true)}
              />
            ))
          }
          <AddLetterBox onClick={() => setTotalBlocked((x) => x + 1)} />
        </div>
        <Button
          onClick={() => {
            setTotalBlocked(0);
            setBlockedLetters([]);
          }}
        >
          Clear
        </Button>
        <h2 className="text-xl font-bold text-center dark:text-white">
          Exact Positions
        </h2>
        <WordBank
          allowedLetters={allowedLetters}
          blockedLetters={blockedLetters.map((x) => x.letter)}
          exactPlacement={true}
        />
        <h2 className="text-xl font-bold text-center dark:text-white">
          Any Position
        </h2>
        <WordBank
          allowedLetters={allowedLetters}
          blockedLetters={blockedLetters.map((x) => x.letter)}
        />
        {/**
         * Created By:
         */}
        <div className="text-center text-gray-500">
          Created By:{" "}
          <a href="https://tessem.dev">
            <span className="text-blue-500">
              <strong>
                <u>Ben Tessem</u>
              </strong>
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
