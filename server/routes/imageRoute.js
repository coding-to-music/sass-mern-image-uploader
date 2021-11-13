import express from 'express';
import multer from 'multer';
import Image from '../models/imageModel.js';
import path from 'path';
const Router=express.Router();

const upload=multer({
   limits: {
       fileSize: 5000000 // max file size 1MB=1000000 bytes
   },
   fileFilter:(req,file,cb)=>{
       if(file.mimetype =="image/png" || file.mimetype =="image/jpg" || file.mimetype =="image/jpeg" || file.mimetype=="image/gif"){
           cb(null,true)
       }else{
           cb(null,false);
           return cb(new Error('Only upload .png .jpeg .jpg .gif format !'))
       }
   }
});

Router.post('/images/',upload.single('image'),async(req,res)=>{
    try{
        const image=new Image(req.body);
        const file=req.file.buffer;
        image.image=file;
        await image.save();
        return res.status(200).send({_id:image._id})
    }catch(err){
       res.status(500).send({
           error:'Error while upload file . Please try again later..'
       })
    }
    (err,req,res,next)=>{
        if(err){
            return res.status(500).send(err.message)
        }
    }
    
});

Router.get('/images/',async (req,res)=>{
    try{
        const images=await Image.find({});
        res.status(200).send(images)
    }catch(err){
        res.status(400).send({
            error: 'Error while try to list photo'
        })
    }
});

Router.get('/images/:id',async (req,res)=>{
    try{
        const result=await Image.findById(req.params.id);
        res.set({
            'Content-Type':'image/jpeg'
        });
        res.status(200).send(result.image);
    }catch(err){ 
        res.status(400).send(err)
    }
})

export default Router;