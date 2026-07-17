export const errorHandler =(err ,req,res,next)=>{
    console.error(err.message);
    const status=err.statusCode || 500;
    res.status(status).json({message:err.message ||'Internal Server Error'})
};