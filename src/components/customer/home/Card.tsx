import { useNavigate } from "react-router-dom";

function Card(props: { image: string; desc: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center 2xl:w-72 xl:w-64 lg:w-48 p-5">
      <img
        src={props.image}
        alt=""
        className="2xl:h-48 xl:h-40 lg:h-32 xs:h-32 rounded-xl object-cover w-full "
      />
      <p className="font-medium 2xl:text-xl xl:text-lg md:text-md xs:text-sm dark:text-white text-center">
        {props.desc}
      </p>
    </div>
  );
}

export default Card;
