import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
	const { id } = useParams();
	const [profile, setProfile] = useState(null);
	const { user: authUser, loading } = useAuth();

	useEffect(() => {
		if (!authUser) return;
		const getProfile = async () => {
			try {
				let res;
				if (!id || id === authUser._id) {
					res = await fetch("/api/users/me", {
						method: "GET",
						credentials: "include",
					});
				} else {
					res = await fetch(`/api/users/user/${id}`, {
						method: "GET",
						credentials: "include",
					});
				}
				const data = await res.json();
				console.log("User :", data.user);
				if (!res.ok)
					return toast.error(data?.error || "Failed to load profile");
				setProfile(data.user);
			} catch (error) {
				console.error("Error fetching my profile :", error.message);
				toast.error("Something went wrong");
			}
		};
		getProfile();
	}, [id, authUser]);

	if (loading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col ">
			<Navbar />
			<ProfileHeader user={profile} authUser={authUser} />
		</div>
	);
};

export default ProfilePage;
