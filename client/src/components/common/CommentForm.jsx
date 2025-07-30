import React, { useState } from "react";

const CommentForm = ({ onSubmit, isLoading = false }) => {
	const [comment, setComment] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!comment.trim()) return;
		onSubmit(comment);
		setComment("");
	};

	return (
		<form onSubmit={handleSubmit} className="flex gap-2 items-center mt-4">
			<input
				type="text"
				placeholder="Write a comment..."
				value={comment}
				onChange={(e) => setComment(e.target.value)}
				className="flex-1 border border-muted bg-bg text-text dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
			/>
			<button
				type="submit"
				disabled={isLoading || !comment.trim()}
				className="bg-primary text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:opacity-50">
				Post
			</button>
		</form>
	);
};

export default CommentForm;
