import jwt from "jsonwebtoken";

export default function sendToken(user, res, statusCode = 200) {
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res
		.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		})
		.status(statusCode)
		.json({
			message: "Success",
			user: {
				_id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
			},
		});
}
