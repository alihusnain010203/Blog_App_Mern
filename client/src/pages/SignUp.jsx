import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.username === "" || data.email === "" || data.password === "") {
      return setError("All fields are required");
    }
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:300/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success === false) {
        setLoading(false);
        return setError(result.message);
      }

      setLoading(false);
      setData({
        username: "",
        email: "",
        password: "",
      });
      navigate("/sign-in");
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="mb-10 min-h-fit mt-20 p-5">
      <div className="flex w-full justify-evenly flex-col md:flex-row gap-5">
        {/* left */}
        <div className="flex-1 flex justify-center items-center flex-col">
          <Link
            to="/"
            className="text-xl md:text-4xl font-bold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Tech's Overflow
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project you can SignUp with email password or with
            Google
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div>
              <Label value="username"></Label>
              <TextInput
                type="text"
                placeholder="username"
                id="username"
                onChange={handleChange}
                value={data.username}
              />
            </div>
            <div>
              <Label value="email"></Label>
              <TextInput
                type="text"
                placeholder="e.g example@gmail.com"
                id="email"
                onChange={handleChange}
                value={data.email}
              />
            </div>
            <div>
              <Label value="password"></Label>
              <TextInput
                type="text"
                placeholder="password"
                id="password"
                onChange={handleChange}
                value={data.password}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span>Have an account?</span>
            <Link to="/sign-in" className="text-blue-600">
              Sign In
            </Link>
          </div>
          {error && (
            <Alert className="mt-5 bg-red-400" color="failure ">
              {error}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
