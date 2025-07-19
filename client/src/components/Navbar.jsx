import { FiLogOut } from "react-icons/fi"; // logout icon
import { useAuth } from "../contexts/AuthContext"; // adjust path as needed
// import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
	const { user, logout } = useAuth(); // assumes you have a logout function
	const navigate = useNavigate();

	const handleLogout = () => logout(() => navigate("/"));

	return (
		<div className="flex items-center justify-between px-6 h-24 shadow-md bg-white dark:bg-gray-900 min-w-full">
			{/* Logo */}
			<div
				className="flex items-center gap-2 "
				onClick={() => navigate("/home")}>
				<img
					src="/facebook-original.svg"
					alt="Facebook Logo"
					className="h-8 w-8 rounded-full object-cover cursor-pointer"
				/>
				<span className="text-lg font-semibold text-gray-800 dark:text-white">
					Flocksy
				</span>
			</div>

			{/* User + Logout */}
			<div className="flex items-center gap-4 mr-2">
				<div className="border-2 border-blue-500 rounded-full w-11 h-11">
					<img
						src={user?.profileImage || "/avatar-placeholder.png"}
						className="w-10 h-10 rounded-full object-cover"
					/>
					<span className="text-xs text-gray-600 dark:text-gray-300">
						{user?.firstName}
					</span>
				</div>

				<FiLogOut
					size={22}
					className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-red-500 transition"
					onClick={handleLogout}
					title="Logout"
				/>
			</div>
		</div>
	);
};

export default Navbar;
