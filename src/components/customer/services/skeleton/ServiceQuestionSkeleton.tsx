import Skeleton from "../../../UI/Skeletons/Skeleton";

const ServiceQuestionSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 mt-5 w-full">
      <div>
        <Skeleton
          variant="rectangular"
          className=" rounded-xl w-full h-64 bg-slate-200"
        />
      </div>
    </div>
  );
};

export default ServiceQuestionSkeleton;
