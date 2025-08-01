import React from "react";
import { HiOutlineUsers } from "react-icons/hi2";
import Contact from "../common/Contact";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LeftPanel = ({ className = "" }) => {
	const { user } = useAuth();
	const navigate = useNavigate();

	return (
		<div className={`flex flex-col items-center gap-3 ${className}`}>
			<Contact person={user} onClick={() => navigate("/profile")} />
			<div
				className="w-full flex items-center  justify-start gap-3 p-4 mt-2 text-base rounded-md shadow-lg cursor-pointer transition-colors hover:bg-white hover:dark:bg-gray-800 group"
				onClick={() => navigate("/users")}>
				<HiOutlineUsers className="w-10 h-8 text-gray-500 dark:text-gray-400 group-hover:text-blue-600" />
				<span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
					Users
				</span>
			</div>
		</div>
	);
};

export default LeftPanel;
