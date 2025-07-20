export default async function fetchUsers() {
	try {
		const res = await fetch("/api/users/all", {
			method: "GET",
			credentials: "include",
		});
		const data = await res.json();
		if (!res.ok) throw new Error(data?.error || "Failed to get all users");
		// console.log("all users :", data);
		return data;
	} catch (error) {
		console.error("Error fetching all users", error.message);
	}
}
