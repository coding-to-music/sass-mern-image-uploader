import mongoose from 'mongoose';

const imageSchema=new mongoose.Schema({
    image:{
        type:Buffer
    }
},{
    timestamps:true
});
imageSchema.methods.toJSON=function () {
    const result=this.toObject;
    delete result.image;
    return result
};
export default mongoose.model('Image',imageSchema);