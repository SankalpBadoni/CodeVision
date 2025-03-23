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
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.cookie('access_token', token, {
            httpOnly: true,
            
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
            success: true,
            message: "Login successful",
        });
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Error in login",
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

