function ProgressBar(props: { className?: string; width: any; key: number }) {
  return (
    <div
      key={props.key}
      className="border-slate-300 rounded-3xl bg-slate-300  "
      id={props.width}
    >
      <div
        style={{ width: `${props.width}` }}
        key={props.key}
        className={`h-full  ${
          props?.width?.split("%")[0] > 50 ? "bg-primaryBlue" : "bg-red-500"
        } rounded-3xl text-transparent`}
      >
        hello
      </div>
    </div>
  );
}

export default ProgressBar;
