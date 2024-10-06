import AuthGuard from "@/shared/components/AuthGuard";
import PageHeading from "@/shared/components/PageHeading";
import SectionHeading from "@/shared/components/SectionHeading";
import { Metadata } from "next";
import ProfileForm from "../_components/ProfileForm";

export const metadata: Metadata = {
  title: "Account Settings",
};

const EditProfilePage = () => {
  return (
    <>
      <PageHeading back="/profile">Account Settings</PageHeading>
      <SectionHeading>Profile</SectionHeading>
      <AuthGuard>
        <ProfileForm />
      </AuthGuard>
    </>
  );
};
export default EditProfilePage;
