import DealerPhotosSkeleton from "../skeleton/DealerPhotosSkeleton";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { Business } from "../../../../models/customer/businesslist";
import { useLocation, useParams } from "react-router";
import { useTheme } from "../../../../store/theme-context";
import Modal from "react-modal";
import styles from "../../../../styles/ReactModa.module.css";
import Close from "../../../../assets/close";
import LeftArrow from "../../../../assets/left-arrow.svg";
import RightArrow from "../../../../assets/right-arrow.svg";

import Heading from "../../../UI/Heading";
import { useState } from "react";
// import Modal from "../../../../layout/home/Modal";

function PhotosSection() {
  const { id } = useParams();
  const url = `https://erranddo.com/admin/api/v1/businesses/${id}/detail`;
  const { data, error } = useSWR(url, fetcher);
  const photoData: Business = data?.data;
  const isLoading = !data && !error;
  const [imgShow, setimgShow] = useState(false);
  const userRequestId = useLocation()?.state?.userRequestId;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return <DealerPhotosSkeleton limit={6} />;
  }

  if (error) {
    // Handle the error state here
    return <div>Error occurred while fetching data</div>;
  }

  if (!photoData || !photoData.files || photoData.files.length === 0) {
    return (
      <div className="w-full flex lg:flex-row xs:flex-col gap-3 justify-center">
        <Heading
          headingclassname=""
          text={`No Photos !! `}
          variant="subTitle"
        />
      </div>
    );
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex - 1);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => prevIndex + 1);
  };
  console.log(currentImageIndex);
  return (
    <div>
      <div className="my-3 ">
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
                currentImageIndex + 1 === photoData.files.length ? true : false
              }
            >
              <img src={RightArrow} className="w-10 h-10" />
            </button>
            <div className={styles.modalcontent}>
              {photoData.files[currentImageIndex].file_path.endsWith(".mp4") ? (
                <video
                  loop={true}
                  preload="auto"
                  autoPlay={true}
                  src={`https://erranddo.com/admin/storage/${photoData.files[currentImageIndex].file_path}`}
                  className="w-[100%] lg:max-h-[40rem] xs:max-h-[30rem] object-cover"
                />
              ) : (
                <img
                  src={`https://erranddo.com/admin/storage/${photoData.files[currentImageIndex].file_path}`}
                  alt={"image"}
                  className="w-[100%] lg:max-h-[40rem] xs:max-h-[30rem] object-cover"
                />
              )}
            </div>
          </Modal>
        )}
        <div className="grid lg:grid-cols-3 xs:grid-cols-1 gap-1 my-2">
          {photoData.files.map((photo, index) => (
            <div key={index}>
              {photo.file_path.endsWith(".mp4") ? (
                <video
                  loop={true}
                  muted={true}
                  preload="auto"
                  autoPlay={true}
                  onClick={() => {
                    setCurrentImageIndex(index);
                    setimgShow(true);
                  }}
                  src={`https://erranddo.com/admin/storage/${photo.file_path}`}
                  className="lg:h-60 md:h-36 xs:h-44 w-full object-cover"
                />
              ) : (
                <img
                  onClick={() => {
                    setCurrentImageIndex(index);

                    setimgShow(true);
                  }}
                  src={`https://erranddo.com/admin/storage/${photo.file_path}`}
                  alt={`Photo`}
                  className="lg:h-60 md:h-36 xs:h-44 w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PhotosSection;
