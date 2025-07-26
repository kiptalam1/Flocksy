import React, { useRef, useState } from "react";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import { IoCalendarOutline } from "react-icons/io5";
import { Venus, Mars, VenusAndMars, Pencil, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const ProfileHeader = ({ user, authUser }) => {
	const profileInputRef = useRef();
	const coverInputRef = useRef();
	const [uploadingType, setUploadingType] = useState(null);
	const { setUser } = useAuth();

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
		_id,
	} = user;

	const fallbackImage =
		gender === "female"
			? "/girl2.png"
			: gender === "male"
			? "/boy3.png"
			: "/unisex-avatar.png";

	const imageSrc = profileImage || fallbackImage;
	const isOwner = authUser?._id === _id;

	const handleUpload = async (file, imageType) => {
		const formData = new FormData();
		formData.append("image", file);
		formData.append("imageType", imageType);

		try {
			setUploadingType(imageType);

			const res = await fetch("/api/users/upload-image", {
				method: "PATCH",
				credentials: "include",
				body: formData,
			});

			const contentType = res.headers.get("content-type") || "";
			let data;

			if (contentType.includes("application/json")) {
				data = await res.json();
			} else {
				const text = await res.text();
				console.error("Non-JSON error:", text);
				toast.error("Unexpected server error (non-JSON response)");
				return;
			}

			if (!res.ok) {
				console.error("Upload failed:", data?.error || data);
				toast.error(data?.error || "Upload failed");
				return;
			}

			console.log("Image upload success:", data);
			toast.success(data?.message || `${imageType} image updated`);

			setUser((prev) => ({
				...prev,
				[imageType === "cover" ? "coverImage" : "profileImage"]: data.imageUrl,
			}));
		} catch (err) {
			console.error("Upload error:", err.message);
			toast.error("Upload failed");
		} finally {
			setUploadingType(null);
		}
	};

	return (
		<div className="w-full border-b dark:border-gray-700">
			{/* Cover image */}
			<div className="h-50 bg-gray-300 dark:bg-gray-800 relative">
				{coverImage && (
					<img src={coverImage} className="object-cover w-full h-full" />
				)}

				{/* Cover image edit */}
				{isOwner && (
					<>
						<button
							className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 p-1 rounded-full text-white cursor-pointer"
							onClick={() => coverInputRef.current.click()}>
							{uploadingType === "cover" ? (
								<Loader2 className="animate-spin" size={16} />
							) : (
								<Pencil size={16} />
							)}
						</button>
						<ImageUploader
							ref={coverInputRef}
							type="cover"
							onUpload={(file) => handleUpload(file, "cover")}
						/>
					</>
				)}

				{/* Profile image */}
				<div className="absolute -bottom-12 left-4 group">
					<img
						src={imageSrc}
						className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 object-cover"
					/>

					{/* Profile image edit */}
					{isOwner && (
						<>
							<button
								className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 p-1 rounded-full text-white cursor-pointer"
								onClick={() => profileInputRef.current.click()}>
								{uploadingType === "profile" ? (
									<Loader2 className="animate-spin" size={14} />
								) : (
									<Pencil size={14} />
								)}
							</button>
							<ImageUploader
								ref={profileInputRef}
								type="profile"
								onUpload={(file) => handleUpload(file, "profile")}
							/>
						</>
					)}
				</div>
			</div>

			{/* Profile Details */}
			<div className="pt-16 px-4 sm:px-8 pb-4">
				<h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
					{firstName} {lastName}
				</h1>
				<p className="text-blue-400 italic text-xs">{email}</p>

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
