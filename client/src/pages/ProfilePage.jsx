import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import Post from "../components/Post";

const ProfilePage = () => {
	const { id } = useParams();
	const [profile, setProfile] = useState(null);
	const [posts, setPosts] = useState([]);
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
				// console.log("User :", data.user);
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

	useEffect(() => {
		if (!authUser) return;

		const getUserPosts = async () => {
			try {
				const res = await fetch(`/api/posts/user/${id}`);
				const data = await res.json();
				// console.log("posts :", data);
				if (!res.ok)
					return toast.error(data?.error || "Failed to load user posts");
				setPosts(data.posts);
			} catch (error) {
				console.error("Error fetching user posts :", error.message);
				toast.error("Something went wrong");
			}
		};
		getUserPosts();
	}, [id, authUser]);

	if (loading) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col">
			<Navbar />
			<ProfileHeader user={profile} authUser={authUser} />

			<main className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-2xl mt-4 flex flex-col gap-3">
					{posts.length === 0 && (
						<span className="italic text-sm self-center text-gray-300 dark:text-gray-500">
							No posts yet
						</span>
					)}
					{posts && posts.map((post) => <Post key={post._id} post={post} />)}
				</div>
			</main>
		</div>
	);
};

export default ProfilePage;
