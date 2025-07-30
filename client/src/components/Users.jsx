import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import fetchUsers from "../utils/allUsers.js";
import toast from "react-hot-toast";
import UserCard from "../components/common/UserCard.jsx";
import SearchForm from "./search/SearchForm.jsx";

const Users = () => {
	const [users, setUsers] = useState([]);
	const [searched, setSearched] = useState(false);
	const navigate = useNavigate();

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

	const handleSearch = async (query) => {
		try {
			const res = await fetch(`/api/users/search?query=${query}`);
			const data = await res.json();
			setUsers(data.users);
			setSearched(true);
		} catch (error) {
			console.error("Error searching user :", error.message);
		}
	};

	return (
		<div className="flex flex-col gap-4 justify-center w-full px-4 py-5">
			<SearchForm onSearch={handleSearch} />

			<div className="flex flex-wrap justify-center gap-3 max-w-screen-md w-full">
				{users.length > 0 ? (
					users.map((user) => (
						<UserCard
							key={user._id}
							user={user}
							onClick={() => navigate(`/profile/${user._id}`)}
						/>
					))
				) : searched ? (
					<p className="text-center text-gray-500 mt-4">No users found.</p>
				) : null}
			</div>
		</div>
	);
};

export default Users;
