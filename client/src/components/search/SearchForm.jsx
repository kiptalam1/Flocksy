import React, { useState } from "react";
import { Search } from "lucide-react";

const SearchForm = ({ onSearch }) => {
	const [input, setInput] = useState("");

	const handleSearch = () => {
		onSearch(input);
	};

	return (
		<div className="flex items-center w-full p-4 gap-2 ">
			<input
				className="flex-1 text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
				type="text"
				name="search"
				placeholder="Search for user..."
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<Search className="cursor-pointer" onClick={handleSearch} />
		</div>
	);
};

export default SearchForm;
