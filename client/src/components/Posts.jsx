import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "./Post";

const Posts = () => {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const fetchAllPosts = async () => {
			try {
				const res = await fetch("/api/posts/all");
				const data = await res.json();
				if (!res.ok) {
					toast.error("Failed to fetch posts");
					return;
				}
				// console.log("data :", data);
				setPosts(data.posts);
			} catch (error) {
				console.error("Error fetching posts", error.message);
				toast.error("Something went wrong");
			}
		};
		fetchAllPosts();
	}, []);
	return (
		<div className="flex flex-col gap-3 items-center">
			{posts && posts.map((post) => <Post key={post._id} post={post} />)}
		</div>
	);
};

export default Posts;
