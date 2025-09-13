import Skeleton from "./Skeleton";

const ServiceImageSkeleton = () => {
  return (
    <div className="flex 2xl:gap-48 gap-8  mt-5 w-screen">
      <div className="grid grid-cols-4 gap-10">
        <Skeleton
          variant="rectangular"
          className="2xl:h-48 xl:h-40 lg:h-32 xs:h-32 rounded-xl w-96"
        />
        <Skeleton
          variant="rectangular"
          className="2xl:h-48 xl:h-40 lg:h-32 xs:h-32 rounded-xl w-96"
        />{" "}
        <Skeleton
          variant="rectangular"
          className="2xl:h-48 xl:h-40 lg:h-32 xs:h-32 rounded-xl w-96"
        />{" "}
        <Skeleton
          variant="rectangular"
          className="2xl:h-48 xl:h-40 lg:h-32 xs:h-32 rounded-xl w-96"
        />
      </div>
    </div>
  );
};

export default ServiceImageSkeleton;
