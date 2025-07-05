import User from "../models/user.js"; // Make sure the model is named User (capitalized)
import jwt from "jsonwebtoken";

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { username, password, role, name, email, department, subject } =
        req.body;

      if (!username || !password || !role) {
        return res.status(400).json({
          message: "Username, password, and role are required",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const newUser = new User({
        username,
        password,
        role,
        name,
        email,
        department,
        subject,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, username, role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        status: "Success",
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

      const foundUser = await User.findOne({ username });
      if (!foundUser) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      // Assuming passwords are stored hashed, you should use bcrypt to compare
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
          sameSite: "None",
          secure: true, // Ensure HTTPS is enabled
          maxAge: 7 * 24 * 60 * 60 * 1000,
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

  // Get logged-in user profile
  async getProfile(req, res) {
    try {
      const foundUser = await User.findById(req.user.id).select("-password");
      if (!foundUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(foundUser);
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({ message: "Error fetching profile" });
    }
  },

  // Get all teachers
  async getTeacher(req, res) {
    try {
      const teachers = await User.find({ role: "teacher" }).select(
        "_id username email department subject"
      );
      res.status(200).json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  },

  // Get unapproved students
  async getPendingStudents(req, res) {
    try {
      const students = await User.find({
        role: "student",
        isApproved: false,
      }).select("_id username email department");
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  },

  // Approve a student
  async approveStudent(req, res) {
    try {
      await User.findByIdAndUpdate(req.params.id, { isApproved: true });
      res.status(200).json({ message: "Student approved successfully" });
    } catch (error) {
      console.error("Approval error:", error);
      res.status(500).json({ message: "Failed to approve student" });
    }
  },

  // Delete a teacher
  async deleteTeacher(req, res) {
    try {
      const deleted = await User.findByIdAndDelete(req.params.id);
      if (!deleted)
        return res.status(404).json({ message: "Teacher not found" });
      res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Delete failed", error: err.message });
    }
  },

  // Edit teacher
  async editTeacher(req, res) {
    try {
      const { username, email } = req.body;
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { username, email },
        { new: true }
      );
      if (!updated)
        return res.status(404).json({ message: "Teacher not found" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(500).json({ message: "Update failed", error: err.message });
    }
  },
};

export default authController;
