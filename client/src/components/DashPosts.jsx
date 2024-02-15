import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const DashPosts = () => {

    const { user } = useSelector((state) => state.user);
     
    const fetchPosts = async () => {
        try {
           const response =await fetch('http://localhost:300/api/posts/getallpost', {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                     Id:user.user._id,
                     access_token:localStorage.getItem('access_token')
                })
              });
                const result = await response.json();
                if(result.success){
                    console.log(result.data);
                }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchPosts();
    }, [])
  return (
    <div>Posts</div>
  )
}

export default DashPosts