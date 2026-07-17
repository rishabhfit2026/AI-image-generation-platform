import {verifyToken} from '../utils/jwt.js';

export const protect =(req,res,next)=>{
    const header =req.headers.authorization;
    if(!header || !header.startsWith('Bearer')){
        return res.status(401).json({message:'Not authorized, no token'});

    }
    try{
        const decoded=verifyToken(header.split('')[1]);
        req.user={id:decoded.id,email:decoded.email};
        next();
    } catch{
        return res.status(401).json({messgae:'Not authrized , token failed'});

    }
};