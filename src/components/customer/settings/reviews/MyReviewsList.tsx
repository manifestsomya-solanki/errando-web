import { useMyReview } from "../../../../store/customer/my-review-context";
import Heading from "../../../UI/Heading";
import CommentItem from "../../services/dealer-detail/CommentItem";
import DealerReviewsSkeleton from "../../services/skeleton/DealerReviewsSkeleton";

function MyReviewsList() {
  const { data: myReview, isReviewLoading } = useMyReview();

  return (
    <div>
      {" "}
      {isReviewLoading ? (
        <DealerReviewsSkeleton limit={1} />
      ) : (
        <div>
          {myReview && myReview.length === 0 ? (
            <div className="w-full flex lg:flex-row xs:flex-col gap-3 justify-center py-20">
              <Heading
                headingclassname=""
                text={`No Reviews !!`}
                variant="subTitle"
              />
            </div>
          ) : (
            myReview &&
            myReview.map((item) => {
              const createdAt = new Date(item.created_at);
              const formattedDate = createdAt.toLocaleDateString("en-GB");
              return (
                <CommentItem
                  user_id={item.user_id}
                  key={item.id}
                  name={item?.user_bussiness?.name}
                  subTitle={item?.service?.name}
                  description={item?.description}
                  ratingCount={parseInt(item.rating)}
                  date={formattedDate}
                  comment={item?.response}
                  id={item.id}
                  user_business_id={item.user_business_id}
                  page_key="my-reviews"
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default MyReviewsList;
