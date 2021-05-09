import React ,{useState,useEffect} from 'react';
import './App.css';
import Post from './Post.js';
import {db,auth} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button ,Input} from '@material-ui/core';
import ImageUpload from './ImgaeUpload.js'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes=useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [posts, setPost] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [image, setImage] = useState(null);
//orderBy('timestamp','desc').
  useEffect(() => {
    db.collection('post').orderBy('timestamps','desc').onSnapshot(s=>{
      setPost(s.docs.map(doc=>({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);
  
 const signUp=(e)=>{
      e.preventDefault();
      auth
      .createUserWithEmailAndPassword(email,password)
      .then((authuser)=>{
        return authuser.user.updateProfile({
          displayName:username,
          //photoURL:image
        })
      })
      .catch((e)=>alert(e.message))
      setOpen(false);
 }

 useEffect(() => {
      const unsubscribe=auth.onAuthStateChanged(authuser=>{
        if(authuser)
        {
          //user has logged in
          console.log(authuser)
          setUser(authuser)
        }
        else{
          //user logged out
          setUser(null)
        }
      });
      return()=>{
        unsubscribe();
      }
 }, [user,username])

 const signIn=(e)=>{
  e.preventDefault();
  auth
  .signInWithEmailAndPassword(email,password)
  .then((m)=>{setUser(m);setUsername(m.displayName)})
  .catch((e)=>alert(e.message))
  setOpenSignin(false);
  console.log(user)
}
const handleChange=(e)=>{
  if(e.target.files[0])
  {
      setImage(e.target.files[0]);
  }
};
  return (
    <div className="app">
      {/*login*/}
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
       <div style={modalStyle} className={classes.paper}>
         <form className="app_signup">
           <center>
              <img className="model_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>
              <Input type="text" placeholder="username" value={username} 
              onChange={(e)=>setUsername(e.target.value)} />
              <Input type="text" placeholder="email" value={email}
              onChange={(e)=>setEmail(e.target.value)} />
              <Input type="password" placeholder="password" value={password}
              onChange={(e)=>setPassword(e.target.value)} /><br/>
              {/* <div className="app_signupimage"><p>Select your image :&ensp; 
                </p><input type="file"  onChange={handleChange}/></div><br/> */}
              <Button  type="submit" onClick={signUp}>Sign Up</Button>
         </form>
       </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={()=>setOpenSignin(false)}
      >
       <div style={modalStyle} className={classes.paper}>
         <form className="app_signup">
           <center>
              <img className="model_headerImage"
              src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>
              <Input type="text" placeholder="email" value={email}
              onChange={(e)=>setEmail(e.target.value)} />
              <Input type="password" placeholder="password" value={password}
              onChange={(e)=>setPassword(e.target.value)} />
              <Button  type="submit" onClick={signIn}>Sign In</Button>
         </form>
       </div>
      </Modal>
      {/*header*/}
      <div className="app_header">
        <img className="app_headerImage"
        src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
        />
        {
        user?(<Button onClick={()=>auth.signOut()}>Log out</Button>):
        (<div>
          <Button onClick={()=>setOpenSignin(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Sign Up</Button>
        </div>)
      }
      </div>
      <center>
      <div className="app_post">
       
       {
          posts.map(({id,post})=>(
            
            <Post key={id} user={user}postId={id} username={post.username} image_url={post.image_url} caption={post.caption}/>
          ))
        }
       
       </div>
      </center>
     
       {/*upload image*/}
      {
        user?  <ImageUpload username={user.displayName}/>:<h2>login to upload</h2>
      }
     
    </div>
  );
}

export default App;
