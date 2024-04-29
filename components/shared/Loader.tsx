import { BeatLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <BeatLoader color="white" size={20} />
    </div>
  );
};

export default Loader;
