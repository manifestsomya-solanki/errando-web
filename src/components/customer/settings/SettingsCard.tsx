function SettingsCard(props: { children: React.ReactNode }) {
  return (
    <div className="w-full items-center flex justify-center ">
      <div className="bg-white border-t-[0.5px] border-t-slate-100 dark:border-none shadow-md py-5 px-5 rounded-md flex flex-col dark:bg-dimGray xl:w-3/5 xs:w-full dark:text-white">
        {props.children}
      </div>
    </div>
  );
}

export default SettingsCard;
