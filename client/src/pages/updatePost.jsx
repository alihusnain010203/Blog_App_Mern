// import React, { useRef, useState } from "react";
// import { Alert, Button, Label, TextInput } from "flowbite-react";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import {app} from '../firebase';
// import {useSelector} from 'react-redux';
// import { useNavigate } from "react-router-dom";

// const UpdatePost = () => {
//   const {user}=useSelector(state=>state.user);
//   const [file, setFile] = useState(null);
//   const [content, setContent] = useState("");
//   const [imgUrl, setImgUrl] = useState(null);
//   const [imgFileUploading, setImgFileUploading] = useState(null);
//   const [imgFileUploadingError, setImgFileUploadingError] = useState(null);
//   const navigate=useNavigate();

//   const inputImageRef = useRef(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     category: "",
//     content: "",
//     image: imgUrl,
//   });

//   const uploadImg = async () => {
//     try {
//       setImgFileUploadingError(null);
//       const storage = getStorage(app);
//       const fileName = new Date().getTime() + file.name;
//       const storageRef = ref(storage, fileName);

//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setImgFileUploading(progress.toFixed(0));

//         },
//         (error) => {
//           setImgFileUploading(null);
//           setFile(null);
//           setImgUrl(null);
//           if (error.code === "storage/invalid-argument") {
//             setImgFileUploadingError(
//               "File is too large (must be less than 1MB)."
//             );
//           } else if (error.code === "storage/unauthorized") {
//             setImgFileUploadingError("Unauthorized to upload the file.");
//           } else {
//             setImgFileUploadingError("Error uploading file.");
//           }
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref)
//             .then((downloadURL) => {
//               setImgUrl(downloadURL);
//               setFormData({ ...formData, image: downloadURL});
//             })
//             .catch((error) => {
//               setImgFileUploadingError("Failed to retrieve download URL.");
//             });
//         }
//       );
//     } catch (error) {
//       setImgFileUploadingError("An error occurred during upload.");
//     }
//   };

//   const handleSubmit = async(e) => {
//     e.preventDefault();
//     const response= await fetch('http://localhost:300/api/posts/updatepost', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         title: formData.title,
//         category: formData.category,
//         content: formData.content,
//         image: formData.image,
//         Id:user.user._id,
//         access_token:localStorage.getItem('access_token')
//       })

//     });

//     const result = await response.json();
//     if(result.success){
//       setFormData({
//         title: "",
//         category: "",
//         content: "",
//         image: ""
//       });
//       setImgUrl(null);
//       setFile(null);
//       setImgFileUploading(null);
//       setImgFileUploadingError(null);
//       setContent("");
//       navigate('/dashboard?tab=posts');
//     }else{
//       setImgFileUploadingError(result.message);
//     }
//   };

//   const handleFormChange = (e) => {

//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   };

//   return (
//     <div className="flex flex-col w-full justify-center items-center my-4 p-4 h-fit">
//       <h1 className=" font-bold text-2xl">Create A Post</h1>
//       <form className="w-full my-2 flex gap-3 flex-col" onSubmit={handleSubmit}>
//         <TextInput type="text" name="title" onChange={handleFormChange}  placeholder="Title" />
//         {/* Select Category of Post */}
//         <select name='category' onChange={handleFormChange} className="w-full p-2 rounded-md border-2 border-gray-300"  id="category">
//           <option defaultValue>Select a category</option>
//           <option  value="javascript">Javascript</option>
//           <option  value="react">React Js</option>
//           <option  value="node">Node Js</option>
//         </select>
//         {/* Upload Image */}
//         <div className="border-4 border-dotted border-purple-700 p-3">
//           <input
//             type="file"
//             onChange={(e) => {
//               const file = e.target.files[0];
//               if (file) {
//                 setFile(file);
//                 setImgUrl(URL.createObjectURL(file));
//               }
//             }}
//             hidden
//             ref={inputImageRef}
//           />
//           <div className="flex justify-center items-center h-32 w-full">
//             <img
//               src={imgUrl ? imgUrl : "https://via.placeholder.com/150"}
//               alt="preview"
//               className="h-full w-full object-cover rounded-md"
//             />
//           </div>
//           <div className="flex w-full justify-between gap-2 mt-3">
//             <Button gradientDuoTone="purpleToPink" outline onClick={()=>{
//               inputImageRef.current.click();
//             }}>Choose Img</Button>
//             <Button
//               gradientDuoTone="purpleToPink"
//               onClick={uploadImg}
//               disabled={file === null || imgFileUploading !== null}
//             >
//               {imgFileUploading ? `${imgFileUploading}%` : "Upload"}
//             </Button>
//           </div>
//         </div>
//         {/* Input Blog */}
//         <ReactQuill theme="snow" placeholder="Enter Something....." value={content}  onChange={(value) => {
//           setContent(value);

//           setFormData({ ...formData, content: content.replace(/<\/?p>/g, "") });
//           }}  className=" h-72" />
//         <Button type='submit' gradientDuoTone="purpleToPink" onClick={handleSubmit}>
//           Create Post
//         </Button>
//         {
//           imgFileUploadingError && (
//             <Alert color="failure" className="my-2">
//               {imgFileUploadingError}
//             </Alert>
//           )
//         }
//       </form>
//     </div>
//   );
// };

// export default UpdatePost;
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdatePost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

 

  const handleUpdloadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:300/api/posts/updatepost/${postId}/${user.user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            access_token: localStorage.getItem("access_token"),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);

        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);;
      }
    } catch (error) {
      setPublishError("Something went wrong");
    }
  };

 
  

  useEffect(()=>{
    const fetchPost = async () => {
      const res = await fetch(
        `http://localhost:300/api/posts/getallpost?PostId=${postId}`
      );
      const {data} = await res.json();
      if (!res.ok) {
        console.log(data.message);
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);

        setFormData({...data[0]});
      }
    };

    fetchPost();
  },[postId])
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUpdloadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {/* {formData.image
         && ( */}
          <img
            src={formData.image||"https://pbs.twimg.com/media/Fz7ik5hagAEOXcU?format=jpg&name=4096x4096"}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        {/* )} */}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update post
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
