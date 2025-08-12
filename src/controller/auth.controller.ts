import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../model/auth.model';


export const Register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Name, email, and password are required',
                success: false
            })
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        })
        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            user: newUser,
        })
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        })
    }
}

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password){
            return res.status(400).send({
                message: 'Email and password are required',
                success: false
            })
            const ExistingUser = await User.findOne({ email});
            if(!ExistingUser) {return res.status(400).send({
                message: 'User not found',
                success: false
            })}

            const comparePassword = await bcrypt.compare(password, ExistingUser?.password as string);
            if(!comparePassword) {
                return res.status(400).send({
                    message: 'Invalid passwoord',
                    success: false
                })
            }
            const token = jwt.sign({ id: ExistingUser?._id, role: ExistingUser?.role}, process.env.JWT_SECRET as string, {
                expiresIn: '7d'
            })
            res.status(200).send({
                message: 'Login successful',
                success: true,
                token,
                data: ExistingUser
            })
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}

export const Logout = async (req: Request, res: Response) => {
    try {
       res.status(200).send({
        message: 'Logout successful',
        success: true
       }) 
    } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Something went wrong.',
    });
  }
}