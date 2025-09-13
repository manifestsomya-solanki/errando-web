import Skeleton from "../../../UI/Skeletons/Skeleton";

const DealerContactSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 py-4 w-full my-3">
      <div>
        <Skeleton
          variant="rectangular"
          className=" rounded-xl w-full h-28 bg-slate-200"
        />
      </div>
    </div>
  );
};

export default DealerContactSkeleton;
