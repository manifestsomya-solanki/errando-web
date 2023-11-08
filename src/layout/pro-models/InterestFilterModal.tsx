import { Formik } from "formik";
import Modal from "../home/Modal";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import { useTheme } from "../../store/theme-context";
import Close from "../../assets/close";
import Button from "../../components/UI/Button";
import { useLead } from "../../store/pro/lead-context";
import SearchBar from "../../components/customer/home/SearchBar";

function InterestFilterModal({ onCancel }: { onCancel: () => void }) {
  const { filterByInterest, search, reset } = useLead();
  const { theme } = useTheme();

  return (
    <Modal className="bg-slate-100 dark:bg-modalDarkColor opacity-90 rounded-lg  overflow-y-scroll !py-0">
      <button
        className="sticky top-5 right-5 w-full flex justify-end"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>
      <div className="w-[80%] mt-2 flex justify-between">
        <Label className="my-3 !font-semibold" label="Filter" />
        <div
          onClick={() => {
            reset();
            onCancel();
          }}
        >
          <Label className="my-3 !font-semibold" label="Reset" />
        </div>
      </div>
      <Formik
        initialValues={{
          interests: false,
          is_outright: false,
          is_today: false,
          is_sold_out: false,
          is_quote_requested: false,
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          console.log("here", values);

          filterByInterest(values);

          onCancel();
        }}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            <div>
              <div className="py-1 flex items-center">
                <SearchBar
                  className="!w-full"
                  searchkey={""}
                  onChange={(key: string) => {
                    console.log(key);

                    search(key);
                    onCancel();
                  }}
                  page_key="lead"
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  id={`is_outright`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  name={`is_outright`}
                  value={props.values.is_outright}
                  checked={props.values.is_outright}
                  onChange={props.handleChange}
                />
                <Label
                  label={"Leads available to Buy Outright"}
                  htmlFor={`is_outright`}
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  id={`is_today`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  name={`is_today`}
                  value={props.values.is_today}
                  checked={props.values.is_today}
                  onChange={props.handleChange}
                />
                <Label label={"Today's Lead"} htmlFor={`is_today`} />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  // id={`is_interest_shown`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  // name={`is_interest_shown`}
                  // value={props.values.is_interest_shown}
                  // checked={props.values.is_interest_shown}
                  // onChange={props.handleChange}
                />
                <Label
                  label={"Customers who have sent you message"}
                  // htmlFor={`is_interest_shown`}
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  // id={`is_interest_shown`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  // name={`is_interest_shown`}
                  // value={props.values.is_interest_shown}
                  // checked={props.values.is_interest_shown}
                  // onChange={props.handleChange}
                />
                <Label
                  className=""
                  label={"Customers who have looked at your profile"}
                  // htmlFor={`is_interest_shown`}
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  id={`is_quote_requested`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  name={`is_quote_requested`}
                  value={props.values.is_quote_requested}
                  checked={props.values.is_quote_requested}
                  onChange={props.handleChange}
                />
                <Label
                  label={"Customers who have requested a quote"}
                  htmlFor={`is_quote_requested`}
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  id={`interests`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  name={`interests`}
                  value={props.values.interests}
                  checked={props.values.interests}
                  onChange={props.handleChange}
                />

                <Label
                  label={"Customers that have shown interest"}
                  htmlFor={`interests`}
                />
              </div>
              <div className="py-1 flex items-center gap-2">
                <Input
                  id={`is_sold_out`}
                  type="checkbox"
                  className="border-none !w-fit !px-0"
                  name={`is_sold_out`}
                  value={props.values.is_sold_out}
                  checked={props.values.is_sold_out}
                  onChange={props.handleChange}
                />
                <Label label={"Sold out leads"} htmlFor={`is_sold_out`} />
              </div>
            </div>
            <div className="flex w-full sticky bg-slate-100 dark:bg-modalDarkColor py-4 bottom-0 justify-center gap-5 ">
              <Button
                type="button"
                variant="outlined"
                color="primary"
                children="Cancel"
                onClick={() => onCancel()}
                centerClassName="flex justify-center items-center"
                buttonClassName="!px-3 font-poppins py-3 w-full"
              />
              <Button
                type="submit"
                variant="filled"
                color="primary"
                children="Filter"
                centerClassName="flex justify-center items-center"
                buttonClassName="!px-3 font-poppins py-3 w-full"
              />
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
}

export default InterestFilterModal;
