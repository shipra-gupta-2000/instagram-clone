import React , {useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db} from './firebase'
import { Input,Button} from '@material-ui/core'
function Post({postId,user,username,image_url,caption}) {
      const [comments, setComments] = useState([])
      const [comment, setComment] = useState("")
    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe=db
            .collection("post")
            .doc(postId)
            .collection("comments")
            .onSnapshot(s=>{
                setComments(s.docs.map((doc)=>doc.data()));
            });
        }
        return ()=>{
            unsubscribe();
        };
      }, [postId]);
    const postComment=(e)=>{
        e.preventDefault();
        db.collection("post").doc(postId).collection("comments").add({
            username:user.displayName,
            comment:comment
        })
       setComment("");
    }
    return (
        <div className="post">
            {/*header->avtar-username*/}
            <div className="post_header">
            <Avatar
             className="post_avatar"
             alt="mussi"
             src="https://post.medicalnewstoday.com/wp-content/uploads/sites/3/2020/02/322868_1100-1100x628.jpg"            
            />
             <h3>{username}</h3>
            </div>           
           
            {/*image*/}
            <img className="post_image" src={image_url} />
            {/*username-caption*/}
            <h3 className="post_text"><strong>{username}</strong> {caption}</h3>
            {/*comments*/}
            <div className="post_comments">
            {comments.map((docs)=>
                    <p><b>{docs.username} : </b>{docs.comment}</p>
                )}
            </div>
            
            {
                (user)&&
                (<form className="post_comment">
            <Input className="post_text"
                  type="text"
                  placeholder="make a comment"
                  value={comment}
                  onChange={(e)=>setComment(e.target.value)}
                 />
                 <button className="post_btn"type="submit" onClick={postComment}
                 disable={(!comment).toString()}>
                     Post
                 </button>
            </form>)
            }
        </div>
    )
}

export default Post
