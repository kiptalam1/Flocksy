import React from "react";
import Posts from "../components/Posts";

const HomePage = () => {
	return (
		<div className="min-h-screen py-4 px-4 sm:px-12 bg-gray-50	dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex">
			<Posts />
		</div>
	);
};

export default HomePage;
