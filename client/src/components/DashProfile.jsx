import { Alert, Button, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateUserStart,
  updateUserFail,
  updateUserSuccess,
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
} from "../redux/userSlice/userSlice";

const DashProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const {error}=useSelector(state=>state.user);
  const [file, setFile] = useState(null);
  const [imgUrl, setImgUrl] = useState(null);
  const [imgFileUploading, setImgFileUploading] = useState(null);
  const [imgFileUploadingError, setImgFileUploadingError] = useState(null);
  const inputRef = useRef();

  const [formData, setFormData] = useState({
    username: user.user.username,
    email: user.user.email,
    password: "",
    DPurl: user.user.DPurl,
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setImgUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (file) {
      uploadImg();
    }
  }, [file]);

  const uploadImg = async () => {
    try {
      setImgFileUploadingError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImgFileUploading(progress.toFixed(0));
        },
        (error) => {
          setImgFileUploading(null);
          setFile(null);
          setImgUrl(null);
          if (error.code === "storage/invalid-argument") {
            setImgFileUploadingError(
              "File is too large (must be less than 1MB)."
            );
          } else if (error.code === "storage/unauthorized") {
            setImgFileUploadingError("Unauthorized to upload the file.");
          } else {
            setImgFileUploadingError("Error uploading file.");
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setImgUrl(downloadURL);
              setFormData({ ...formData, DPurl: downloadURL });
            })
            .catch((error) => {
              setImgFileUploadingError("Failed to retrieve download URL.");
            });
        }
      );
    } catch (error) {
      setImgFileUploadingError("An error occurred during upload.");
      
    }
  };

  const deleteUser=async()=>{
    dispatch(deleteUserStart());
  
    try {
      console.log(localStorage.getItem("access_token"));
      const response = await fetch(
        `http://localhost:300/api/users/delete/${user.user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "access_token": localStorage.getItem("access_token"),
          },
          
          body: JSON.stringify({ access_token: localStorage.getItem("access_token") }),
        }
      );
      const result = await response.json();
      if(result.success===false){
        return dispatch(deleteUserFail(result.message));
      }
      if (result === "User has been deleted") {
       
        localStorage.clear();
        window.location.href = "/sign-in";
      }
      dispatch(deleteUserSuccess());
    } catch (error) {

      dispatch(deleteUserFail("Something went wrong"));
    }
  }

  const signOut=async ()=>{
   const response = await fetch('http://localhost:300/api/auth/signout',{
      method:'GET',
      headers:{
        "Content-Type":"application/json",
        "access_token":localStorage.getItem("access_token")
      }
    });
    const result = await response.json();
    if(result.message === 'Signout Successful'){
      localStorage.clear();
      window.location.href = '/sign-in';
    }
  }

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      console.log(user.user._id);
      const response = await fetch(
        `http://localhost:300/api/users/update/${user.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            DPurl: formData.DPurl,
            access_token: localStorage.getItem("access_token"),
          }),
        }
      );
      const result = await response.json();
      if(result.success===false){
        return dispatch(updateUserFail(result.message));
      }
      dispatch(
        updateUserSuccess({
          user: {
            _id: user.user._id,
            username: formData.username,
            password: formData.password,
            email: formData.email,
            DPurl: formData.DPurl,
          },
        })
      );
    } catch (error) {
      dispatch(updateUserFail("Something went wrong"));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="font-semibold text-center text-3xl">Profile</h1>
      <form className="flex flex-col gap-2 mt-3" onSubmit={submitForm}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImg}
          ref={inputRef}
          hidden
        />
        <div
          onClick={() => inputRef.current.click()}
          className="relative w-32 h-32 self-center shadow-md overflow-hidden rounded-full"
        >
          {imgFileUploading && (
            <CircularProgressbar
              value={imgFileUploading || 0}
              text={`${imgFileUploading}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: { stroke: `rgb(62,152,99,${imgFileUploading / 100})` },
              }}
            />
          )}
          <img
            src={
              user.user.DPurl === ""
                ? "https://cdn4.iconfinder.com/data/icons/web-ui-color/128/Account-512.png"
                : imgUrl || user.user.DPurl
            }
            className={`w-full h-full rounded-full object-cover border-8 border-[lightgray] cursor-pointer ${
              imgFileUploading && imgFileUploading < 100 && "opacity-60"
            }`}
            alt="User"
          />
        </div>{" "}
        {imgFileUploadingError && (
          <Alert color="failure" className="mt-2" outline>
            {imgFileUploadingError}
          </Alert>
        )}
        <TextInput
          onChange={handleChange}
          type="text"
          id="username"
          placeholder="Username"
          defaultValue={user.user.username}
        />
        <TextInput
          onChange={handleChange}
          type="email"
          id="email"
          placeholder=""
          defaultValue={user.user.email}
        />
        <TextInput
          onChange={handleChange}
         type="password"
          id="password"
          placeholder="Password"
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className=" cursor-pointer" onClick={()=>{
          deleteUser();
        }}>Delete Account</span>
        <span className=" cursor-pointer" onClick={signOut}>Sign Out</span>
      </div>
      {
       error && <Alert color="failure" className="mt-2" outline>
        {error}
      </Alert>
      }
    </div>
  );
};

export default DashProfile;
