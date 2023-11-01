import { Formik } from "formik";
import Modal from "../home/Modal";
import Label from "../../components/UI/Label";
import Input from "../../components/UI/Input";
import { useTheme } from "../../store/theme-context";
import Close from "../../assets/close";
import Button from "../../components/UI/Button";

import SearchBar from "../../components/customer/home/SearchBar";

import { useLeadResponse } from "../../store/pro/response-context";

function SearchLeadsModal({ onCancel }: { onCancel: () => void }) {
  const { search } = useLeadResponse();
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
      <Label className=" !font-semibold" label="Search" />

      <div className="py-1 flex items-center">
        <SearchBar
          page_key="response"
          className="lg:!w-full"
          searchkey={""}
          onChange={(key: string) => {
            console.log(key);

            search(key);
            onCancel();
          }}
        />
      </div>
    </Modal>
  );
}

export default SearchLeadsModal;
