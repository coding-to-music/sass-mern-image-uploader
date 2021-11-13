import React,{useState} from 'react';
import './ImageCard.scss';
import Image from '../../assets/images/image.svg';
import axios from '../../axios';
import {CopyToClipboard } from 'react-copy-to-clipboard';
import {MdDone} from 'react-icons/md';
import Dropzone from 'react-dropzone';


const ImageCard=()=>{
    const [image,setImage]=useState(null);
    const [progress,setProgress]=useState(null);
    const [currentlyUpload,setCurrentlyUpload]=useState(false);
    const [error,setError]=useState({
        found:false,
        message: ''
    });
    const [copied,setCopied]=useState(false);
    const maxSize=5000000 ;

    const onCopyText=()=>{
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1000);
    }
    const onDrop=(acceptedFiles)=>{
        console.log(acceptedFiles)
    }
   
    const handleOnSubmit=  ({target:{files}})=>{
                console.log('Heloo !');
                let formData=new FormData();
                formData.append('image',files[0]);
                const options={
                    onUploadProgress: (progressEvent)=>{
                       const {loaded,total} = progressEvent;
                       let percent =Math.floor((loaded*100)/total);
                       console.log(`${loaded}kb of ${total} kb | ${percent} % `);
                       if(percent>0 && percent<100){
                            setProgress(percent);
                            setCurrentlyUpload(true);
                       }

                      }

                }
                axios.post('/images/',formData,options).then(res=>
                { 
                        setTimeout(()=>{
                            console.log(res.data.data);
                            setImage(res.data);
                            setProgress(0);
                            setCurrentlyUpload(false);
                        },2000)
                }
                ).catch((err)=>{
                    console.log(err);
                    if(err.response.status === 400){
                        const errMsg=err.response.data;
                        console.log(err.response.data.errors)
                        setError({
                            found:true,
                            message:err.response.data.errors
                        })
                        if(errMsg){ 
                            console.log(errMsg)
                        }
                    }else{
                        console.log('Another error %s',err)
                    }
                });
              console.log('Hello 3');
    }
    return(
        <>
        {
            currentlyUpload ?(
                <div className="progress-container">
                    <p>Uploading...</p>
                    <progress value={progress} max="100" min="0" className="progress-bar"/>
                 </div>  
            ):(
                <div className="container">
                {
                    image ? 
                    (    
                     <>
                     
                      {
                        error.found && (
                            <div className="error-container">
                                {error.message}
                            </div>
                        )
                     }
                     { 
                        <>
                            <div className="icon-container">
                            <div className="success-icon">
                                 <MdDone/>
                            </div>
                        </div>
                            <h3 className="success-text">Uploaded Successfully!</h3>
                            <div className="image-container">
                                <img className="full-image" src={`https://imageuploader90.herokuapp.com/images/${image._id}`} alt="name" />
                            </div>
        
                            <div className="link-container">
                                <input type="text"  className="text-container" value={`https://imageuploader90.herokuapp.com/images/${image._id}`} disabled/>
                                <CopyToClipboard text={`https://imageuploader90.herokuapp.com/images/${image._id}`} onCopy={onCopyText}>
                                <button type="button" className="copy-btn">{copied ? 'Copied !' : 'Copy' }</button>
                                </CopyToClipboard>
                            </div>
    
                            </>     
                     }    
                     </>
    
                    ):
                    (
                    <>
                        <h3>Upload Image</h3>
                        <p>File should be Jpeg,Png,..</p>
                        <Dropzone onDrop={onDrop} multiple={false} minSize={0} maxSize={maxSize}>
                            {
                                ({ getRootProps,getInputProps })=>(
                                    <div {...getRootProps({ className: "file-container" })} onChange={handleOnSubmit}>
                                        <input {...getInputProps()} />
                                        <img src={Image} alt="example"/>
                                        <p>Drag &amp; Drop your image here </p>
                                    </div>
                                )
                            }
                           
                        </Dropzone>
                        <p className="trans">Or</p>
                
                        <div class="btn-container">
                             <input type="file"  onChange={handleOnSubmit} name="upfile"/>
                             <button type="submit"  className="btn-upload">Choose a file</button>
                        </div>
    
                     </>  
                    )
                }
    
             </div>
            )
        }
       
         <div className={currentlyUpload ? "hid-footer" : "footer-text"}>Created By <span className="author-name">Thomas98</span>-devChallenges.io</div>
         </>
    )
};

export default ImageCard;