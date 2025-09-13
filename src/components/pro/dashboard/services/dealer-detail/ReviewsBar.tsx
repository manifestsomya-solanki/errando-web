import DropdownCompoenet from "../../../../UI/Dropdown";
import Heading from "../../../../UI/Heading";

function ReviewsBar() {
  const dropDownOne = ["Last Added", "Last Updated", "A-Z", "Z-A"];

  return (
    <div className="lg:flex-row xs:flex-col flex  lg:items-center xs:items-start justify-between box-border py-5   xs:gap-3 lg:gap-0">
      <div className="flex lg:gap-10 flex-row  lg:items-center xs:items-start xs:gap-3  xs:w-full justify-between">
        <Heading
          text="My Reviews"
          variant="headingTitle"
          headingclassname="!font-bold mx-1 tracking-wide dark:text-white"
        />
      </div>
      <div className="lg:ml-auto xs:w-full lg:w-52 relative">
        <DropdownCompoenet
          placeholderClassName="dark:text-white"
          placeholder="Sort By"
          options={dropDownOne}
          onChange={(newValue) => {
            console.log(newValue.value);
          }}
          className=""
        />
      </div>
    </div>
  );
}

export default ReviewsBar;
