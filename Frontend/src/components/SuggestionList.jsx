
const SuggestionList = () => {


  return (
    <div className="w-full overflow-x-auto  flex items-center justify-start z-[99999] space-x-4 p-4">
      {[...Array(10)].map((_, index) => (
      <div
        key={index}
        className="min-w-[100px] h-[80px] border-[1px] border-black flex items-center justify-center text-black rounded-md shadow-md"
      >
        Box {index + 1}
      </div>
      ))}
    </div>
    );
};

export default SuggestionList;
