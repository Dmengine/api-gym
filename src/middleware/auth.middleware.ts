import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../model/auth.model';


interface AuthRequest extends Request {
  user?: any;
}


export const authMiddleware = async (req:AuthRequest, res:Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token || !token.startsWith('Bearer')) {
            return res.status(403).send({
                message: 'Authorization token is required',
                success: false
            })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(500).json({
            message: 'Token invalid or expired',
            success: false
        });
    }
}