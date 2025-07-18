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

	const hasLiked = likes.includes(user._id);

	const handleLike = async () => {
		// Optimistic update
		const updatedLikes = hasLiked
			? likes.filter((id) => id !== user._id)
			: [...likes, user._id];
		setLikes(updatedLikes);

		try {
			const res = await fetch(`/api/posts/post/${post._id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: user._id }),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error || "Failed to like post");
			}
			// Sync with backend
			setLikes(data.post.likes);
		} catch (error) {
			console.error("Error in handleLike function :", error.message);
			// Revert optimistic update
			setLikes(
				hasLiked ? [...likes, user._id] : likes.filter((id) => id !== user._id)
			);
			toast.error("Something went wrong while liking");
		}
	};

	return (
		<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md max-w-md w-full h-auto p-4 shadow-lg">
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={post?.user?.profileImage}
					alt={post?.user?.firstName}
				/>
				<p className="text-base hover:underline cursor-pointer">
					{post?.user?.firstName} {post?.user?.lastName}
				</p>
				<span className="text-xs text-gray-400">
					{formatShortTime(post?.createdAt)}
				</span>
				<p className="ml-auto text-blue-600 cursor-pointer hover:underline">
					Follow
				</p>
			</div>

			<div className="text-base">{post?.text}</div>

			{post?.image && (
				<div className="w-full h-max rounded-md">
					<img
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
