import { useParams } from "react-router";
import { Business } from "../../../../models/customer/businesslist";
import { useServices } from "../../../../store/customer/service-context";
import Button from "../../../UI/Button";
import DropdownCompoenet from "../../../UI/Dropdown";
import Heading from "../../../UI/Heading";
import FilterSectionSkeleton from "../skeleton/FilterSectionSkeleton";
import { useEffect, useState } from "react";
import ShowInterestToAllModal from "../../../../layout/customer/ShowInterestToAllModal";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";

function FilterSection(props: any) {
  const { businessListHandler, to_show_interest } = useServices();
  const url = `https://erranddo.com/admin/api/v1/businesses/count?user_request_id=${props.userRequestId}`;
  const { data } = useSWR(url, fetcher);

  const dropDownOne = [
    "Highest reviews",
    "Distance",
    "Response time",
    "Registration date",
    "Highest overall score",
  ];
  const dataList = props?.list;
  const businessList: Business[] = [];
  for (let i = 0; i < dataList.length; i++) {
    dataList[i]?.map((d: Business) => businessList.push(d));
  }
  const sectionClassName =
    "lg:flex-row flex xs:flex-col lg:items-center xs:items-start gap-2 active:border-b active:border-b-primaryBlue hover:border-b-[3px] hover:border-b-primaryBlue lg:w-fit xs:w-3/6 h-full xs:py-2 lg:py-0 cursor-pointer";
  const headingclassname =
    "text-textColor !font-normal tracking-wide active:text-primaryBlue hover:text-primaryBlue dark:text-darktextColor";

  const isLoading = false;

  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("all");
  useEffect(() => {
    businessListHandler(props.serviceId, props.userRequestId ?? "", link);
  }, [props.serviceId]);
  return (
    <div>
      {showModal && (
        <ShowInterestToAllModal
          onCancel={() => {
            setShowModal(false);
          }}
          list={dataList}
        />
      )}
      {isLoading ? (
        <FilterSectionSkeleton />
      ) : (
        <div className="lg:flex-row xs:flex-col flex  lg:items-center xs:items-start justify-between box-border xs:py-4 lg:py-0 border-y-[0.5px] border-y-slate-300 my-10 xs:gap-3 lg:gap-0">
          <div className="flex lg:gap-10 lg:flex-row xs:flex-col lg:items-center xs:items-start xs:gap-3 lg:w-max xs:w-full">
            <Heading
              text={"Matched Pros"}
              variant="subHeader"
              headingclassname="text-primaryYellow !font-bold tracking-wide "
            />
            <div className="lg:!h-16  xs:h-max flex gap-7 justify-between lg:w-max xs:w-full">
              <div
                onClick={() => {
                  setLink("all");
                  businessListHandler(
                    props.serviceId,
                    props.userRequestId ?? "",
                    "all"
                  );
                }}
                className={`
                  ${sectionClassName} 
                   ${
                     link === "all"
                       ? " border-b-primaryBlue border-b-[3px] "
                       : ""
                   }
                   
                `}
              >
                <Heading
                  text={"All"}
                  variant="subHeader"
                  headingclassname={headingclassname}
                />
                <Button
                  children={
                    data?.not_responded_count < 10
                      ? `0${data?.not_responded_count}` ?? "00"
                      : data?.not_responded_count ?? "00"
                  }
                  size="normal"
                  centerClassName="flex justify-center"
                  buttonClassName=" hover:bg-transparent active:bg-transparent !py-2 xs:w-full dark:text-darktextColor"
                  variant="outlined"
                ></Button>
              </div>
              <div
                className={`
                ${sectionClassName} 
                 ${
                   link === "response"
                     ? " border-b-primaryBlue border-b-[3px] "
                     : ""
                 }
                 
              `}
                onClick={() => {
                  setLink("response");
                  businessListHandler(
                    props.serviceId,
                    props.userRequestId ?? "",
                    "response"
                  );
                }}
              >
                <Heading
                  text={"Response"}
                  variant="subHeader"
                  headingclassname={headingclassname}
                />
                <Button
                  children={
                    data?.responded_count < 10
                      ? `0${data?.responded_count}` ?? "00"
                      : data?.responded_count ?? "00"
                  }
                  centerClassName="flex justify-center"
                  buttonClassName=" hover:bg-transparent active:bg-transparent border-textColor hover:border-primaryBlue  !py-2 xs:w-full dark:text-darktextColor"
                  variant="outlined"
                ></Button>
              </div>
            </div>
            {link === "all" && (
              <Button
                disabled={to_show_interest}
                onClick={() => setShowModal(!showModal)}
                variant="filled"
                color="primary"
                size="normal"
                children={
                  to_show_interest
                    ? "Shown Interest to all"
                    : "Show Interest to all"
                }
                centerClassName="flex items-center justify-center"
                buttonClassName="!px-4  text-sm tracking-wide xs:w-full lg:w-max py-[0.7rem] disabled:text-white"
              />
            )}
          </div>
          <div className="lg:ml-auto xs:w-full lg:w-56">
            <DropdownCompoenet
              placeholder="Sort By"
              options={dropDownOne}
              onChange={(newValue) => {
                props.onChange(newValue?.value);
              }}
              className=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FilterSection;
