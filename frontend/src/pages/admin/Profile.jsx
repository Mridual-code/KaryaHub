import {
    useEffect,
    useState
} from "react";

import { toast } from "react-toastify";

import {
    getProfile,
    updateProfile,
    changePassword
} from "../../services/profileService";

import ProfileCard from "../../components/profile/ProfileCard";
import ProfileForm from "../../components/profile/ProfileForm";
import ChangePasswordCard from "../../components/profile/ChangePasswordCard";

function Profile() {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        loadProfile();

    }, []);

    const loadProfile = async () => {

        try {

            const data = await getProfile();

            setProfile(
                data.user ||
                data.profile ||
                data
            );

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to load profile"
            );

        }

    };

    const saveProfile = async (body) => {

        try {

            await updateProfile(body);

            await loadProfile();

            toast.success(
                "Profile updated successfully"
            );

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to update profile"
            );

        }

    };

    const updatePassword = async (body) => {

        try {

            await changePassword(body);

            toast.success(
                "Password updated successfully"
            );

        } catch (err) {

            console.log(err);

            toast.error(
                err.response?.data?.message ||
                "Failed to update password"
            );

        }

    };

    return (

        <div>

            <div className="page-header">

                <h1>
                    My Profile
                </h1>

            </div>

            <ProfileCard
                profile={profile}
            />

            <ProfileForm
                profile={profile}
                onSave={saveProfile}
            />

            <ChangePasswordCard
                onChangePassword={
                    updatePassword
                }
            />

        </div>

    );

}

export default Profile;