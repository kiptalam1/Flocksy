import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	// const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch("/api/users/me", {
					credentials: "include", // 👈 REQUIRED for cookies
				});
				const data = await res.json();
				if (res.ok) setUser(data.user);
			} catch (err) {
				console.error("Auth check failed:", err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchUser();
	}, []);

	const logout = async (onSuccess) => {
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data?.error || "Failed to log out");
				return;
			}
			setUser(null);
			toast.success(data?.message || "You have logged out successfully");
			if (onSuccess) onSuccess();
		} catch (error) {
			console.error("Error logging out", error.message);
			toast.error("Something went wrong");
		}
	};

	return (
		<AuthContext.Provider value={{ user, setUser, loading, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
