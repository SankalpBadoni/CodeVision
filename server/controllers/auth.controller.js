import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if(!username || !email || !password) {
            return res.status(400).json({ 
                message: "All fields are required",
                success: false,
            });
        }
        if(existingUser) {
            return res.status(400).json({ 
                message: "User already exists",
                success: false,
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
            message: "User created successfully",
            success: true,
        });
        
        
        
    }
    catch(error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}
