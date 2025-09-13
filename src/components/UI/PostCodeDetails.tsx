import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "../../store/customer/home-context";
import { PostCode } from "../../models/home";
import { buildApiUrl, API_ENDPOINTS } from "../../config/api";
import Input from "./Input";
import { useDetectClickOutside } from "react-detect-click-outside";

const PostCodeDetails = ({ ...props }) => {
  const postCodeId = props?.initialValue;
  const [url, setUrl] = useState("");
  const postCodeUrl = buildApiUrl(`${API_ENDPOINTS.POSTCODES}?search=${postCodeId}`);
  const { data: postCodeData } = useSWR(postCodeUrl, fetcher);
  const post_code = postCodeData?.data[0]?.name;
  
  //search handler
  const searchHandler = (key: string) => {
    setUrl(buildApiUrl(`${API_ENDPOINTS.POSTCODES}?search=${key}`));
    if (key === "") {
      setUrl(buildApiUrl(API_ENDPOINTS.POSTCODES));
    }
  };
  
  const dummy_data: PostCode[] = [];
  let datarender: PostCode[] = [];
  const { data, isLoading } = useSWR(url, fetcher);
  datarender = data?.data || dummy_data;
  const list = datarender;
  
  // Send API status back to parent when data changes
  useEffect(() => {
    if (data?.status && props.onApiResponse) {
      props.onApiResponse(data.status);
    }
  }, [data?.status, props.onApiResponse]);
  
  const inputClassName =
    "items-center bg-transparent dark:bg-black  w-full text-md md:w-full text-slate-700 border-slate-500 outline-none  font-medium font-poppins     border rounded-lg    ease-in focus:caret-slate-500  lg:mr-3 " +
    props.inputClass;
  const [key, setKey] = useState("");
  const [searchList, setSearchList] = useState(false);
  const listClassName =
    "bg-white dark:bg-black md:w-96 lg:w-80 xl:w-96 xs:w-64 xl:max-h-48 lg:max-h-36 h-auto  z-[100] absolute overflow-y-scroll rounded-xl ";
  const closeToggle = () => {
    setSearchList(false);
  };
  const ref = useDetectClickOutside({ onTriggered: closeToggle });

  return (
    <div className="w-full" ref={ref}>
      <Input
        id="post_code"
        className={inputClassName}
        onMouseEnter={() => {
          searchHandler(key);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => {
          const inputValue = e?.target?.value;
          setKey(inputValue);
          searchHandler(inputValue);
          
          // Send the actual postcode string value, not the ID
          props.onChange(inputValue);
        }}
        value={key}
        placeholder={post_code}
      />
{/* Dropdown hidden - but same backend behavior maintained */}
    </div>
  );
};

export default PostCodeDetails;
