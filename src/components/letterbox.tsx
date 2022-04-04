import React, { ChangeEvent } from "react";

interface LetterBoxProps {
  onChange: (value: string) => void;
  value: string;
}

const LetterBox: React.FC<LetterBoxProps> = ({ onChange, value }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Check if value is a letter, uppercase or lowercase
    if (
      (event.target.value.length === 1 &&
        /[a-zA-Z]/.test(event.target.value)) ||
      event.target.value.length === 0
    ) {
      onChange(event.target.value.toLocaleLowerCase());
    }
  };

  // 1 Input box per letter
  // This component will be used to create the input boxes for each letter
  return (
    <div className="flex flex-col items-center justify-center">
      <input
        className="w-10 h-10 m-2 text-xl font-bold text-center text-white uppercase bg-gray-800 border-2 border-gray-700 rounded-md md:w-20 md:h-20"
        type="text"
        value={value}
        onChange={handleChange}
        maxLength={1}
        onFocus={(e) => e.target.select()}
      />
    </div>
  );
};

export default LetterBox;
