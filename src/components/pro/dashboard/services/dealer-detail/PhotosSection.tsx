import DustbinIcon from "../../../../../assets/delete-svgrepo-com.svg";
import DealerPhotosSkeleton from "../../../skeleton/Dealer/DealerPhotosSkeleton";
import { useState } from "react";
import DeletePhotoModal from "../../../../../layout/pro-models/DeletePhotoModal";
import { File } from "../../../../../models/pro/business";
import Heading from "../../../../UI/Heading";
import UploadPhotosLayout from "../../../../../layout/pro-models/UploadPhotosLayout";
import HomeCard from "../../home/HomeCard";
import Add from "../../../../../assets/Add";
import { useTheme } from "../../../../../store/theme-context";
import Modal from "react-modal";
import styles from "../../../../../styles/ReactModa.module.css";
import Close from "../../../../../assets/close";
import LeftArrow from "../../../../../assets/left-arrow.svg";
import RightArrow from "../../../../../assets/right-arrow.svg";

function PhotoWithDustbin(props: {
  src: any;
  alt: string;
  id: number;
  index: number;
  images: File[];
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [imgShow, setimgShow] = useState(false);
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(props.index);
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };
  console.log(props?.images?.length, currentImageIndex);
  return (
    <div className="relative">
      {imgShow && (
        <Modal
          isOpen={imgShow}
          onRequestClose={() => setimgShow(false)}
          className={styles.modal}
          overlayClassName={styles.modaloverlay}
        >
          <button
            type="button"
            className="fixed top-10 lg:right-24 xs:right-10 w-full flex justify-end h-max"
            onClick={() => {
              console.log("close");
              setimgShow(false);
            }}
          >
            <div children={<Close color="white" />} />
          </button>
          <button
            className="w-12 h-12 fixed lg:left-24 xs:left-0 flex justify-center items-center "
            onClick={() => {
              prevImage();
            }}
            disabled={currentImageIndex === 0 ? true : false}
          >
            <img src={LeftArrow} className="w-12 h-12" />
          </button>
          <button
            className="fixed  lg:right-24 xs:right-0 flex justify-end items-center h-max "
            onClick={nextImage}
            disabled={
              currentImageIndex + 1 === props.images.length ? true : false
            }
          >
            <img src={RightArrow} className="w-10 h-10" />
          </button>
          <div className={styles.modalcontent}>
            {props.images[currentImageIndex].file_path.endsWith(".mp4") ? (
              <video
                loop={true}
                preload="auto"
                autoPlay={true}
                src={`https://erranddo.s3.eu-west-2.amazonaws.com/${props.images[currentImageIndex].file_path}`}
                className="w-[100%] lg:max-h-[40rem] xs:max-h-[30rem] object-cover"
              />
            ) : (
              <img
                src={`https://erranddo.s3.eu-west-2.amazonaws.com/${props.images[currentImageIndex].file_path}`}
                alt={props.alt}
                className="w-[100%] lg:max-h-[40rem] xs:max-h-[30rem] object-cover"
              />
            )}
          </div>
        </Modal>
      )}
      {deleteModal && (
        <DeletePhotoModal
          onCancel={() => {
            setDeleteModal(false);
          }}
          id={props.id}
        />
      )}
      {props.src.endsWith(".mp4") ? (
        <video
          loop={true}
          muted={true}
          preload="auto"
          autoPlay={true}
          onClick={() => setimgShow(true)}
          src={props.src}
          className="lg:h-60 md:h-36 xs:h-28 w-full object-cover"
        />
      ) : (
        <img
          onClick={() => setimgShow(true)}
          src={props.src}
          className="lg:h-60 md:h-36 xs:h-28 w-full object-cover"
          alt={props.alt}
        />
      )}
      <div className="absolute bottom-1 right-1">
        <button
          onClick={() => {
            setDeleteModal(true);
          }}
        >
          <div className="w-5 h-5 bg-white">
            <img src={DustbinIcon} className="w-3 h-5 m-1" alt="Dustbin Icon" />
          </div>
        </button>
      </div>
    </div>
  );
}

function PhotosSection(props: { images: File[] }) {
  const isLoading = false;
  const [show, setShow] = useState(false);
  const { theme } = useTheme();

  return (
    <div>
      {isLoading ? (
        <DealerPhotosSkeleton limit={6} />
      ) : (
        <div className="my-3">
          {show && <UploadPhotosLayout onCancel={() => setShow(false)} />}

          {props.images.length > 0 ? (
            <div className="grid lg:grid-cols-3 xs:grid-cols-2 w-full gap-1 my-2 h-max">
              {props.images.map((image, key) => {
                return (
                  <div className="col-span-1 border-[0.4px] border-slate-200">
                    <PhotoWithDustbin
                      index={key}
                      images={props.images}
                      id={image.id}
                      src={`https://erranddo.s3.eu-west-2.amazonaws.com/${image.file_path}`}
                      alt="Photo One"
                    />
                  </div>
                );
              })}
              <HomeCard
                children={
                  <div
                    onClick={() => setShow(true)}
                    className="xs:py-10 lg:py-16 border border-dashed rounded !border-[#707070] h-full flex justify-center items-center flex-col gap-5 cursor-pointer"
                  >
                    <div>
                      {theme === "light" && (
                        <div children={<Add color="black" />} />
                      )}

                      {theme === "dark" && (
                        <div children={<Add color="white" />} />
                      )}
                    </div>
                    <Heading
                      text={"Add Image"}
                      variant="subHeader"
                      headingclassname={` !font-semibold tracking-wide !text-lg text-slate-700  dark:text-white`}
                    />
                  </div>
                }
                className="!bg-transparent "
              />
            </div>
          ) : (
            <div className="w-full flex lg:flex-row xs:flex-col gap-3 justify-center">
              <Heading
                headingclassname=""
                text={`No Photos !! `}
                variant="subTitle"
              />
              <div onClick={() => setShow(true)}>
                <Heading
                  headingclassname="text-primaryBlue cursor-pointer"
                  text={`Upload your Service Photos`}
                  variant="subTitle"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotosSection;
