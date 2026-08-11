import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Heading from "../../../UI/Heading";
import HomeCard from "../../dashboard/home/HomeCard";
import Button from "../../../UI/Button";
import NoImage from "../../../../assets/no-photo.png";

import {
  addDoc,
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../../Firebase";
import { useTheme } from "../../../../store/theme-context";
import FileUploadModal from "../../../../layout/chat-modals/FileUploadModal";
import Search from "../../../../assets/search";
import Like from "../../../../assets/Like";
import Notification from "../../../../assets/Notification";
import FullPageLoading from "../../../UI/FullPageLoading";
import Edit from "../../../../assets/edit.svg";
import Camera from "../../../../assets/Camera";
import Clip from "../../../../assets/Clip";
import Emoji from "../../../../assets/Emoji";
import EmojiKyeboard from "../../../UI/EmojiKyeboard";
import { EmojiClickData } from "emoji-picker-react";
import VerticalDots from "../../../../assets/VerticalDots";
import Download from "../../../../assets/Download";
import { useChat } from "../../../../store/pro/chat-context";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../../../store/pro/auth-pro-context";
import { resolveAssetUrl } from "../../../../utils/resolveAssetUrl";

const initialPageSize = 12;
function ChatItems() {
  const [loading, setLoading] = useState(false);
  const [moreloading, setMoreLoading] = useState(false);
  const [more, setMore] = useState(false);

  const [userInput, setUserInput] = useState("");
  const divRef = useRef<HTMLDivElement>(null);
  const [oldChats, setOldChats] = useState<any>([]);
  const { addChat } = useChat();
  const [pageSize, setPageSize] = useState(initialPageSize);

  const { userData } = useAuth();
  const location = useLocation();
  const state = location.state;

  const user = {
    uid: userData?.id,
    fullName: userData?.full_name,
    photoURL: userData?.img_avatar,
  }; //login user
  const currentUser = {
    uid: state?.userId,
    fullName: state?.fullName,
    photoURL: state?.imgAvatar,
  };
  const [showDropdown, setShowDropdown] = useState(false);
  const combinedId = useMemo(() => {
    if (user?.uid && currentUser?.uid) {
      return +currentUser?.uid < user?.uid
        ? currentUser?.uid + "-" + user?.uid
        : user?.uid + "-" + currentUser?.uid;
    }
    return null;
  }, [user?.uid, currentUser?.uid]);

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchData = async (bool?: boolean) => {
    if (!combinedId) return;
    if (bool) setLoading(true);
    const getChatQuery = query(
      collection(db, "chats"),
      where("chat_id", "==", combinedId)
    );
    const getChatDocument = await getDocs(getChatQuery);
    if (getChatDocument?.docs?.length > 0) {
      const chatRef = collection(
        db,
        "chats",
        getChatDocument.docs[0].id,
        "messages"
      );

      const getMessagesQuery = query(
        chatRef,
        orderBy("timestamp", "desc"),
        limit(pageSize)
      );
      const docs = await getDocs(getMessagesQuery);
      setOldChats(docs.docs.map((doc) => doc?.data()).reverse());
    }
    if (bool) setLoading(false);
  };

  const moreData = async () => {
    setMore(true);
    setPageSize((v) => v + initialPageSize);
  };

  // Real-time listener for messages
  useEffect(() => {
    if (!combinedId) return;

    // Cleanup previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const setupRealtimeListener = async () => {
      const getChatQuery = query(
        collection(db, "chats"),
        where("chat_id", "==", combinedId)
      );
      const getChatDocument = await getDocs(getChatQuery);
      
      if (getChatDocument?.docs?.length > 0) {
        const chatRef = collection(
          db,
          "chats",
          getChatDocument.docs[0].id,
          "messages"
        );

        const getMessagesQuery = query(
          chatRef,
          orderBy("timestamp", "desc"),
          limit(pageSize)
        );

        // Set up real-time listener
        unsubscribeRef.current = onSnapshot(
          getMessagesQuery,
          (snapshot) => {
            const messages = snapshot.docs.map((doc) => doc?.data()).reverse();
            setOldChats(messages);
            setLoading(false);
          },
          (error) => {
            console.error("Error listening to messages:", error);
            setLoading(false);
          }
        );
      } else {
        setOldChats([]);
        setLoading(false);
      }
    };

    setLoading(true);
    setupRealtimeListener();

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combinedId, pageSize]);

  const handleScroll = () => {
    setMoreLoading(true);
    const container = divRef.current;
    if (container) {
      const { scrollTop } = container;
      if (scrollTop === 0) {
        setTimeout(() => setMoreLoading(false), 1000);
        moreData();
      }
    }
  };

  useEffect(() => {
    if (divRef.current && !more) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [oldChats, more]);

  const handleSendMessage = async () => {
    if (!combinedId) return;
    setShow(false);
    setUserInput("");
    //return when spaces
    const nonWhiteSpaceRegex = /\S/;
    if (!nonWhiteSpaceRegex.test(userInput)) {
      return;
    }
    const getChatQuery = query(
      collection(db, "chats"),
      where("chat_id", "==", combinedId)
    );
    const getChatDocument = await getDocs(getChatQuery);
    if (getChatDocument?.docs?.length === 0) {
      // Create chat if it doesn't exist
      const chatData = {
        chat_id: combinedId,
        users_ids: [currentUser?.uid, user?.uid],
        updated_at: serverTimestamp(),
        created_at: serverTimestamp(),
        users: [
          {
            user_id: user?.uid,
            badge: 0,
            full_name: user?.fullName,
          },
          {
            user_id: currentUser?.uid,
            badge: 0,
            full_name: currentUser?.fullName,
          },
        ],
      };
      const temp = await addDoc(collection(db, "chats"), { ...chatData });
      if (currentUser?.uid && state?.businessId) {
        addChat(currentUser.uid, userInput, state.businessId);
      }
      await addDoc(
        collection(db, "chats", temp.id, "messages"),
        {
          message: userInput,
          sender_id: user.uid,
          timestamp: new Date(),
          type: "text",
        }
      );
    } else {
      if (currentUser?.uid && state?.businessId) {
        addChat(currentUser.uid, userInput, state.businessId);
      }
      await addDoc(
        collection(db, "chats", getChatDocument.docs[0].id, "messages"), //docs[0] is already exisiting doc
        {
          message: userInput,
          sender_id: user.uid,
          timestamp: new Date(),
          type: "text",
        }
      );
    }
  };
  const [show, setShow] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const { theme } = useTheme();

  const MIN_TEXTAREA_HEIGHT = 16;
  const MAX_TEXTAREA_HEIGHT = 60;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    if (textareaRef?.current) {
      // Reset height - important to shrink on delete
      textareaRef.current.style.height = "inherit";
      // Set height
      textareaRef.current.style.height = `${Math.max(
        textareaRef.current.scrollHeight,
        MIN_TEXTAREA_HEIGHT
      )}px`;
    }
  }, [userInput]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isSmallScreen = window.innerWidth < 640;

  const handleDropdownClick = () => {
    setShowDropdown(!showDropdown);
  };

  async function aDownload(filename: string, url: string) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.blob();
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL(data);
    a.setAttribute("download", filename);
    a.click();
  }

  const finalChats = [...oldChats];

  const navigate = useNavigate();
  return (
    <div className="relative">
      {imageModal && (
        <FileUploadModal
          onCancel={() => {
            setImageModal(false);
          }}
        />
      )}
      <HomeCard className="rounded-md px-5 pb-5 lg:h-[85vh] ">
        <div className="py-4 flex justify-between">
          <div className="flex items-center w-full justify-between">
            <Heading
              text={`Messages`}
              variant="subHeader"
              headingclassname="!font-bold text-textColor text-xl tracking-wide dark:text-white"
            />
            <Button
              buttonClassName="!border-none"
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </div>
          <div className="flex gap-3 lg:hidden">
            {theme === "light" && (
              <div children={<Notification color="#1A1B1C" />} />
            )}
            {theme === "dark" && (
              <div children={<Notification color="white" />} />
            )}
            {theme === "light" && <div children={<Search color="#1A1B1C" />} />}
            {theme === "dark" && <div children={<Search color="white" />} />}
            {theme === "light" && <div children={<Like color="#1A1B1C" />} />}
            {theme === "dark" && <div children={<Like color="white" />} />}
          </div>
        </div>
        <div className="bg-gray-100 dark:bg-black p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-poppins-bold text-xl">
                {currentUser?.fullName}
              </p>
            </div>
            <div className="lg:flex gap-3 justify-end my-2 xs:hidden">
              {theme === "light" && (
                <div children={<Notification color="#1A1B1C" />} />
              )}
              {theme === "dark" && (
                <div children={<Notification color="white" />} />
              )}
              {theme === "light" && (
                <div children={<Search color="#1A1B1C" />} />
              )}
              {theme === "dark" && <div children={<Search color="white" />} />}
              {theme === "light" && <div children={<Like color="#1A1B1C" />} />}
              {theme === "dark" && <div children={<Like color="white" />} />}
            </div>
          </div>
          <div
            ref={divRef}
            onScroll={handleScroll}
            className="2xl:h-[60vh] flex flex-col xl:h-[50vh] lg:h-[50vh] md:h-[77vh] xs:h-[60vh] overflow-y-scroll pb-10 soft-searchbar lg:px-5 xs:px-2"
          >
            {loading && <FullPageLoading className="h-full !bg-transparent" />}
            {moreloading && !loading && (
              <FullPageLoading className="h-10 !bg-transparent" />
            )}
            <div>
              {!loading &&
                finalChats?.map((message: any) => (
                  <div
                    key={message?.sender_id}
                    className={`flex gap-3 justify-start my-3 ${
                      message?.sender_id === currentUser?.uid
                        ? "justify-start"
                        : "justify-end"
                    }`}
                  >
                    {message?.sender_id === currentUser?.uid && (
                      <img
                        src={
                          currentUser?.photoURL
                            ? resolveAssetUrl(currentUser?.photoURL)
                            : NoImage
                        }
                        className="w-8 h-8 rounded-full object-cover"
                        alt="User Icon"
                      />
                    )}
                    <div
                      className={`rounded-lg  w-max ${
                        message?.sender_id === user?.uid
                          ? "bg-gray-200 dark:bg-dimGray"
                          : "bg-blue-500 text-white"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      {message?.message && (
                        <div className="  w-full break-all p-2 ">
                          {message?.message}
                        </div>
                      )}
                      {message?.file && message?.type === "image" && (
                        <div className="  w-full break-all p-0.5 ">
                          <a
                            href={message?.file}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={message?.file}
                              className="h-64 object-contain w-full rounded-lg"
                            />
                          </a>
                        </div>
                      )}
                      {message?.file && message?.type === "pdf" && (
                        <div className="  w-full break-all p-2 ">
                          {/* <a href={message?.file} target="_blank"
                              rel="noreferrer"> */}
                          <div className="flex gap-2">
                            {message?.file_name}
                            {
                              <div
                                children={<Download color="white" />}
                                onClick={() =>
                                  aDownload(message?.file_name, message?.file)
                                }
                              />
                            }
                          </div>
                          {/* </a> */}
                        </div>
                      )}

                      <div className="text-xs text-gray-600 text-end p-1">
                        {/* {message?.timestamp.time} */}
                        {new Date(
                          message?.timestamp?.seconds * 1000
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </div>
                    </div>
                    {message?.sender_id !== currentUser?.uid && (
                      <img
                        src={
                          user?.photoURL
                            ? resolveAssetUrl(user?.photoURL)
                            : NoImage
                        }
                        className="w-8 h-8 rounded-full object-cover"
                        alt="Bot Icon"
                      />
                    )}
                  </div>
                ))}
            </div>
            {!loading && oldChats?.length === 0 && (
              <div className="flex justify-center items-center h-full text-slate-400 font-semibold text-lg gap-3">
                <img src={Edit} alt="Edit Icon" />
                Start a New Chat
              </div>
            )}
          </div>
          <div className=" w-full sticky bottom-0  xl:py-3 lg:py-0 xs:py-2 lg:px-5 xs:px-2 bg-slate-100 dark:bg-black">
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <div className="mt-4 flex xs:gap-1 md:gap-4 items-center">
                <textarea
                  onChange={(e: any) => {
                    setShow(false);
                    e.target.value.replace(" ", "");

                    setUserInput(
                      !userInput
                        ? e.target.value.replace(" ", "")
                        : e.target.value
                    );
                  }}
                  onKeyDown={handleKeyPress}
                  onMouseEnter={() => setShow(false)}
                  ref={textareaRef}
                  style={{
                    minHeight: MIN_TEXTAREA_HEIGHT,
                    maxHeight: MAX_TEXTAREA_HEIGHT,
                    resize: "none",
                  }}
                  rows={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 break-all"
                  value={userInput}
                  placeholder="Type message..."
                />
                {isSmallScreen ? (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Button
                        buttonClassName="!border-none"
                        variant="ghost"
                        onClick={handleDropdownClick}
                      >
                        <VerticalDots
                          color={theme === "dark" ? "white" : "#1A1B1C"}
                        />
                      </Button>
                      {showDropdown && (
                        <div className="absolute bg-slate-200 dark:bg-dimGray bottom-12 mt-2 w-max rounded-lg ">
                          <div className="flex flex-col p-2 gap-4">
                            <div className="flex items-center gap-2">
                              {theme === "light" && (
                                <div children={<Camera color="#1A1B1C" />} />
                              )}
                              {theme === "dark" && (
                                <div children={<Camera color="white" />} />
                              )}
                              <Heading variant="smallTitle" text={"Camera"} />
                            </div>
                            <div className="flex items-center gap-2">
                              {theme === "light" && (
                                <div
                                  children={<Clip color="#1A1B1C" />}
                                  onClick={() => {
                                    setImageModal(!imageModal);
                                  }}
                                />
                              )}
                              {theme === "dark" && (
                                <div
                                  children={<Clip color="white" />}
                                  onClick={() => {
                                    setImageModal(!imageModal);
                                  }}
                                />
                              )}
                              <Heading
                                variant="smallTitle"
                                text={"Upload Files"}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              {theme === "light" && (
                                <div
                                  children={<Emoji color="#1A1B1C" />}
                                  onClick={() => setShow(!show)}
                                />
                              )}
                              {theme === "dark" && (
                                <div
                                  children={<Emoji color="white" />}
                                  onClick={() => setShow(!show)}
                                />
                              )}
                              <Heading variant="smallTitle" text={"Emoji"} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    {theme === "light" && (
                      <div children={<Camera color="#1A1B1C" />} />
                    )}
                    {theme === "dark" && (
                      <div children={<Camera color="white" />} />
                    )}
                    {theme === "light" && (
                      <div
                        children={<Clip color="#1A1B1C" />}
                        onClick={() => {
                          setImageModal(!imageModal);
                        }}
                      />
                    )}
                    {theme === "dark" && (
                      <div
                        children={<Clip color="white" />}
                        onClick={() => {
                          setImageModal(!imageModal);
                        }}
                      />
                    )}
                    {theme === "light" && (
                      <div
                        children={<Emoji color="#1A1B1C" />}
                        onClick={() => setShow(!show)}
                      />
                    )}
                    {theme === "dark" && (
                      <div
                        children={<Emoji color="white" />}
                        onClick={() => setShow(!show)}
                      />
                    )}
                  </div>
                )}
                {show && (
                  <EmojiKyeboard
                    onChange={(emojiObject: EmojiClickData) => {
                      setUserInput(userInput + emojiObject.emoji);
                    }}
                  />
                )}

                <Button
                  centerClassName="flex justify-center items-center"
                  disabled={userInput.length === 0 || userInput === ""}
                  buttonClassName="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 w-24 disabled:text-white mt-1.5 h-full"
                  type="submit"
                >
                  Send
                </Button>
              </div>
            </form>
          </div>
        </div>
      </HomeCard>
    </div>
  );
}

export default ChatItems;
