import { useParams } from "react-router";
import { ReviewData } from "../../../../../models/customer/reviewlist";
import Heading from "../../../../UI/Heading";
import DealerReviewsSkeleton from "../../../skeleton/Dealer/DealerReviewsSkeleton";
import HomeCard from "../../home/HomeCard";
import CommentItem from "./CommentItem";

function CommentSection(props: { reviews: ReviewData[] }) {
  const isLoading = false;

  return (
    <div className="">
      {isLoading ? (
        <DealerReviewsSkeleton limit={1} />
      ) : (
        <HomeCard className="px-5 ">
          <div>
            {props.reviews.length > 0 &&
              props.reviews.map((item) => {
                return (
                  <CommentItem
                    id={item?.id?.toString() ?? ""}
                    service_id={item?.service_id?.toString() ?? ""}
                    business_id={item?.user_business_id?.toString() ?? ""}
                    name={item?.user?.full_name ?? "No Name"}
                    subTitle={item?.service?.name}
                    description={item?.description}
                    ratingCount={+item.rating}
                    date={item.created_at.split("T")[0]}
                    comment={item.response}
                    reviewId={item.id}
                    is_flagged={item.is_flagged ?? 0}
                  />
                );
              })}
            {props.reviews.length === 0 && (
              <div className="py-10 flex justify-center font-semibold">
                <Heading
                  headingclassname=""
                  text={`No Reviews Found !! `}
                  variant="subTitle"
                />
              </div>
            )}
          </div>
        </HomeCard>
      )}
    </div>
  );
}

export default CommentSection;
