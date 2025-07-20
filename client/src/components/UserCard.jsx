import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import Loader from "./Loader";

const UserCard = ({ user }) => {
	const { user: currentUser } = useAuth();
	const [requestStatus, setRequestStatus] = useState(
		user.requestStatus || "none"
	);

	const handleAddFriend = async () => {
		try {
			const res = await fetch(`/api/friends/request/${user._id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Failed to send request");

			toast.success("Friend request sent");
			setRequestStatus("pending");
		} catch (error) {
			console.error("Error sending friend request :", error.message);
			toast.error("Something went wrong.");
		}
	};

	const unFriendUser = async () => {
		try {
			const res = await fetch(`/api/friends/unfriend/${user._id}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) return toast.error(data?.error || "Failed to unfollow");

			toast.success(data?.message || "Success");
			setRequestStatus("none");
		} catch (error) {
			console.error("unFriendUser error:", error.message);
			toast.error("Something went wrong");
		}
	};

	const handleAcceptFriend = async () => {
		try {
			const res = await fetch(`/api/friends/request/${user.requestId}/accept`, {
				method: "PATCH",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			});

			if (!res.ok) {
				const errorData = await res.json();
				toast.error(errorData || "Failed to accept request");
			}

			const data = await res.json();
			toast.success(data?.message || "Friend request accepted");
			setRequestStatus("accepted");
		} catch (error) {
			console.error("Accept friend error:", error);
			toast.error(error.message);
			setRequestStatus("incoming"); // Reset state on error
		}
	};

	const renderButton = () => {
		switch (requestStatus) {
			case "pending":
				return (
					<button
						disabled
						className="mt-3 text-sm px-4 py-1 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed">
						Request Sent
					</button>
				);
			case "accepted":
				return (
					<button
						onClick={unFriendUser}
						className="mt-3 text-sm px-4 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer">
						Unfriend
					</button>
				);
			case "incoming":
				return (
					<button
						onClick={handleAcceptFriend}
						className="mt-3 text-sm px-4 py-1.5 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition cursor-pointer">
						Accept Request
					</button>
				);

			default:
				return (
					<button
						onClick={handleAddFriend}
						className="mt-3 text-sm px-4 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition cursor-pointer">
						Add Friend
					</button>
				);
		}
	};

	const isFallback = !user.profileImage;

	const fallbackImage =
		user.gender === "female"
			? "/girl2.png"
			: user.gender === "male"
			? "/boy3.png"
			: "/unisex-avatar.png";

	const imageSrc = user.profileImage || fallbackImage;

	const imageClass = isFallback
		? "w-full h-full object-contain bg-white"
		: "w-full h-full object-cover";

	return (
		<div className="flex flex-col items-center bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 w-full max-w-xs sm:w-60 h-72 rounded-xl shadow-md overflow-hidden">
			<div className="w-full h-44">
				<img
					src={imageSrc}
					alt={`${user.firstName} ${user.lastName}`}
					className={imageClass}
				/>
			</div>
			<div className="flex flex-col items-center justify-center flex-1 p-3 text-center">
				<p className="font-semibold text-sm">
					{user.firstName} {user.lastName}
				</p>
				{currentUser && currentUser._id !== user._id && renderButton()}
			</div>
		</div>
	);
};

export default UserCard;
