import { Formik } from "formik";
import Modal from "../home/Modal";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import { useTheme } from "../../store/theme-context";
import Close from "../../assets/close";
import Button from "../../components/UI/Button";
import { FilterLeads } from "../../models/pro/leadslist";
import { useService } from "../../store/pro/service-context";
import { useLead } from "../../store/pro/lead-context";
import Heading from "../../components/UI/Heading";
import { useLeadResponse } from "../../store/pro/response-context";

function FilterLeadsModal({
  onCancel,
  filterKey,
}: {
  onCancel: () => void;
  filterKey: string;
}) {
  const { data } = useService();
  const { filter } = useLead();
  const { filter: responseFilter } = useLeadResponse();
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
      <Label
        className="my-3 !font-semibold"
        label="Choose service(s) to be displayed"
      />
      <Formik<FilterLeads>
        initialValues={{
          business_id: [],
        }}
        enableReinitialize={true}
        onSubmit={async (values) => {
          console.log(values.business_id);
          const service_ids: number[] = [];
          values.business_id?.forEach((item, key) => {
            if (item) service_ids.push(item);
          });
          if (filterKey === "lead") {
            console.log("here");
            if (
              values.business_id.length > 0 &&
              values.business_id.every((array) => array.length > 0)
            )
              filter(service_ids);
          } else {
            console.log("else");
            responseFilter(service_ids);
          }
          onCancel();
        }}
      >
        {(props) => (
          <form autoComplete="off" onSubmit={props.handleSubmit}>
            {data && data.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 my-3 justify-between">
                {data.map((item, key) => {
                  if (item.service.name)
                    return (
                      <div className="py-1 flex items-center gap-2">
                        <Input
                          id={`business_id[${key}]`}
                          type="checkbox"
                          className="border-none !w-fit !px-0"
                          name={`business_id[${key}]`}
                          value={item.service_id}
                          onChange={props.handleChange}
                        />

                        <Label
                          className="capitalize"
                          label={item?.service?.name}
                          htmlFor={`business_id[${key}]`}
                        />
                      </div>
                    );
                })}
              </div>
            ) : (
              <p className="text-center font-bold py-4 text-primaryYellow ">
                No services to display.
              </p>
            )}
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

export default FilterLeadsModal;
