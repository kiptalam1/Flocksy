import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
// import LeftPanel from "../components/LeftPanel"; // optional
// import RightPanel from "../components/RightPanel"; // optional

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col">
			{/* Top navbar (full width) */}
			<Navbar />

			{/* Main content */}
			<div className="flex flex-1 px-4 sm:px-12 py-4 gap-4">
				{/* Left sidebar (optional) */}
				{/* <LeftPanel className="hidden md:block w-1/4" /> */}

				{/* Main content */}
				<Posts className="flex-1" />

				{/* Right sidebar (optional) */}
				{/* <RightPanel className="hidden lg:block w-1/4" /> */}
			</div>
		</div>
	);
};

export default HomePage;
