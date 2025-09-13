import Skeleton from "../../../UI/Skeletons/Skeleton";

function ServiceDetailSkeleton({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid lg:grid-cols-3 xs:grid-cols-1 gap-5 py-4 w-full">
        {[...Array(limit)].map((value, key) => {
          return (
            <div key={key}>
              <Skeleton
                variant="rectangular"
                className=" rounded-xl w-full h-72"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default ServiceDetailSkeleton;
