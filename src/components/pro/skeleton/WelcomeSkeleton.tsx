import Skeleton from "../../UI/Skeletons/Skeleton";

const WelcomeSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-2 xs:grid-cols-1 gap-5  mt-5 w-full">
      <div>
        <Skeleton
          variant="rectangular"
          className=" rounded-xl w-full h-36 bg-slate-200"
        />
      </div>
      <div>
        <Skeleton variant="rectangular" className="rounded-xl w-full h-36" />
      </div>
    </div>
  );
};

export default WelcomeSkeleton;
