import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check for existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Ensure role matches enum casing
        const allowedRoles = ['STUDENT', 'ORGANIZER', 'ADMIN'];
        const finalRole = allowedRoles.includes(role?.toUpperCase())
            ? role.toUpperCase()
            : 'STUDENT';

        // Save user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role: finalRole
        });
        await user.save();

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Select password explicitly because it's excluded in schema
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { userId: user._id, role: user.role };
        console.log("sec", process.env.JWT_SECRET);
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            role: user.role,
            name: user.name
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// ADMIN: GET ALL USERS
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// ADMIN: DELETE USER
export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        await user.remove();
        res.json({ msg: 'User deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};
