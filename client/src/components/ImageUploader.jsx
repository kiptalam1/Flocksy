import { forwardRef } from "react";

const ImageUploader = forwardRef(({ type, onUpload }, ref) => {
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (file) onUpload(file);
	};

	return (
		<input
			ref={ref}
			type="file"
			accept="image/*"
			style={{ display: "none" }}
			onChange={handleFileChange}
		/>
	);
});

export default ImageUploader;
