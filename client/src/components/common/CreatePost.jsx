import React, { useState } from "react";
import toast from "react-hot-toast";

const CreatePost = ({ onNewPost }) => {
	const [postContent, setPostContent] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handlePost = async () => {
		if (!postContent.trim() && !imageFile) {
			return toast.error("Post must include text or an image.");
		}

		const formData = new FormData();
		if (postContent.trim()) formData.append("text", postContent.trim());
		if (imageFile) formData.append("image", imageFile);

		try {
			setIsSubmitting(true);

			const res = await fetch("/api/posts/create", {
				method: "POST",
				body: formData,
				credentials: "include",
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to create post");
			// console.log("new post", data);
			onNewPost?.(data.populated);
			setPostContent("");
			setImageFile(null);
			toast.success(data?.message || "Post created successfully");
		} catch (err) {
			console.error("Post error:", err.message);
			toast.error(err.message || "Something went wrong");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex flex-col gap-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl w-full p-4 shadow-md border border-gray-200 dark:border-gray-700">
			<input
				type="file"
				name="image"
				accept="image/*"
				onChange={(e) => setImageFile(e.target.files[0])}
				className="text-sm text-gray-600 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
			/>

			<textarea
				name="post"
				rows="2"
				placeholder="What's on your mind?..."
				value={postContent}
				onChange={(e) => setPostContent(e.target.value)}
				className="resize-y min-h-[48px] max-h-[300px] px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
			/>

			{(postContent.trim() || imageFile) && (
				<button
					onClick={handlePost}
					disabled={isSubmitting}
					className={`self-end px-5 py-2 text-sm rounded-lg transition ${
						isSubmitting
							? "bg-blue-400 cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-700 text-white"
					}`}>
					{isSubmitting ? "Posting..." : "Post"}
				</button>
			)}
		</div>
	);
};

export default CreatePost;
