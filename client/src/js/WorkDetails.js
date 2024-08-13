import React, { useEffect, useState } from "react";
import { API_URL } from "../apiConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../css/workDetails.css";

function WorkDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [work, setWork] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/works/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setWork(data))
      .catch((error) => console.error("Error fetching work details:", error));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this work?")) {
      fetch(`${API_URL}/works/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          alert("Work deleted successfully!");
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting work:", error);
          alert("Could not delete the work. Please try again later.");
        });
    }
  };

  const swapImages = (index) => {
    if (index !== mainImageIndex) {
      setMainImageIndex(index);
    }
  };

  if (!work) return <p>Loading...</p>;

  const mainImageUrl =
    work.images.length > 0
      ? work.images[mainImageIndex].startsWith("http")
        ? work.images[mainImageIndex]
        : `${API_URL}/uploads/${work.images[mainImageIndex]}`
      : null;

  return (
    <div className="container-workDetails">
      <h1>{work.title}</h1>
      <div className="main-section">
        {mainImageUrl && (
          <img
            src={mainImageUrl}
            alt={`${work.title}`}
            className="main-image"
          />
        )}
        <p>
          {work.description}
          {work.workLink && (
            <a
              href={work.workLink}
              target="_blank"
              rel="noopener noreferrer"
              className="work-link"
            >
              Link To The Work
            </a>
          )}
        </p>
      </div>

      <div className="images-container">
        {Array.isArray(work.images) && work.images.length > 0 ? (
          work.images.map((image, index) => {
            const imageUrl = image.startsWith("http")
              ? image
              : `${API_URL}/uploads/${image}`;

            return (
              <img
                key={index}
                src={imageUrl}
                alt={`${work.title} ${index}`}
                className="work-image"
                onClick={() => swapImages(index)}
              />
            );
          })
        ) : (
          <p>No images available</p>
        )}
      </div>

      <div className="edit-delete-btn">
        <button onClick={() => navigate(`/edit/${id}`)} className="edit-button">
          Edit
        </button>
        <button onClick={handleDelete} className="delete-button">
          Delete
        </button>
      </div>
    </div>
  );
}

export default WorkDetails;
