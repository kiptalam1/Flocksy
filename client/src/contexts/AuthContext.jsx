import { createContext, useContext, useEffect, useState } from "react";
// import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

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

	return (
		<AuthContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
