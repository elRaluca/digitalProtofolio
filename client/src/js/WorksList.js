import React, { useEffect, useState } from "react";
import { API_URL } from "../apiConfig";
import { useNavigate } from "react-router-dom";
import "../css/workList.css";

function WorksList({ showHidden }) {
  const [works, setWorks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/works`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setWorks(data))
      .catch((error) => console.error("Error fetching works:", error));
  }, []);

  const handleDelete = (id) => {
    fetch(`${API_URL}/works/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setWorks((prevWorks) => prevWorks.filter((work) => work.id !== id));
        alert("Work deleted successfully!");
      })
      .catch((error) => console.error("Error deleting work:", error));
  };

  const handleToggleVisibility = (id, currentStatus) => {
    const newStatus = currentStatus === "visible" ? "hidden" : "visible";
    fetch(`${API_URL}/works/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        setWorks((prevWorks) =>
          prevWorks.map((work) =>
            work.id === id ? { ...work, status: newStatus } : work
          )
        );
        alert(
          `Work ${newStatus === "visible" ? "shown" : "hidden"} successfully!`
        );
      })
      .catch((error) => console.error("Error toggling visibility:", error));
  };

  const displayedWorks = works.filter((work) =>
    showHidden ? work.status === "hidden" : work.status === "visible"
  );

  return (
    <div className="container-works">
      <h1>{showHidden ? "Hidden Works" : "Digital Arts"}</h1>
      <div className="grid-works">
        {displayedWorks.map((work) => (
          <div key={work.id} className="card-works">
            <h2 onClick={() => navigate(`/works/${work.id}`)}>{work.title}</h2>
            <div>
              {Array.isArray(work.images) && work.images.length > 0 ? (
                <img
                  src={
                    work.images[0].startsWith("http")
                      ? work.images[0]
                      : `${API_URL}/uploads/${work.images[0]}`
                  }
                  alt={work.title}
                />
              ) : (
                <p>No images available</p>
              )}
            </div>
            <div className="card-btn">
              <button onClick={() => navigate(`/edit/${work.id}`)}>Edit</button>
              <button onClick={() => handleDelete(work.id)}>Delete</button>
              <button
                onClick={() => handleToggleVisibility(work.id, work.status)}
              >
                {work.status === "visible" ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorksList;
