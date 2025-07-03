import user from "../models/user.js";
import jwt from "jsonwebtoken";

// Controller for user authentication and profile
const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, password, role, name, email, department, subject } =
        req.body;

      // Basic validation
      if (!username || !password || !role) {
        console.log("Received fields:", {
          username,
          password,
          role,
          name,
          email,
          department,
          subject,
        });
        return res
          .status(400)
          .json({ message: "Username, password, and role are required" });
      }

      // Check if user exists
      const existingUser = await user.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Create user
      const newUser = new user({
        username,
        password,
        role,
        name,
        email,
        department,
        subject,
      });

      await newUser.save();

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser._id, username, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        status: "Success", // 👈 Add this line
        message: "User registered successfully",
        user: { id: newUser._id, username, role },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const foundUser = await user.findOne({ username });
      if (!foundUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // For demonstration, compare plain text (replace with hash compare in production)
      const isMatch = password === foundUser.password;
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: foundUser._id,
          username: foundUser.username,
          role: foundUser.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "Lax", // For dev: use "None" and secure: true in production with HTTPS
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        .json({
          message: "Login successful",
          user: {
            id: foundUser._id,
            username: foundUser.username,
            role: foundUser.role,
          },
        });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const foundUser = await user.findById(req.user.id).select("-password");
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(foundUser);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  },

  //Get all Teacher

  async getTeacher(req, res) {
    try {
      const teachers = await user
        .find({ role: "teacher" })
        .select("_id username email department subject");
      res.status(200).json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  },
  async getPendingStudents(req, res) {
    try {
      const students = await user
        .find({ role: "student", isApproved: false })
        .select("_id username email department");
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  },

  async approveStudent(req, res) {
    try {
      await user.findByIdAndUpdate(req.params.id, { isApproved: true });
      res.status(200).json({ message: "Student approved successfully" });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({ message: "Failed to approve student" });
    }
  },
};

export default authController;
