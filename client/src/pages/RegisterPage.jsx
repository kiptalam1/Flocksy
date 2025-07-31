import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		gender: "",
		email: "",
		password: "",
	});

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password.length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}
		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
				credentials: "include", // important for cookie-based auth
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data?.error || "Registration failed");
				setTimeout(() => {
					navigate("/auth/register");
				}, 0);
				return;
			}
			// console.log("data :", data);
			toast.success(data?.message || "Registration was successful");

			setTimeout(() => navigate("/"), 0);
		} catch (error) {
			console.error("Error registering user", error.message);
			toast.error("Something went wrong");
		}
	};

	return (
		<div className="min-h-screen text-gray-800 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
			<h1 className="font-[Poppins] mb-2 text-3xl sm:text-6xl font-bold text-blue-600 leading-tight">
				facebook
			</h1>
			<div className="max-w-md w-full">
				<form
					className="flex flex-col gap-4 w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
					onSubmit={handleSubmit}>
					<h2 className="font-semibold text-gray-800 dark:text-gray-100 text-2xl tracking-tighter font-[Poppins] self-center">
						Create a new account
					</h2>

					<p className="text-sm text-gray-500 self-center">
						It's quick and easy.
					</p>

					<input
						className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="text"
						name="firstName"
						placeholder="First name"
						onChange={handleChange}
						required
					/>

					<input
						className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="text"
						name="lastName"
						placeholder="Last name"
						onChange={handleChange}
						required
					/>

					<div>
						<span className="text-xs text-gray-500">Gender</span>
						<div className="flex gap-4 mt-1">
							<label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
								<input
									type="radio"
									name="gender"
									value="male"
									checked={formData.gender === "male"}
									onChange={handleChange}
									required
								/>
								Male
							</label>
							<label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
								<input
									type="radio"
									name="gender"
									value="female"
									checked={formData.gender === "female"}
									onChange={handleChange}
									required
								/>
								Female
							</label>
							<label className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-500">
								<input
									type="radio"
									name="gender"
									value="custom"
									checked={formData.gender === "custom"}
									onChange={handleChange}
									required
								/>
								Custom
							</label>
						</div>
					</div>

					<input
						className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="email"
						name="email"
						placeholder="Email address"
						onChange={handleChange}
						required
					/>
					<input
						className="border border-gray-300 py-2 px-4 text-base rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						type="password"
						name="password"
						placeholder="New password"
						onChange={handleChange}
						required
						minLength={6}
					/>

					<button
						className="bg-green-500 hover:bg-green-400 transition text-white py-2 px-4 text-base rounded-md font-medium w-full mt-2 cursor-pointer"
						type="submit">
						Sign up
					</button>

					<span
						onClick={() => navigate("/")}
						className="text-sm self-center text-blue-600 font-sans hover:underline cursor-pointer">
						Already have an account?
					</span>
				</form>
			</div>
		</div>
	);
};

export default RegisterPage;
