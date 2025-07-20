import React from "react";
import Navbar from "../components/Navbar.jsx";
import Users from "../components/Users.jsx";

const UsersPage = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col p-4">
			<Navbar />
			<Users />
		</div>
	);
};

export default UsersPage;
