import React, { useState } from "react";
import toast from "react-hot-toast";
import { SlLike } from "react-icons/sl";
import { Trash } from "lucide-react";
import { LoaderCircle } from "lucide-react";
// import { FaRegComment } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { formatShortTime } from "../../utils/formatTime.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

const Post = ({ post, onDelete, isDetailsPage = false }) => {
	const { user } = useAuth();
	const [likes, setLikes] = useState(post.likes || []);
	const [isFriend, setIsFriend] = useState(post.requestStatus === "accepted");
	const [requestStatus, setRequestStatus] = useState(
		post.requestStatus || "none"
	);
	const [isDeleting, setIsDeleting] = useState(false);
	const navigate = useNavigate();

	const hasLiked = user ? likes.includes(user._id) : false;
	const isMyPost = user?._id === post?.user?._id;

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

	const handleDeletePost = async () => {
		if (!window.confirm("Delete this post?")) return;
		setIsDeleting(true);
		try {
			const res = await fetch(`/api/posts/post/${post._id}`, {
				method: "DELETE",
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data?.error || "Failed to delete post");
				return;
			}
			toast.success("Post deleted");
			onDelete?.(post._id); // 🔥 key line
		} catch (err) {
			console.error("Delete error", err);
			toast.error("Failed to delete");
		} finally {
			setIsDeleting(false);
		}
	};

	const followClass = isFriend
		? "text-red-400 hover:underline"
		: requestStatus === "pending"
		? "text-gray-400"
		: "text-blue-600 hover:underline";

	const postBody = (
		<div className="mt-2">
			<div className="text-base">{post?.text}</div>
			{post?.image && (
				<div className="w-full aspect-video h-max rounded-md overflow-hidden mt-2">
					<img
						loading="lazy"
						className="w-full max-h-80 object-cover rounded-md"
						src={post?.image}
						alt={post?.user?.firstName}
					/>
				</div>
			)}
		</div>
	);

	return (
		<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md w-full h-auto p-4 shadow-lg">
			{/* Header */}
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={post?.user?.profileImage || "/avatar-placeholder.png"}
					alt={post?.user?.firstName}
				/>
				<p
					className="text-base hover:underline cursor-pointer"
					onClick={() => navigate(`/profile/${post?.user?._id}`)}>
					{post.user.firstName} {post.user.lastName}
				</p>
				<span className="text-xs text-gray-400">
					{formatShortTime(post?.createdAt)}
				</span>

				{isMyPost ? (
					<button
						onClick={handleDeletePost}
						className="ml-auto p-1 text-gray-500 hover:text-red-600 cursor-pointer transition"
						aria-label="Delete Post">
						{isDeleting ? (
							<LoaderCircle className="animate-spin w-5 h-5" />
						) : (
							<Trash className="w-5 h-5" />
						)}
					</button>
				) : (
					<p
						className={`ml-auto text-sm cursor-pointer ${followClass}`}
						onClick={handleFollowAction}>
						{renderFollowText()}
					</p>
				)}
			</div>

			{/* Content Body */}
			{isDetailsPage ? (
				postBody
			) : (
				<Link to={`/post/${post._id}`}>{postBody}</Link>
			)}

			{/* Actions */}
			<div className="flex items-center gap-4 py-2 px-4 text-sm text-gray-600 dark:text-gray-300">
				<div
					onClick={handleLike}
					className={`flex items-center gap-1 cursor-pointer ${
						hasLiked ? "text-blue-600" : ""
					}`}>
					<SlLike />
					<span>{likes.length}</span>
				</div>

				<Link
					to={`/post/${post._id}`}
					className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors">
					<FaRegComment />
					{/* <span>{post.comments.length}</span> */}
				</Link>
			</div>
		</div>
	);
};

export default Post;
