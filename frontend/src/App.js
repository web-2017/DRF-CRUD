import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

// https://www.youtube.com/watch?v=hISSGMafzvU

function App() {
  const [listTodos, setListTodos] = useState([]);

  const [posts, setPosts] = useState({
    id: null,
    title: "",
    body: "",
    comleted: false,
  });

  const baseUrl = "http://127.0.0.1:8000/api";
  let formValues = document.querySelectorAll(".form-control");
  let form = document.querySelector("#form");

  useEffect(() => {
    fetchMyAPI();
  }, []);

  useEffect(() => {
    fetchMyAPI();
  }, [listTodos.title]);

  const fetchMyAPI = async () => {
    const response = await fetch(`${baseUrl}/task-list/`);
    const data = await response.json();
    setListTodos(data);
  };

  // onChange input values handler
  const handleChange = (e) => {
    setPosts({
      ...posts,
      [e.target.name]: e.target.value.trim(),
      comleted: true,
    });
  };

  // create and edit Posts
  const formSubmited = async (e) => {
    e.preventDefault();

    if (!formValues[0].value && !formValues[1].value) return;

    const api = posts.id
      ? `${baseUrl}/task-update/${posts.id}/`
      : `${baseUrl}/task-create/`;

    try {
      let response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(posts),
      });
      let result = await response.json();

      // EDIT POST
      if (posts.id) {
        setListTodos([
          ...listTodos.map((el) => {
            if (el.id === result.id) {
              return result;
            }
            return el;
          }),
        ]);
      } else {
        // CREATE POST
        setListTodos([
          ...listTodos,
          {
            id: result.id,
            title: result.title,
            body: result.body,
          },
        ]);
      }

      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteHandler = async (item) => {
    try {
      const response = await fetch(`${baseUrl}/task-delete/${item.id}/`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });

      let result = await response.json();

      alert(result);
    } catch (error) {
      console.log("Error delete: ", error);
    }
  };

  const editPostHandler = (param) => {
    setPosts({
      id: param.id,
      title: param.title,
      body: param.body,
    });

    formValues[0].value = param.title;
    formValues[1].value = param.body;
  };

  const renderPostsData = () => {
    return listTodos.map((item, i) => {
      return (
        <div className="row" key={i}>
          <div className="col-sm">
            <div>
              <h4>{item.title}</h4>
              <span>id: {item.id}</span>
              <p>{item.body}</p>
              <button
                className="btn btn-small btn-success"
                onClick={() => editPostHandler(item)}
              >
                Edit
              </button>
              <button
                className="btn btn-small btn-warning"
                onClick={() => deleteHandler(item)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="App">
      <div className="container">
        <div id="form-wrapper">
          <form id="form">
            <div className="form-group">
              <label htmlFor="title">title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                aria-describedby="emailHelp"
                onChange={handleChange}
              />
              <small id="emailHelp" className="form-text text-muted">
                We'll never share your email with anyone else.
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="body">Post</label>
              <textarea
                className="form-control"
                id="body"
                name="body"
                rows="3"
                onChange={handleChange}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={formSubmited}
            >
              Submit
            </button>
          </form>
          <div className="container">{renderPostsData()}</div>
        </div>
      </div>
    </div>
  );
}
export default App;
