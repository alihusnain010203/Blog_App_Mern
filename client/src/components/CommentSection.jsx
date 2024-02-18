import { Alert, Button, TextInput, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Comment from "./Comment";
const CommentSection = ({ postId }) => {
  const user = useSelector((state) => state.user.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  let currentUser;

  if (user) {
    currentUser = user.user;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length < 1) {
      return setError("Comment cannot be empty");
    }
    if (comment.length > 200) {
      return setError("Comment cannot be more than 200 characters");
    }
    try {
      const res = await fetch(`http://localhost:300/api/comments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId: postId,
          userId: currentUser._id,
          access_token: localStorage.getItem("access_token"),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      }
      getComments();
      setComment("");
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigate("/sign-in");
        return;
      }
      const res = await fetch(
        `http://localhost:300/api/comments/likeComment/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: localStorage.getItem("access_token"),
          }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const getComments = async () => {
    try {
      const res = await fetch(
        `http://localhost:300/api/comments/getPostComments/${postId}`
      );
      const data = await res.json();
      setComments(data);
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDelete = async (commentId) => {
    try {
      if (!currentUser) {
        navigate('/sign-in');
        return;
      }
      const res = await fetch(`http://localhost:300/api/comments/deleteComment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_token: localStorage.getItem('access_token')})
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getComments();
  }, [postId]);
  console.log(comments);
  return (
    <div className="max-w-2xl mx-auto">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 ">
          <p>Signed in as</p>
          <img
            src={
              currentUser.DPurl ||
              "https://media.istockphoto.com/id/1223671392/vector/default-profile-picture-avatar-photo-placeholder-vector-illustration.jpg?s=612x612&w=0&k=20&c=s0aTdmT5aU6b8ot7VKm11DeID6NctRCpB755rA1BIP0="
            }
            className="h-5 w-5 rounded-full object-cover"
            alt=""
          />
          <Link to="/dashboard?tab=profile">
            {" "}
            <p className="text-xs text-cyan-600 hover:underline">
              @{currentUser.username}
            </p>
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-sm text-teal-500 my-5">Sign in to comment</p>
          <Link to="/sign-in" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[50vw] gap-3 border border-teal-500 rounded-md p-3"
        >
          <Textarea
            placeholder="Write a comment"
            rows="3"
            maxLength={200}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            value={comment}
          />
          <div className="flex flex-col md:flex-row justify-center md:justify-between">
            <p className="text-xs">
              <span className="text-gray-500">
                {200 - comment.length} characters remaining
              </span>
            </p>
            <Button type="submit" outline gradientDuoTone="purpleToBlue">
              Comment
            </Button>
          </div>
          {error && (
            <Alert color="failure">
              <p className="text-red-600 text-xs text-center">{error}</p>
            </Alert>
          )}
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-gray-500 text-center my-5">No comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} onLike={handleLike} onDelete={handleDelete} />
          ))}
        </>
      )}
    </div>
  );
};

export default CommentSection;
