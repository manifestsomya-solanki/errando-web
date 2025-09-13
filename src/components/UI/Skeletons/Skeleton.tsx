export interface SkeletonProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  variant?: "circular" | "text" | "rectangular";
}

const Skeleton: React.FC<SkeletonProps> = ({
  className: propClassName,
  variant,
  ...props
}) => {
  if (variant === "circular") {
    return (
      <div
        className={`animate-pulse rounded-full bg-slate-200 dark:bg-zinc-700 block aspect-square ${propClassName}`}
        {...props}
      ></div>
    );
  }
  return (
    <div
      className={`animate-pulse rounded bg-slate-200  dark:bg-zinc-700 max-w-full block ${propClassName}`}
      {...props}
    ></div>
  );
};

export default Skeleton;
