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
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col">
			{/* Top navbar */}
			<Navbar />

			{/* Main content layout */}
			<div className="flex flex-1 px-2 sm:px-4 py-4 gap-2">
				{/* Left sidebar */}
				<LeftPanel className="hidden md:block w-1/4 flex-shrink-0" />

				{/* Center content */}
				<div className="flex-1 flex justify-center">
					<Users className="w-full max-w-2xl" />
				</div>

				{/* Right sidebar */}
				<RightPanel className="hidden md:block w-1/4 flex-shrink-0" />
			</div>
		</div>
	);
};

export default UsersPage;
