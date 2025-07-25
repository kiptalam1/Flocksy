import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { Venus } from "lucide-react";
import { Mars } from "lucide-react";
import { VenusAndMars } from "lucide-react";

const ProfileHeader = ({ user }) => {
	if (!user) return null;

	const {
		firstName,
		lastName,
		createdAt,
		profileImage,
		coverImage,
		gender,
		email,
		friends = [],
	} = user;

	const fallbackImage =
		gender === "female"
			? "/girl2.png"
			: gender === "male"
			? "/boy3.png"
			: "/unisex-avatar.png";

	const imageSrc = profileImage || fallbackImage;

	return (
		<div className="w-full border-b dark:border-gray-700">
			{/* Cover image */}
			<div className="h-40 bg-gray-300 dark:bg-gray-800 relative">
				{coverImage ? (
					<img
						src={coverImage}
						alt="Cover"
						className="object-cover w-full h-full"
					/>
				) : null}
				{/* Avatar */}
				<div className="absolute -bottom-12 left-4">
					<img
						src={imageSrc}
						alt="avatar"
						className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover"
					/>
				</div>
			</div>

			<div className="pt-16 px-4 sm:px-8 pb-4">
				<h1 className="text-xl font-bold">
					{firstName} {lastName}
				</h1>
				<p className="text-gray-600 dark:text-gray-400">{email}</p>

				<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
					<IoCalendarOutline />
					<span>Joined {new Date(createdAt).toLocaleDateString()}</span>
				</div>

				<p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-1">
					Friends: {friends.length}
				</p>
				<span className="text-sm text-gray-500 dark:text-gray-400 mt-3">
					{gender === "male" ? (
						<Mars size={16} />
					) : gender === "female" ? (
						<Venus size={16} />
					) : (
						<VenusAndMars size={16} />
					)}
				</span>
			</div>
		</div>
	);
};
export default ProfileHeader;
