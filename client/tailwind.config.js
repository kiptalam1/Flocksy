export default {
	darkMode: "class", // 'media' for system preference, or 'class' for manual toggle
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#2563EB",
				accent: "#4ADE80",
				bg: "#F9FAFB",
				text: "#1F2937",
				card: "#FFFFFF",
				muted: "#E5E7EB",
				danger: "#EF4444",
				dark: {
					bg: "#0F172A",
					text: "#F1F5F9",
					card: "#1E293B",
					muted: "#334155",
				},
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				heading: ["Poppins", "system-ui", "sans-serif"],
			},
		},
	},
	plugins: [],
};
