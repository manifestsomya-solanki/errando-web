import Modal from "../home/Modal.tsx";
import Close from "../../assets/close.tsx";
import Heading from "../../components/UI/Heading.tsx";
import { useTheme } from "../../store/theme-context.tsx";

import Button from "../../components/UI/Button.tsx";
import { useMyReview } from "../../store/customer/my-review-context.tsx";
import { useReview } from "../../store/customer/review-context.tsx";

function DeleteReviewModal({
  reviewId,
  onCancel,
  page_key,
}: {
  reviewId: number;
  onCancel: () => void;
  page_key: string;
}) {
  const { theme } = useTheme();
  const {
    isLoading: isMyReviewLoading,
    deleteReview: deleteMyReview,
    mutate: myReviewMutate,
  } = useMyReview();
  const { deleteReview, mutate, isLoading } = useReview();

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg xl:w-[460px] md:w-[470px] dark:bg-modalDarkColor">
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="flex flex-col items-center xl:w-[400px] md:w-[450px] xl:mt-1 md:mt-2 p-3 gap-2 xs:mt-10">
        <div className="pb-7 xs:w-full xl:pl-0 md:pl-3">
          <Heading
            variant="subTitle"
            headingclassname="text-center"
            text="Are you sure you want to delete review ?"
          />
        </div>
        <div className="flex lg:gap-5 xs:gap-4 xl:w-[550px] md:w-[420px] justify-center pl-2">
          <button
            type="button"
            className="text-white md:w-40 xs:w-fit xs:text-sm bg-red-500  xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 "
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <Button
            loading={isLoading || isMyReviewLoading}
            type="submit"
            buttonClassName="text-white w-48 xs:w-fit xs:text-sm bg-green-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 xl:text-lg md:text-sm rounded-xl xl:h-12 lg:h-10 xs:h-10 md:px-8 xs:px-5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={async () => {
              if (page_key === "my-reviews") {
                await deleteMyReview(reviewId);
                await myReviewMutate();
              } else {
                await deleteReview(reviewId);
                await mutate();
              }
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteReviewModal;
