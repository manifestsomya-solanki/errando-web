import Skeleton from "../../UI/Skeletons/Skeleton";

function BusinessSkeleton({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid lg:grid-cols-3 xs:grid-cols-1 gap-5 py-5  w-full">
        {[...Array(limit)].map((value, key) => {
          return (
            <div key={key}>
              <Skeleton
                variant="rectangular"
                className=" rounded-xl w-full h-80"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default BusinessSkeleton;
