import Skeleton from "../../../UI/Skeletons/Skeleton";

const DealerDetailSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 mt-5 w-full">
      <div className="grid lg:grid-cols-6 xs:grid-cols-2 gap-6 items-center">
        <Skeleton
          variant="circular"
          className=" lg:col-span-1 h-48 w-full  bg-slate-200"
        />
        <Skeleton
          variant="rectangular"
          className=" rounded-xl w-full h-52 bg-slate-200 lg:col-span-5"
        />
      </div>
    </div>
  );
};

export default DealerDetailSkeleton;
