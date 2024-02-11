import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef, useState } from 'react';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {useSelector} from 'react-redux'
import {app} from "../firebase"
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const DashProfile = () => {
  const user = useSelector(state => state.user.user);
  const [file, setFile] = useState(null);
  const [imgUrl,setImgUrl]=useState(null);
  const [imgFileUploading, setImgFileUploading] = useState(null);
  const [imgFileUploadingError, setImgFileUploadingError] = useState(null);
  const inputRef = useRef();

  const handleImg = (e) => {
    const file = e.target.files[0];
    if(file){
      setFile(file);
      setImgUrl(URL.createObjectURL(file));
    }
  }
  useEffect(()=>{
    if(file){
      uploadImg();
    }
  
  },[file])

  const uploadImg = async () => {
    try {
    setImgFileUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
  
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgFileUploading(progress.toFixed(0));
        },
        (error) => {
          // Handle errors with more specific messages
          setImgFileUploading(null);
          setFile(null);
          setImgUrl(null);
          if (error.code === 'storage/invalid-argument') {
            setImgFileUploadingError('File is too large (must be less than 1MB).');
          } else if (error.code === 'storage/unauthorized') {
            setImgFileUploadingError('Unauthorized to upload the file.');
          } else {
            setImgFileUploadingError('Error uploading file.');
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImgUrl(downloadURL);
            })
            .catch((error) => {
              setImgFileUploadingError('Failed to retrieve download URL.');
            });
        }
      );
    } catch (error) {
      setImgFileUploadingError('An error occurred during upload.');
    }
  };
  
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='font-semibold text-center text-3xl'>Profile</h1>
      <form className='flex flex-col gap-2 mt-3'>
        <input type="file" accept='image/*' onChange={handleImg} ref={inputRef} hidden />
        <div onClick={()=>inputRef.current.click()} className='relative w-32 h-32 self-center shadow-md overflow-hidden rounded-full'>
          {
            imgFileUploading &&(
              <CircularProgressbar value={imgFileUploading||0} text={`${imgFileUploading}%`}
              strokeWidth={5}
              styles={{
                root: { width: "100%", height: "100%" ,position:'absolute',
                top:0,
                left:0},
                path: { stroke: `rgb(62,152,99,${imgFileUploading/100})` },
              
              }}
               />
            )
          }
        <img src={user.user.DPurl===""?'https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png':imgUrl||user.user.DPurl} className={`w-full h-full rounded-full object-cover border-8 border-[lightgray] cursor-pointer ${imgFileUploading && imgFileUploading < 100 && 'opacity-60'}`} alt="User" />
       
        </div> {imgFileUploadingError&&<Alert color='failure' className='mt-2' outline>{imgFileUploadingError}</Alert>}
       <TextInput type='text' id='username' placeholder='Username' defaultValue={user.user.username}/>
       <TextInput type='email' id='email' placeholder='' defaultValue={user.user.email}/>
        <TextInput type='password' id='password' placeholder='Password' defaultValue="*********"/>
       <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className=' cursor-pointer'>Delete Account</span>
        <span className=' cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile