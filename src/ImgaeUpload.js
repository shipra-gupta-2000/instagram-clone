import { Button } from '@material-ui/core'
import React,{useState} from 'react'
import {db,storage} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css'
function ImgaeUpload({username}) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
   const handleChange=(e)=>{
       if(e.target.files[0])
       {
           setImage(e.target.files[0]);
       }
    };
  const handleUpload=(e)=>{
           var uploadTask = storage.ref(`images/${image.name}`).put(image);
           uploadTask.on("state_changed",
           (s)=>{
              const progress=Math.round(
                  (s.bytesTransferred/s.totalBytes)*100);
                  setProgress(progress);
              
           },
           (e)=>alert(e.message),
           ()=>{
               storage
               .ref("images")
               .child(image.name)
               .getDownloadURL()
               .then(url=>{
                   db.collection('post').add({
                       timestamps:firebase.firestore.FieldValue.serverTimestamp(),
                       caption:caption,
                       image_url:url,
                       username:username
                   });
                   setProgress(0);
                   setCaption("");
                   setImage(null);
               })
           })
  }
    return (
        <div className="imageupload">
            <progress className="imageupload_progress" value={progress} max="100"/>
            <input typr="text" placeholder="enter caption ..." className="caption"
            value={caption}onChange={(e)=>setCaption(e.target.value)}/>
            <input type="file" onChange={handleChange}/>
            <Button type="submit" onClick={handleUpload} >Upload</Button>
        </div>
    )
}

export default ImgaeUpload
