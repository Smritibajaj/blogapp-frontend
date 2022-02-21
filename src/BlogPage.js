import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_URL, BACKEND_URL } from "./constants/apiUrl";

const BlogPage = () => {
  let token = localStorage.getItem("token");
  let parsedToken = JSON.parse(token);
  const [blogs, setBlogs] = useState();
  const [input, setInput] = useState({
    title: "",
    description: "",
    image: "",
  });
  const [action, setAction] = useState("create");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    console.log(files[0]);
    const formData = new FormData();
    console.log(files[0]);
    formData.append("image", files[0]);
    const headers = {
      Authorization: `Bearer ${parsedToken}`,
    };

    if (files) {
      fetch(API_URL.UPLOAD_IMAGE, {
        method: "POST",
        headers,
        body: formData,
      })
        .then((response) => response.json())
        .then((data) =>
          setInput({
            ...input,
            image: `${`${BACKEND_URL}/`}${data.response.path}`,
          })
        )
        .catch((e) => console.log(e));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const defaultOptions = {
      headers: {
        Authorization: token ? `Bearer ${parsedToken}` : "",
      },
    };
    if ((action === "create" && input.title && input.description)) {
      axios
        .post(API_URL.CREATE_BLOG, input, {
          ...defaultOptions,
        })
        .then((response) => {
          console.log(response);
          setBlogs([...blogs, response.data.response]);
          setInput({ title: "", description: "", image: "" });
          setAction('create')
        })
        .catch((e) => console.log(e));
    }
    else if(action==="update" && input.title && input.description){
      axios
        .put(`${API_URL.UPDATE_BLOG}/${input._id}`, input, {
          ...defaultOptions,
        })
        .then((response) => {
          console.log(response);
          const filterblogs = blogs?.filter((blog) => blog._id !== input._id)
          setBlogs([...filterblogs, response.data.response]);
          setInput({ title: "", description: "", image: "" });
          setAction('create')
        })
        .catch((e) => console.log(e));
    }
  };

  const handleUpdate = (e, blog) => {
    e.preventDefault();

    setInput({
      ...blog,
    });
    setAction("update");
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    const defaultOptions = {
      headers: {
        Authorization: token ? `Bearer ${parsedToken}` : "",
      },
    };
    axios
      .delete(`${API_URL.DELETE_BLOG}/${id}`, {
        ...defaultOptions,
      })
      .then((response) => {
        console.log(response);
        const updatedblogs = blogs?.filter((blog) => blog._id !== id);
        console.log(updatedblogs);
        setBlogs([...updatedblogs]);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    axios
      .get(API_URL.GET_ALL_BLOG, {
        headers: { Authorization: `Bearer ${parsedToken}` },
      })
      .then((response) => {
        setBlogs(response.data.response);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center bg-teal-lightest font-sans">
      <form
        autoComplete="off"
        className="w-full lg:w-3/4 lg:max-w-lg my-6 border p-6 rounded-xl shadow-xl"
      >
        <h1 className="font-bold text-xl my-4 text-blue-600 text-center">
          {action.toUpperCase()} BLOG
        </h1>
        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blue-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            value={input.title}
            onChange={handleInputChange}
            className="border-0 px-3 py-3 placeholder-blue-300 text-blue-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Title"
          />
        </div>

        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blue-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            value={input.description}
            onChange={handleInputChange}
            className="border-0 px-3 py-3 placeholder-blue-300 text-blue-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="Description"
          />
        </div>

        <div className="relative w-full mb-3">
          <label
            className="block uppercase text-blue-600 text-xs font-bold mb-2"
            htmlFor="grid-password"
          >
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="border-0 px-3 py-3 placeholder-blue-300 text-blue-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
            placeholder="image"
          />
        </div>

        <div className="text-center mt-6">
          <button
            className="bg-blue-800 text-white active:bg-blue-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
            type="button"
            onClick={(e) => handleSubmit(e)}
          >
            Submit
          </button>
        </div>
      </form>
      <h1 className="font-bold text-xl my-4 text-blue-600">YOUR BLOGS</h1>
      {blogs?.map((blog, i) => {
        return (
          <div className="w-full flex flex-col items-center justify-center bg-teal-lightest font-sans">
            <div
              key={`blog-${i}`}
              className="bg-white border rounded shadow-xl p-6 m-4 w-full lg:w-3/4 lg:max-w-lg"
            >
              <div className="flex justify-between">
                <div className="text-lg font-semibold text-blue-600">
                  {blog.title}
                </div>
                <div className="flex space-x-2">
                  <img
                    className="h-6 w-6"
                    src="/images/pencil.svg"
                    alt="edit"
                    onClick={(e) => {
                      handleUpdate(e, blog);
                    }}
                  />
                  <img
                    className="h-6 w-6"
                    src="/images/trash.svg"
                    alt="delete"
                    onClick={(e) => {
                      handleDelete(e, blog._id);
                    }}
                  />
                </div>
              </div>
              <div className="text-sm text-blue-400">{blog.description}</div>
              {blog.image && <img src={blog.image} alt={blog.title} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BlogPage;
