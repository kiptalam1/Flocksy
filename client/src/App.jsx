import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginForm from "./components/LoginForm";
import HomePage from "./pages/HomePage";
import UsersPage from "./pages/UsersPage";
function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/auth/login" element={<LoginForm />} />
				<Route path="/auth/register" element={<RegisterPage />} />
				<Route path="/home" element={<HomePage />} />
				<Route path="/users" element={<UsersPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
