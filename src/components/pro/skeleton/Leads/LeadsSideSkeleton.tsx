import Skeleton from "../../../UI/Skeletons/Skeleton";

function LeadsSideSkeleton({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 w-full">
        {[...Array(limit)].map((value, key) => {
          return (
            <div key={key}>
              <Skeleton
                variant="rectangular"
                className=" rounded-xl w-full h-screen"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default LeadsSideSkeleton;
