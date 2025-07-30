import React from "react";
import Navbar from "../components/common/Navbar.jsx";
import Users from "../components/Users.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import Loader from "../components/common/Loader.jsx";

const UsersPage = () => {
	const { user, loading } = useAuth();

	if (loading || !user) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center">
				<Loader />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col ">
			<Navbar />
			<Users />
		</div>
	);
};

export default UsersPage;
