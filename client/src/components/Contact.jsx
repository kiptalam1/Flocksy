// import { useNavigate } from "react-router-dom";

const Contact = ({ person, onClick }) => {
	// const navigate = useNavigate();

	return (
		<div
			className="flex flex-col gap-2 rounded-md max-w-md w-full h-auto p-4 shadow-lg hover:bg-white hover:dark:bg-gray-800 hover:text-gray-800 hover:dark:text-gray-100 transition cursor-pointer"
			onClick={onClick}>
			<div className="flex gap-3 items-center">
				<img
					className="size-10 rounded-full object-cover"
					src={person?.profileImage || "avatar-placeholder.png"}
					alt={person?.firstName}
				/>
				<p className="text-base ">
					{person?.firstName} {person?.lastName}
				</p>
			</div>
		</div>
	);
};

export default Contact;
