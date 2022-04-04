import { IoAddOutline } from "react-icons/io5";
import React from "react";
interface AddLetterBoxProps {
  onClick: () => void;
}

const AddLetterBox: React.FC<AddLetterBoxProps> = ({ onClick }) => {
  return (
    <div className="flex flex-col items-center justify-center m-2">
      <div
        className="bg-gray-800 text-white text-center text-xl font-bold border-2 border-gray-700 rounded-md w-10 h-10 md:w-20 md:h-20 cursor-pointer flex justify-center items-center"
        onClick={onClick}
      >
        <IoAddOutline className="w-20 h-20" />
      </div>
    </div>
  );
};

export default AddLetterBox;
