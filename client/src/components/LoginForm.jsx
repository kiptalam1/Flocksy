import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginForm = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { setUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
				credentials: "include", // important for cookie-based auth
			});
			const data = await res.json();
			if (!res.ok) {
				setLoading(false);
				toast.error(data?.error || "Login failed!");
				setTimeout(() => {
					navigate("/");
				}, 0);
				return; // to prevent further execution;
			}
			// console.log("data :", data);
			setUser(data.user);
			toast.success(data?.message || "Success");
			setLoading(false);
			navigate("/home");
		} catch (error) {
			console.error("Error logging in user", error.message);
			toast.error(error.message || "Something went wrong!");
			setLoading(false);
		}
	};

	return (
		<div className="flex-1 max-w-md w-full bg-white 	dark:bg-gray-800 rounded-lg shadow-md p-6">
			<form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
				<input
					className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					type="email"
					onChange={handleChange}
					value={formData.email}
					name="email"
					placeholder="Email address"
				/>
				<input
					className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					type="password"
					onChange={handleChange}
					value={formData.password}
					name="password"
					placeholder="Password"
				/>
				<button
					className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 text-base rounded-md font-medium cursor-pointer"
					type="submit">
					{loading ? "Loading..." : "Log In"}
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
