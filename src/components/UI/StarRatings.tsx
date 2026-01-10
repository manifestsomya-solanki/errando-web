import React from "react";
import GoldStar from "../../assets/GoldStar.svg";
import Star from "../../assets/Star.svg";

const StarRatings = (props: { onClick: (key: number) => void; initialRating?: number }) => {
  const [clicked, setClicked] = React.useState(() => {
    if (props.initialRating && props.initialRating > 0) {
      return Array.from({ length: 5 }, (_, i) => i < props.initialRating!);
    }
    return [false, false, false, false, false];
  });
  
  React.useEffect(() => {
    if (props.initialRating && props.initialRating > 0) {
      const newClicked = Array.from({ length: 5 }, (_, i) => i < props.initialRating);
      setClicked(newClicked);
      // Call onClick to update parent state with initial rating
      props.onClick(props.initialRating);
    }
  }, [props.initialRating]);
  
  const handleStarClick = (e: any, index: number) => {
    e.preventDefault();
    const clickStates = [...clicked];
    for (let i = 0; i < 5; i++) {
      if (i <= index) clickStates[i] = true;
      else clickStates[i] = false;
    }

    setClicked(clickStates);
    const ratingCount = clickStates.filter(Boolean).length;
    props.onClick(ratingCount);
  };
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
