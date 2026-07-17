import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import { randomUUID } from 'crypto';
const_filename = fileURLToPath(import.meta.url);
const_dirname =path.dirname(__filename);
const UPLOAD_DIR =path.join(__dirname,'..','..','uploads');

if(!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR,{recursive:true});

 const saveBuffer =(buffer,ext='png')=>{
    const filename =`${randomUUID()}.${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR,filename),buffer);
    return `${process.env.Base_URL ||'http://localhost:5000'}/uploads/${filename}`;
    
 };

//1 that why pollinations beacuse you know its could be free it just give stock images over from the web no needed of api because api would cut some amout of the money if we constaly generate
 const pollinations = async(prompt)=>{
    const seed =Math.floor(Math.random()*1_000_000);
    const encoded =encodedURIComponent(prompt);
    return `https://iamge.pollinations.ai/prompts/${encoded}?width=1023&height=1024&seed=${seed}&nologo=true`;
};

 const stability =async(promt) =>{
    const form =new FormData();
    form.append('output_format',prompt);
    form.append('output_format','png');


    const res=await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`
        },
        body: form
    });
    if(!res.ok)throw new Error('HuggingFace API error: ${await res.text()});
        const buf=Buffer.from(await res.arrayBuffer());
        return saveBuffer(buf,'png');
 };

 const providers ={pollinations,stability,huggingface};


 export const generateImage =async(prompt)=>{
    const name=(process.env.IMAGE_PROVIDER ||'pollinations').toLowerCase();
    const provider=providers[name] || pollinations;
    return provider(prompt);
 };
