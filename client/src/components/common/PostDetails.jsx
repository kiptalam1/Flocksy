import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { SlLike } from "react-icons/sl";
import { Trash } from "lucide-react";
import Post from "./Post.jsx";
import CommentForm from "./CommentForm.jsx";
import Loader from "./Loader.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { formatShortTime } from "../../utils/formatTime.js";
import Navbar from "./Navbar.jsx";

const PostDetails = ({ className = "" }) => {
	const { postId } = useParams();
	const { user: authUser } = useAuth();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res = await fetch(`/api/posts/post/${postId}`);
				const data = await res.json();
				if (!res.ok) return toast.error(data?.error || "Failed to fetch post.");
				setPost(data?.post);
				setComments(data?.comments);
			} catch (error) {
				console.error("Error fetching post details", error.message);
				toast.error("Something went wrong.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [postId]);

	const handleCreateComment = async (comment) => {
		try {
			setIsSubmitting(true);
			const res = await fetch(`/api/comments/${postId}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: comment }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to post comment.");
			setComments((prev) => [data.comment, ...prev]);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteComment = async (commentId) => {
		try {
			const res = await fetch(`/api/comments/${commentId}`, {
				method: "DELETE",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to delete comment.");
			setComments((prev) => prev.filter((c) => c._id !== commentId));
			toast.success("Comment deleted.");
		} catch (err) {
			toast.error(err.message);
		}
	};

	const handleLikeComment = async (commentId) => {
		try {
			const res = await fetch(`/api/comments/comment/${commentId}`, {
				method: "POST",
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data?.error || "Failed to like comment.");
			setComments((prev) =>
				prev.map((c) => (c._id === commentId ? data.comment : c))
			);
		} catch (err) {
			toast.error(err.message);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-bg dark:bg-gray-900">
				<Loader />
			</div>
		);
	}

	return (
		<div
			className={`px-4 py-6 bg-card text-text dark:bg-gray-800 dark:text-gray-100 rounded-md shadow-sm ${className}`}>
			<Post post={post} isDetailsPage={true} />

			<div className="mt-6">
				<h2 className="text-lg font-semibold mb-2">Comments</h2>
				<CommentForm onSubmit={handleCreateComment} isLoading={isSubmitting} />

				<div className="mt-4 space-y-4">
					{comments.length === 0 ? (
						<p className="text-sm text-muted dark:text-gray-500">
							No comments yet.
						</p>
					) : (
						comments.map((comment) => {
							const canDelete =
								authUser?._id === comment.user._id ||
								authUser?._id === post.user._id;

							const hasLiked = comment.likes.includes(authUser._id);

							return (
								<div
									key={comment._id}
									className="bg-muted p-3 rounded-lg shadow-sm relative group">
									<div className="flex items-center gap-3 mb-2">
										<img
											src={comment.user.profileImage}
											className="w-8 h-8 rounded-full object-cover"
										/>
										<div className="flex flex-col">
											<span className="text-sm font-medium">
												{comment.user.firstName} {comment.user.lastName}
											</span>
											<span className="text-xs text-gray-500">
												{formatShortTime(comment.createdAt)}
											</span>
										</div>
									</div>

									<p className="text-sm mb-2">{comment.text}</p>

									<div className="flex items-center gap-4 text-xs mt-2">
										<button
											onClick={() => handleLikeComment(comment._id)}
											className={`flex items-center gap-1 cursor-pointer transition ${
												hasLiked
													? "text-blue-600"
													: "text-gray-500 hover:text-blue-600"
											}`}>
											<SlLike size={16} />
											<span>{comment.likes?.length || 0}</span>
										</button>

										{canDelete && (
											<button
												onClick={() => handleDeleteComment(comment._id)}
												className="flex items-center gap-1 text-red-500 hover:text-red-700 cursor-pointer transition">
												<Trash size={16} />
											</button>
										)}
									</div>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
};

export default PostDetails;
