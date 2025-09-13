import Skeleton from "../../../UI/Skeletons/Skeleton";

function DealerReviewsSkeleton({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 pt-4 w-full">
        {[...Array(limit)].map((key) => {
          return (
            <div key={key}>
              <Skeleton
                variant="rectangular"
                className=" rounded-xl w-full h-screen bg-slate-200"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default DealerReviewsSkeleton;
