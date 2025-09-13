import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { useTheme } from "../../store/theme-context";
import Modal from "../home/Modal";
import Close from "../../assets/close";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../Firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { v4 } from "uuid";

const FileUploadModal = ({ onCancel }: { onCancel: () => void }) => {
  const { theme } = useTheme();
  const [img, setImg] = useState<any>();
  const user = { uid: "1", fullName: "wewew", photoURL: "" };
  const currentUser = { uid: "2", fullName: "hello", photoURL: "" };

  const combinedId =
    +currentUser.uid < +user?.uid
      ? currentUser.uid + "-" + user?.uid
      : user?.uid + "-" + currentUser.uid;
  const extension = img ? img.name.split(".").pop() : "";
  let fileType: string;
  if (extension === "png" || extension === "jpg" || extension === "jpeg") {
    fileType = "image";
  } else if (extension === "pdf") {
    fileType = "pdf";
  }
  const handleClick = async () => {
    // console.log('hello');

    const getChatQuery = query(
      collection(db, "chats"),
      where("chat_id", "==", combinedId)
    );
    const getChatDocument = await getDocs(getChatQuery);
    if (getChatDocument.docs.length > 0) {
      try {
        const delay = (ms: any) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        const imgRef = ref(storage, `chats/${combinedId}/${img?.name}`);
        uploadBytes(imgRef, img).then(async (snapshot) => {
          await addDoc(
            collection(db, "chats", getChatDocument.docs[0].id, "messages"), //docs[0] is already exisiting doc
            {
              file: await getDownloadURL(snapshot.ref),
              file_name: img?.name,
              sender_id: user.uid,
              timestamp: new Date(),
              type: fileType,
            }
          );
          await delay(4000);
          onCancel();
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Modal className="bg-slate-100 opacity-90 rounded-lg lg:w-[70vh] xs:w-[40vh]  dark:bg-modalDarkColor">
      <button
        className=" absolute top-5 right-5"
        onClick={() => {
          onCancel();
        }}
      >
        {theme === "light" && <div children={<Close color="black" />} />}
        {theme === "dark" && <div children={<Close color="white" />} />}
      </button>

      <div className="flex flex-col ">
        <div className="mt-7 lg:w-[67vh] xs:w-[37vh]">
          <label className="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            <span className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="font-medium text-gray-600">
                Drop files to Attach, or
                <span className="text-blue-600 underline mx-2">browse</span>
              </span>
            </span>

            <input
              type="file"
              name="img_avatar"
              id="img_avatar"
              className="hidden"
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                ev.preventDefault();
                if (ev?.target?.files) {
                  console.log(ev?.target?.files[0]);
                  if (ev?.target?.files?.length > 0) {
                    setImg(ev?.target?.files[0]);
                  }
                }
              }}
            />
          </label>
        </div>
        <div className="flex gap-2 items-center justify-center mt-5 lg:w-[67vh] xs:w-[37vh]">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            children="Cancel"
            onClick={() => onCancel()}
            centerClassName="flex justify-center items-center"
            buttonClassName="!px-3 font-poppins py-3 w-full"
          />
          <Button
            // loading={isLoading}
            onClick={() => handleClick()}
            type="submit"
            variant="filled"
            color="primary"
            children="Submit"
            centerClassName="flex justify-center items-center"
            buttonClassName="!px-3 font-poppins py-3 w-full"
          />
        </div>
      </div>
    </Modal>
  );
};

export default FileUploadModal;
