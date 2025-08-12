import { Request, Response } from 'express';
import { Gym } from '../model/gym.model';

interface AuthRequest extends Request {
  user?: any;
}

export const createGym = async (res:Response, req:AuthRequest) => {
    try {
        const {
            name, address, city, picture, description, phone, email, website, coordinates
        } = req.body;
        if (!name || !address || !city || !picture || !description || !phone || !email) {
            return res.status(400).send({
                message: 'All fields are required',
                success: false
            });
        }
        const newGym = await Gym.create({
            name,
            address,
            city,
            picture,
            description,
            phone,
            email,
            website,
            location: {
                type: 'Point',
                coordinates
            },
            user: req.user?.id
        })
    } catch (error) {
        console.error('Errror creating gym:', error);
        res.status(500).send({
            message: 'Internal server error',
            success: false
        })
    }
}

export const getNearbyGyms = async (req: AuthRequest, res: Response) => {
    try {
        const { lat, lng, distance = 5000 } = req.query;
        if (!lat || !lng) {
            return res.status(400).send({
                message: 'Latitude and longitude are required',
                success: false
            });
        }
        const gyms = await Gym.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng as string), parseFloat(lat as string)]
                    },
                    $maxDistance: 5000
                }
            }
        }).populate('user', 'name email');
        
        res.status(200).send({
            message: 'Nearby gyms fetched successfully',
            success: true,
            gyms
        });
    } catch (error) {
        console.error('Error fetching nearby gyms:', error);
        res.status(500).send({
            message: 'Internal server error',
            success: false
        });
    }
}