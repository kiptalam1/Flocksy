import React from "react";
import LoginForm from "../components/login/LoginForm";

const LandingPage = () => {
	return (
		<div className="min-h-screen px-4 sm:px-12 bg-gray-50	dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex items-center justify-center">
			<div className="flex flex-col sm:flex-row items-center gap-12 w-full max-w-6xl">
				<div className="flex-1 space-y-4 text-center sm:text-left">
					<h1 className="font-[Poppins] text-5xl sm:text-6xl font-bold text-blue-600 leading-tight">
						facebook
					</h1>
					<p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200">
						Facebook helps you connect and share{" "}
						<br className="hidden sm:block" />
						with the people in your life.
					</p>
				</div>
				<LoginForm />
			</div>
		</div>
	);
};

export default LandingPage;
