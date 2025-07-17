import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/auth/login" element={<LoginForm />} />

				<Route path="/auth/register" element={<RegisterForm />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
