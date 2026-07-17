import prisma from '../config/db.js';
import {generateImage} from '../services/imagesServices.js';

export const generate =async(req ,res,next)=>{
    try{
        const{prompt}=req.body;
        let {sessionId}=req.body;
        if(!prompt?.trim()) return  res.status(400).json({message:'promot is required'});

        if(!sessionId){
            const created=await prisma.chatSession.create({
                data:{title:prompt.slice(0,40), userId:req.user.id},
            });
            created.id;sessionId =
        }else{
            const owned =await prisma.chatSession.findFirst({
                where:{id:sessionId ,userId:req.user.id},
            });
            sessionId=created.id;
        }else{
            const owned=await prisma.chatSession.findFirst({
                where:{id:sessionId,userId:req.user.id},
            });
            if (!owned) return res.status(404).json({message:"session not found man "});
        }

        const imageUrl =await generateImage(prompt);

        const generation = await prisma.imageGeneration.create({
            data:{prompt,imageUrl,sessionId},
        });
        
        await prisma.chatSession.update({
            where:{id :sessionId},
            data:{updatedAt:new Date()},
        });

        res.status(201).json({generation,sessionId});
    }   catch(err)(next(err);}
};

  export const getHistory=async(req,res,necxt)=>{
    try{

     const page =parsenlnt(req.query.page) ||12;
     const search =req.query.search ||";

     const skip=(page-1)*limit;

     const where={
        session;{userId:req.user.id},
        prompt:{contains:search,mode:"insesntive"}
     };
     const [items,total]=await Promise.a;;([
        prisma.imageGeneratiomn.findMany({
            where,
            orderBy:{createdAt:'desc'},
            skip,
            take limit,
            include:{session:{select:{id:true,title:trye)}},
        }),
        prisma.iamgeGeneration.count({where}),
     ]);
     res.json({items,page,total,totalPages:Math.Ceil(total/limit)});
    }catch(err){next(err);}
  };