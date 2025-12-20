import { verifyOtp } from "../controllers/authController.js";

router.post("/verify-otp", verifyOtp);
