import React from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
	const navigate = useNavigate();
	return (
		<div className="flex-1 max-w-md w-full bg-white 	dark:bg-gray-800 rounded-lg shadow-md p-6">
			<form className="flex flex-col gap-4 w-full">
				<input
					className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					type="email"
					name="email"
					placeholder="Email address"
				/>
				<input
					className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					type="password"
					name="password"
					placeholder="Password"
				/>
				<button
					className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 text-base rounded-md font-medium cursor-pointer"
					type="submit">
					Log In
				</button>

				<span className="text-sm self-center text-blue-600 font-sans hover:underline cursor-pointer">
					Forgotten password?
				</span>
				<hr className="text-gray-300 dark:text-gray-500 mt-2" />

				<button
					className="bg-green-500 hover:bg-green-400 transition text-white py-2 px-4 text-base rounded-md font-medium w-fit self-center mt-2 cursor-pointer"
					type="button"
					onClick={() => navigate("/auth/register")}>
					Create new account
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
