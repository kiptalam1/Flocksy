import React from "react";
import { SlLike } from "react-icons/sl";
// import { FaRegComment } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa6";
import { FaComment } from "react-icons/fa6";
import { formatShortTime } from "../utils/formatTime.js";

const Post = ({ post }) => {
	return (
		<div className="flex flex-col gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-md max-w-md w-full h-auto p-4 shadow-lg">
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={post?.user?.profileImage}
					alt={post?.user?.firstName}
				/>
				<p className="text-base hover:underline cursor-pointer">
					{post?.user?.firstName} {post?.user?.lastName}
				</p>
				<span className="text-sm text-gray-400">
					{formatShortTime(post?.createdAt)}
				</span>

				<p className="justify-self-end text-blue-600 cursor-pointer hover:underline">
					Follow
				</p>
			</div>
			<div className="text-base">{post?.text}</div>
			{post?.image && (
				<div className="w-full h-max rounded-md">
					<img
						className="w-full max-h-80 object-cover rounded-md"
						src={post?.image}
						alt={post?.user?.firstName}
					/>
				</div>
			)}

			<div className="flex items-center gap-4 py-2 px-4 text-sm text-gray-600 dark:text-gray-300">
				<div className="flex items-center gap-1 cursor-pointer">
					<SlLike />
					<span>{post?.likes?.length || 0}</span>
				</div>
				<div className="flex items-center gap-1 cursor-pointer">
					<FaRegComment />
				</div>
			</div>
		</div>
	);
};

export default Post;
