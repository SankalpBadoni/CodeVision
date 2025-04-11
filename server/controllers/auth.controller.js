import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(!username || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required",
            });
        }
        if(existingUser) {
            return res.status(400).json({ 
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });
        await user.save();
        res.status(201).json({
            success: true,
            message: "User created successfully",
        });
        
        
        
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Error in registration",
        });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '10d' }
        );
        
        // Set token in cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production', 
          });
        
        // Return user details and token
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            },
            token // Include token in response for localStorage
        });
    }
    catch(error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Error in login",
            error: error.message
        });
    }
}

export const logout = async (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
}

