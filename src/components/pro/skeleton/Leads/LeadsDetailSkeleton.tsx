import Skeleton from "../../../UI/Skeletons/Skeleton";

function LeadsDetailSkeleton({ limit }: { limit: number }) {
  return (
    <>
      <div className="grid lg:grid-cols-1 xs:grid-cols-1 gap-5 w-full pt-4">
        {[...Array(limit)].map((value, key) => {
          return (
            <div key={key}>
              <Skeleton
                variant="rectangular"
                className=" rounded-xl w-full h-[440px]"
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
export default LeadsDetailSkeleton;
