const Filter = (props: { color: string }) => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16.007"
        height="16.999"
        viewBox="0 0 25.007 24.999"
        stroke={props.color}
        fill={props.color}
      >
        <path
          id="filter-svgrepo-com"
          d="M26.667,9H25m0,0H23.333M25,9V7.333M25,9v1.667m-7.5-5H6.667c-.786,0-1.179,0-1.423.244S5,6.548,5,7.333v3.275a1.81,1.81,0,0,0,.1.839c.1.184.28.305.644.548l5.039,3.359c1.453.969,2.18,1.453,2.574,2.19s.395,1.61.395,3.357V29l5.833-2.917V20.9c0-1.747,0-2.62.395-3.357a3.574,3.574,0,0,1,1.06-1.142M30,9a5,5,0,1,1-5-5A5,5,0,0,1,30,9Z"
          transform="translate(-4.25 -3.25)"
          fill="none"
          stroke={props.color}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};

export default Filter;
