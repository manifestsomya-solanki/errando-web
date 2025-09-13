import React from "react";
import GoldStar from "../../assets/GoldStar.svg";
import Star from "../../assets/Star.svg";

const StarRatings = (props: { onClick: (key: number) => void }) => {
  const [clicked, setClicked] = React.useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const handleStarClick = (e: any, index: number) => {
    e.preventDefault();
    const clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      if (i <= index) clickStates[i] = true;
      else clickStates[i] = false;
    }

    setClicked(clickStates);
  };
  props.onClick(clicked.filter(Boolean).length);
  return (
    <div className="flex gap-2">
      {clicked?.map((d, i) => {
        return (
          <button
            onClick={(e) => {
              handleStarClick(e, i);
            }}
          >
            <img src={clicked[i] === false ? Star : GoldStar} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRatings;
