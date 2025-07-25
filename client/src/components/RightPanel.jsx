import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Contact from "./Contact";
import { useNavigate } from "react-router-dom";

const RightPanel = ({ className = "" }) => {
	const [friends, setFriends] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriends = async () => {
			try {
				const res = await fetch("/api/users/friends", {
					method: "GET",
					credentials: "include",
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error(data?.error || "Failed to fetch friends");
					return;
				}
				// console.log("friends", data.friends);
				setFriends(data.friends);
			} catch (error) {
				console.error("Error while fetching friends :", error.message);
				toast.error("Something went wrong");
			}
		};
		fetchFriends();
	}, []);
	return (
		<div className={`flex flex-col gap-3 items-center ${className}`}>
			<h2 className="text-gray-800 dark:text-gray-100 font-semibold text-lg text-center mb-2 self-center">
				Friends
			</h2>
			{friends &&
				friends.map((friend) => (
					<Contact
						key={friend._id}
						person={friend}
						onClick={() => navigate(`/profile/${friend._id}`)}
					/>
				))}
		</div>
	);
};

export default RightPanel;
