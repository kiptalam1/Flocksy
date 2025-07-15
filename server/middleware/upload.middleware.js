import multer from "multer";
import { storage } from "../utils/cloudinary.util.js";

const upload = multer({ storage });

export default upload;
