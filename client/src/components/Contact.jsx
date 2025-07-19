import React from "react";

const Contact = ({ friend }) => {
	return (
		<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md max-w-md w-full h-auto p-4 shadow-lg">
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={friend.profileImage || "avatar-placeholder.png"}
					alt={friend.firstName}
				/>
				<p className="text-base hover:underline cursor-pointer">
					{friend.firstName} {friend.lastName}
				</p>
			</div>
		</div>
	);
};




export default Contact;
