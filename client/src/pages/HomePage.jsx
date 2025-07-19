import Navbar from "../components/Navbar";
import Posts from "../components/Posts";
// import LeftPanel from "../components/LeftPanel"; // optional
import RightPanel from "../components/RightPanel";

const HomePage = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans flex flex-col">
			{/* Top navbar (full width) */}
			<Navbar />

			{/* Main content */}
			<div className="flex flex-1  px-2 sm:px-4 py-4 gap-2">
				{/* Left sidebar (optional) */}
				{/* <LeftPanel className="hidden md:block w-1/4" /> */}

				{/* Main content */}
				<div className="flex-1 flex justify-center">
					<Posts className="w-full max-w-2xl" />
				</div>

				{/* Right sidebar (optional) */}
				<RightPanel className="hidden md:block w-1/4 flex-shrink-0" />
			</div>
		</div>
	);
};

export default HomePage;
