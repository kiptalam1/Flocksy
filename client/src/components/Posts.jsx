import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Post from "./Post";
import { useAuth } from "../contexts/AuthContext";
import Loader from "./Loader";

const Posts = ({ className = "" }) => {
	const [posts, setPosts] = useState([]);
	const { user, loading } = useAuth();

	useEffect(() => {
		if (loading || !user) return;

		const fetchAllPosts = async () => {
			try {
				const res = await fetch("/api/posts/all", {
					method: "GET",
					credentials: "include", // important for cookie-based auth
				});
				const data = await res.json();
				if (!res.ok) {
					toast.error("Failed to fetch posts");
					return;
				}
				// console.log("data :", data);
				setPosts(data?.posts);
			} catch (error) {
				console.error("Error fetching posts", error.message);
				toast.error("Something went wrong");
			}
		};
		fetchAllPosts();
	}, [user, loading]);

	// if (loading) return <Loader />;
	// if (!user) return null;

	if (loading)
		return (
			<div className="w-screen h-screen flex items-center justify-center">
				<img src="/facebook-plain.svg" className="w-10 h-10" />
			</div>
		);

	return (
		<div className={`flex flex-col gap-3 ${className}`}>
			{posts && posts.map((post) => <Post key={post._id} post={post} />)}
		</div>
	);
};

export default Posts;
