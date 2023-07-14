import React, { useState } from "react";
import { createTuitThunk } from "./services/post-thunks";
import { useDispatch, useSelector } from "react-redux";

const NewPostInput = () => {
  let [currentPostText, setCurrentPostText] = useState('');
  let [currentTopic, setCurrentTopic] = useState('');
  let [currentImageUrl, setCurrentImageUrl] = useState('');
  const { currentUser } = useSelector((state) => state.user); 
  const dispatch = useDispatch();

  const postClickHandler = () => {
    const newPost = {
        tuit: currentPostText,
        topic: currentTopic,
        imageUrl: currentImageUrl,
        companyName:currentUser.companyName
    }
    dispatch(createTuitThunk(newPost));
    setCurrentPostText("");
    setCurrentTopic("");
    setCurrentImageUrl("");
  }

  return (
    <div className="row">
      <div className="col-auto">
      </div>
      <div className="col-10">
        <textarea 
          value={currentPostText} 
          placeholder="Advertise your product"
          className="form-control border-0"
          onChange={(event) => setCurrentPostText(event.target.value)}>
        </textarea>
        <input 
          type="text" 
          value={currentTopic} 
          placeholder="Topic"
          className="form-control border-0 mt-2"
          onChange={(event) => setCurrentTopic(event.target.value)} 
        />
        <input 
          type="text" 
          value={currentImageUrl} 
          placeholder="Image URL"
          className="form-control border-0 mt-2"
          onChange={(event) => setCurrentImageUrl(event.target.value)} 
        />
        {currentImageUrl && <img src={currentImageUrl} alt="preview" className="img-fluid mt-2"/>}
        <div>
          <button 
            className="rounded-pill btn btn-primary float-end mt-2 ps-3 pe-3 fw-bold"
            onClick={postClickHandler}>
            Post
          </button>
        </div>
      </div>
      <div className="col-12"><hr/></div>
    </div>
  );
}

export default NewPostInput;
