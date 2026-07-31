import SettingsCard from "../SettingsCard";
import UserImage from "../../../../assets/user-image-big.png";
import Button from "../../../UI/Button";
import PersonalInfoForm from "./PersonalInfoForm";
import { useState } from "react";
import ProfileImageModal from "../../../../layout/home/ProfileImageModal";
import useSWR from "swr";
import { fetcher } from "../../../../store/customer/home-context";
import { UserData } from "../../../../models/user";
import profileAvatar from "../../../../assets/avatar.svg";
import DeleteImageModal from "../../../../layout/pro-models/DeleteImageModal";
import { API_BASE_URL, buildApiUrl, API_ENDPOINTS } from "../../../../config/api";
import { resolveAssetUrl } from "../../../../utils/resolveAssetUrl";

function PersonalInfo() {
  const [profileModal, setProfileModal] = useState(false);
  const token = localStorage.getItem("data");
  let userData: any;
  if (token) {
    userData = JSON.parse(token);
  }

  const url = buildApiUrl(`${API_ENDPOINTS.USER_DETAIL}?user_id=${userData?.id}`);
  const { data } = useSWR(url, fetcher);
  const profileData: UserData = data?.data ?? "";
  const profilePhoto = resolveAssetUrl(profileData?.img_avatar);
  const [deleteImageHandler, setDeleteImageHandler] = useState(false);

  return (
    <>
      {profileModal && (
        <ProfileImageModal
          onCancel={() => {
            setProfileModal(false);
          }}
        />
      )}
      {deleteImageHandler && (
        <DeleteImageModal
          onCancel={() => {
            setDeleteImageHandler(false);
          }}
        />
      )}
      <SettingsCard>
        <div className="flex items-center lg:gap-10 xs:gap-5">
          <img
            src={profileData?.img_avatar ? profilePhoto : profileAvatar}
            className="md:w-44 xs:w-24 h-44 object-cover object-center rounded-full"
          />
          <div className="flex flex-col gap-3">
            <Button
              variant="filled"
              color="primary"
              size="normal"
              children="Upload New Picture"
              buttonClassName="!px-6 !py-3 text-sm tracking-wide "
              onClick={() => setProfileModal(true)}
            />
            {profileData?.img_avatar && (
              <Button
                variant="ghost"
                color="error"
                size="normal"
                children="Delete"
                buttonClassName="!px-6 !py-3 text-sm tracking-wider border-slate-500"
                centerClassName="flex justify-center items-center"
                onClick={() => {
                  setDeleteImageHandler(!deleteImageHandler);
                }}
              />
            )}
          </div>
        </div>
        <PersonalInfoForm />
      </SettingsCard>
    </>
  );
}

export default PersonalInfo;
