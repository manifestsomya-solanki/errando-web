import Heading from "../../../../UI/Heading";
import HomeCard from "../../home/HomeCard";
import Edit from "../../../../../assets/edit.svg";
import EditResponseModal from "../../../../../layout/pro-models/EditResponseModal";
import { useState } from "react";
import { useTheme } from "../../../../../store/theme-context";

function ResponseSection(props: {
  reviewId: number;
  id: string;
  service_id: string;
  business_id: string;
  name: string;
  subTitle: string;
  description: string;
  date: string;
  ratingCount: number;
  comment: string;
}) {
  const [response, setResponse] = useState(false);
  const [reviewId, setReviewId] = useState(false);

  const { theme } = useTheme();
  console.log(props.business_id, "busnes");

  return (
    <div>
      {response && (
        <EditResponseModal
          id={props.id}
          onCancel={() => setResponse(false)}
          businessId={props.business_id ?? ""}
          serviceId={props.service_id ?? ""}
          description={props.description ?? ""}
          rating={props.ratingCount ?? ""}
        />
      )}
      <HomeCard
        children={
          <div className="xs:py-5 lg:py-1 border border-solid rounded-lg !border-[#707070] !h-full flex flex-col justify-between px-3 ">
            <div className="flex flex-row justify-between">
              <Heading
                text={"My Response"}
                variant="smallTitle"
                headingclassname={`!font-semibold tracking-wide text-slate-700 dark:text-slate-400`}
              />
              <div
                className="flex gap-3 cursor-pointer"
                onClick={() => setResponse(true)}
              >
                <img src={Edit} className="mt-2" />
              </div>
            </div>
            <Heading
              text={props.comment}
              variant="smallTitle"
              headingclassname={`tracking-wide text-slate-700  dark:text-slate-400`}
            />
          </div>
        }
        className="!bg-transparent sm:w-72 "
      />
    </div>
  );
}

export default ResponseSection;
