import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

const ProfilePage = () => {
	const [user, setUser] = useState(null);
	const { loading } = useAuth();

	useEffect(() => {
		const getMyProfile = async () => {
			try {
				const res = await fetch("/api/users/me", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				console.log("User :", data.user);
				if (!res.ok)
					return toast.error(data?.error || "Failed to load profile");
				setUser(data.user);
			} catch (error) {
				console.error("Error fetching my profile :", error.message);
				toast.error("Something went wrong");
			}
		};
		getMyProfile();
	}, []);

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
			<ProfileHeader user={user} />
		</div>
	);
};

export default ProfilePage;
