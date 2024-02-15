import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

const DashPosts = () => {
  const { user } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showmodal, setshowModal] = useState(false);
  const [postId, setPostId] = useState("");
  const [showMore, setShowMore] = useState(true);
  let id = user.user._id;
  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `
           http://localhost:300/api/posts/getallpost?Id=${id}
           `,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setUserPosts(result.data);
        if (result.data.length < 4) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleDeleteUser = async () => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:300/api/user/deletepost`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ id: user.user._id }),
  //       }
  //     );
  //     const result = await response.json();
  //     if (result.success) {
  //       setshowModal(false);
  //     }
  //   } catch (error) {

  //   }
  // };

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `
          http://localhost:300/api/posts/getallpost?Id=${id}&startIndex=${startIndex}
          `,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        setUserPosts((prev) => [...prev, ...result.data]);
        if (result.data.length < 4) {
          setShowMore(false);
        }
      }
    } catch (error) {}
  };

  const handleDeletePost = async () => {
    setshowModal(false);
    try {
      const res = await fetch(
        `http://localhost:300/api/posts/deletepost/${postId}/${user.user._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: localStorage.getItem("access_token"),
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postId)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);
  return (
    <div className="table-auto overflow-x-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user.user.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Post Image</TableHeadCell>
              <TableHeadCell>Title</TableHeadCell>
              <TableHeadCell>Catogory</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>Update</TableHeadCell>
            </TableHead>
            {userPosts.map((post, index) => (
              <TableBody className=" divide-y" key={index}>
                <TableRow>
                  <TableCell className=" font-extralight">
                    {`${new Date(
                      post.updatedAt
                    ).toLocaleDateString()} ${new Date(
                      post.updatedAt
                    ).toLocaleTimeString()}`}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        width="100"
                        height="100"
                      />
                    </Link>
                  </TableCell>
                  <TableCell className=" font-bold">
                    <Link to={`post/${post.slug}`}>{post.title}</Link>
                  </TableCell>
                  <TableCell className=" font-semibold capitalize">
                    {post.category}
                  </TableCell>
                  <TableCell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer border-2 border-gray-500 p-1 rounded-md"
                      onClick={() => {
                        setshowModal(true);
                        setPostId(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to="/edit-post"
                      className="text-orange-500 font-bold capitalize hover:underline border-2 border-gray-500 rounded-md p-1"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && (
            <Button
              className="w-full self-center "
              onClick={() => handleShowMore()}
            >
              Show More
            </Button>
          )}
        </>
      ) : (
        <h1>No Posts</h1>
      )}
      <Modal
        show={showmodal}
        onClose={() => setshowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setshowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashPosts;
