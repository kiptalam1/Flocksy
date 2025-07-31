import React, { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";
import toast from "react-hot-toast";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/common/Loader";
import { useNavigate, useParams } from "react-router-dom";
import Post from "../components/common/Post";
import Contact from "../components/common/Contact";

const ProfilePage = () => {
	const { id } = useParams();
	const [profile, setProfile] = useState(null);
	const [posts, setPosts] = useState([]);
	const [friends, setFriends] = useState([]);
	const [activeTab, setActiveTab] = useState("posts");
	const { user: authUser, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!authUser) return;
		const targetUserId = id || authUser._id;
		const getProfile = async () => {
			try {
				let res;
				if (!id || id === authUser._id) {
					res = await fetch("/api/users/me", {
						method: "GET",
						credentials: "include",
					});
				} else {
					res = await fetch(`/api/users/user/${targetUserId}`, {
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
		const targetUserId = id || authUser._id;

		const getUserPosts = async () => {
			try {
				const res = await fetch(`/api/posts/user/${targetUserId}`);
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

	// fetch user friends;
	useEffect(() => {
		if (!authUser) return;
		const targetUserId = id || authUser._id;

		const getUserFriends = async () => {
			try {
				const res = await fetch(`/api/users/user/${targetUserId}/friends`);
				const data = await res.json();
				// console.log("friends :", data.friends);
				if (!res.ok)
					return toast.error(data?.error || "Failed to load user's friends");
				setFriends(data.friends);
			} catch (error) {
				console.error("Error fetching user friends :", error.message);
				toast.error("Something went wrong");
			}
		};
		getUserFriends();
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

			{/* Tabs */}
			<div className="w-full border-b border-gray-300 dark:border-gray-700 flex justify-center mt-4">
				<div className="flex justify-between w-full max-w-xs text-sm font-medium text-center">
					<button
						onClick={() => setActiveTab("posts")}
						className={`flex-1 cursor-pointer pb-2 ${
							activeTab === "posts"
								? "border-b-2 border-indigo-500 text-indigo-500"
								: "text-gray-500 hover:text-indigo-400"
						}`}>
						Posts
					</button>
					<button
						onClick={() => setActiveTab("friends")}
						className={`flex-1 cursor-pointer pb-2 ${
							activeTab === "friends"
								? "border-b-2 border-indigo-500 text-indigo-500"
								: "text-gray-500 hover:text-indigo-400"
						}`}>
						Friends
					</button>
				</div>
			</div>

			{/* Content */}
			<main className="flex-1 flex justify-center px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-2xl mt-4 flex flex-col gap-3">
					{activeTab === "posts" ? (
						posts.length === 0 ? (
							<span className="italic text-sm self-center text-gray-400">
								No posts yet
							</span>
						) : (
							posts.map((post) => <Post key={post._id} post={post} />)
						)
					) : friends.length === 0 ? (
						<span className="italic text-sm self-center text-gray-400">
							No friends yet
						</span>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{friends.map((friend) => (
								<Contact
									key={friend._id}
									person={friend}
									onClick={() => navigate(`/profile/${friend._id}`)}
								/>
							))}
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default ProfilePage;
