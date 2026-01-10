function LightBulb(props: { color: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2ZM15 16H9V15.5C9 15.22 9.22 15 9.5 15H14.5C14.78 15 15 15.22 15 15.5V16ZM14.5 13H9.5C8.67 13 8 12.33 8 11.5C8 10.67 8.67 10 9.5 10H14.5C15.33 10 16 10.67 16 11.5C16 12.33 15.33 13 14.5 13ZM9 20H15V22H9V20Z"
        fill={props.color}
      />
    </svg>
  );
}

export default LightBulb;
