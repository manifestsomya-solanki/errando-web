import { useReview } from "../../../../store/customer/review-context";
import DealerReviewsSkeleton from "../skeleton/DealerReviewsSkeleton";
import CommentItem from "./CommentItem";

import Heading from "../../../UI/Heading";

function CommentSection() {
  const { data: businessReview, isReviewLoading } = useReview();

  return (
    <div>
      {isReviewLoading ? (
        <DealerReviewsSkeleton limit={1} />
      ) : (
        <div>
          {businessReview && businessReview.length === 0 ? (
            <div className="w-full flex lg:flex-row xs:flex-col gap-3 justify-center py-20">
              <Heading
                headingclassname=""
                text={`No Reviews !!`}
                variant="subTitle"
              />
            </div>
          ) : (
            businessReview &&
            businessReview.map((item) => {
              const createdAt = new Date(item.created_at);
              const formattedDate = createdAt.toLocaleDateString("en-GB");
              return (
                <CommentItem
                  user_id={item.user_id}
                  key={item.id}
                  name={item?.user?.full_name}
                  subTitle={item?.service?.name}
                  description={item?.description}
                  ratingCount={parseInt(item.rating)}
                  date={formattedDate}
                  comment={item?.response}
                  id={item.id}
                  page_key="business-reviews"
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
