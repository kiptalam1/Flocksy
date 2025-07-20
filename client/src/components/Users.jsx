import React, { useEffect, useState } from "react";
import fetchUsers from "../utils/allUsers.js";
import toast from "react-hot-toast";
import UserCard from "./UserCard.jsx";

const Users = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const fetchAllUsers = async () => {
			try {
				const data = await fetchUsers();

				setUsers(data?.users);
			} catch (error) {
				console.error("Error fetching all users :", error.message);
				toast.error("Internal server error.");
			}
		};
		fetchAllUsers();
	}, []);
	return (
		<div className="flex justify-center w-full px-4 py-5">
			<div className="flex flex-wrap justify-center gap-3 max-w-screen-md w-full">
				{users && users.map((user) => <UserCard key={user._id} user={user} />)}
			</div>
		</div>
	);
};

export default Users;
