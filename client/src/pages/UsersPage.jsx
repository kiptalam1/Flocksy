import React from "react";
import Navbar from "../components/common/Navbar.jsx";
import LeftPanel from "../components/pannels/LeftPanel.jsx";
import RightPanel from "../components/pannels/RightPanel.jsx";
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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
			<Navbar />
			<div className="flex max-w-6xl mx-auto pt-4">
				<aside className="hidden md:block w-1/4 pr-4">
					<LeftPanel />
				</aside>
				<main className="w-full md:w-2/4 px-2">
					<Users />
				</main>
				<aside className="hidden md:block w-1/4 pl-4">
					<RightPanel />
				</aside>
			</div>
		</div>
	);
};

export default UsersPage;
