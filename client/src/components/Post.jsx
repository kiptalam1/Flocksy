import React, { useState } from "react";
import toast from "react-hot-toast";
import { SlLike } from "react-icons/sl";
// import { FaRegComment } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { formatShortTime } from "../utils/formatTime.js";
import { useAuth } from "../contexts/AuthContext.jsx";

const Post = ({ post }) => {
	const { user } = useAuth();
	const [likes, setLikes] = useState(post.likes || []);
	const [isFriend, setIsFriend] = useState(post.requestStatus === "accepted");
	const [requestStatus, setRequestStatus] = useState(
		post.requestStatus || "none"
	);

	const hasLiked = likes.includes(user._id);
	const isMyPost = user._id === post.user._id;

	const handleLike = async () => {
		const updatedLikes = hasLiked
			? likes.filter((id) => id !== user._id)
			: [...likes, user._id];
		setLikes(updatedLikes);

		try {
			const res = await fetch(`/api/posts/post/${post._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user._id }),
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to like post");
			setLikes(data.post.likes);
		} catch (error) {
			console.error("handleLike error:", error.message);
			setLikes(
				hasLiked ? [...likes, user._id] : likes.filter((id) => id !== user._id)
			);
			toast.error("Something went wrong while liking");
		}
	};

	const sendFriendRequest = async () => {
		try {
			const res = await fetch(`/api/friends/request/${post.user._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Follow request failed");

			setRequestStatus("pending");
		} catch (error) {
			console.error("sendFriendRequest error:", error.message);
			toast.error("Something went wrong");
		}
	};

	const unFriendUser = async () => {
		try {
			const res = await fetch(`/api/friends/unfriend/${post.user._id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Failed to unfollow");

			toast.success(data?.message || "Success");
			setIsFriend(false);
			setRequestStatus("none");
		} catch (error) {
			console.error("unFriendUser error:", error.message);
			toast.error("Something went wrong");
		}
	};

	const acceptRequest = async (requestId) => {
		try {
			const res = await fetch(`/api/friends/request/${requestId}/accept`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok)
				return toast.error(data?.error || "Failed to accept request");

			setIsFriend(true);
			setRequestStatus("accepted");
			toast.success(data?.message || "Request accepted");
		} catch (error) {
			console.error("acceptRequest error:", error.message);
			toast.error("Something went wrong");
		}
	};

	const handleFollowAction = async () => {
		if (isFriend) {
			await unFriendUser();
		} else if (requestStatus === "none" || requestStatus === "declined") {
			await sendFriendRequest();
		} else if (requestStatus === "incoming") {
			await acceptRequest(post.requestId); // 👈 Add this
		}
	};

	const renderFollowText = () => {
		if (isFriend) return "Unfollow";
		if (requestStatus === "pending") return "Request Sent";
		if (requestStatus === "incoming") return "Accept Request"; // 👈 new
		return "Follow";
	};


	const followClass = isFriend
		? "text-red-500 hover:underline"
		: requestStatus === "pending"
		? "text-gray-400"
		: "text-blue-600 hover:underline";

	return (
		<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md w-full h-auto p-4 shadow-lg">
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={post?.user?.profileImage || "/avatar-placeholder.png"}
					alt={post?.user?.firstName}
				/>
				<p className="text-base hover:underline cursor-pointer">
					{post?.user?.firstName} {post?.user?.lastName}
				</p>
				<span className="text-xs text-gray-400">
					{formatShortTime(post?.createdAt)}
				</span>

				{!isMyPost && (
					<p
						className={`ml-auto text-sm cursor-pointer ${followClass}`}
						onClick={handleFollowAction}>
						{renderFollowText()}
					</p>
				)}
			</div>

			<div className="text-base">{post?.text}</div>

			{post?.image && (
				<div className="w-full aspect-video h-max rounded-md overflow-hidden  ">
					<img
						loading="lazy"
						className="w-full max-h-80 object-cover rounded-md"
						src={post?.image}
						alt={post?.user?.firstName}
					/>
				</div>
			)}

			<div className="flex items-center gap-4 py-2 px-4 text-sm text-gray-600 dark:text-gray-300">
				<div
					onClick={handleLike}
					className={`flex items-center gap-1 cursor-pointer ${
						hasLiked ? "text-blue-600" : ""
					}`}>
					<SlLike />
					<span>{likes.length}</span>
				</div>
				<div className="flex items-center gap-1 cursor-pointer">
					<FaRegComment />
				</div>
			</div>
		</div>
	);
};

export default Post;
