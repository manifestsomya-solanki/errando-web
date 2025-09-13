const Heading = (props: {
  variant?: string;
  headingclassname?: string;
  text: React.ReactNode;
}) => {
  switch (props.variant) {
    case "bigTitle":
      return (
        <h1
          className={`text-2xl lg:text-2xl font-bold font-poppins ${props.headingclassname} `}
          {...props}
        >
          {props.text}
        </h1>
      );
    case "headingTitle":
      return (
        <h3
          className={`text-xl font-bold  font-poppins  ${props.headingclassname} `}
          {...props}
        >
          {props.text}
        </h3>
      );
    case "subTitle":
      return (
        <h4
          className={`text-lg font-semibold font-poppins ${props.headingclassname}  `}
          {...props}
        >
          {props.text}
        </h4>
      );
    case "subHeader":
      return (
        <h5
          className={`text-base font-semibold font-poppins  ${props.headingclassname} `}
          {...props}
        >
          {props.text}
        </h5>
      );
    case "smallTitle":
      return (
        <h5
          className={`text-sm font-normal font-poppins  ${props.headingclassname} `}
          {...props}
        >
          {props.text}
        </h5>
      );

    default:
      return <p {...props}>{props.text}</p>;
  }
};

export default Heading;
