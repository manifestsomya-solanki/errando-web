import styles from "../../../styles/TableFooter.module.css";
import Button from "../../UI/Button";

type TableFooterProps<DataType> = {
  slice: Array<DataType>;
  valid: boolean;
  page: number;
  prev: (d?: string) => void;
  next: (d?: string) => void;
  className?: string;
};
const TableFooter = <T,>({
  slice,
  valid,
  page,
  prev,
  next,
  className,
}: TableFooterProps<T>) => {
  return (
    <div className={styles.tableFooter + " " + className}>
      <Button
        disabled={page === 1}
        color="secondary"
        variant="filled"
        buttonClassName={`${styles.button}  !py-0 `}
        onClick={() => prev()}
      >
        <h1 className="!font-bold text-2xl ">{"<"}</h1>
      </Button>
      <Button
        color="secondary"
        variant="filled"
        buttonClassName={`${styles.button}  !py-0`}
        onClick={() => next()}
        disabled={!valid}
      >
        <h1 className="!font-bold text-2xl  ">{`>`}</h1>
      </Button>
    </div>
  );
};

export default TableFooter;
