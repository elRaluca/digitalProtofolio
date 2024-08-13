import React, { useState, useEffect } from "react";
import { API_URL } from "../apiConfig";
import { useParams, useNavigate } from "react-router-dom";
import "../css/editWorkForm.css";

function EditWorkForm({ onSuccess }) {
  const { id: workId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workLink: "",
    status: "visible",
    imageUrls: [],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [useFile, setUseFile] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/works/${workId}`)
      .then((response) => response.json())
      .then((data) => {
        setFormData({
          title: data.title,
          description: data.description,
          workLink: data.workLink,
          status: data.status,
          imageUrls: Array.isArray(data.images) ? data.images : [],
        });
      })
      .catch((error) => console.error("Error fetching work:", error));
  }, [workId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageFilesChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleImageUrlChange = (index, value) => {
    const updatedUrls = [...formData.imageUrls];
    updatedUrls[index] = value;
    setFormData({ ...formData, imageUrls: updatedUrls });
  };

  const addImageUrlField = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ""] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("description", formData.description);
    formDataObj.append("workLink", formData.workLink);
    formDataObj.append("status", formData.status);

    if (useFile) {
      imageFiles.forEach((file) => {
        formDataObj.append("images", file);
      });
    } else {
      formData.imageUrls.forEach((url) => {
        formDataObj.append("images", url);
      });
    }

    fetch(`${API_URL}/works/${workId}`, {
      method: "PUT",
      body: formDataObj,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Work updated successfully!");
        if (typeof onSuccess === "function") {
          onSuccess();
        }
        navigate("/");
      })
      .catch((error) => {
        console.error("Error updating work:", error);
        alert("Could not update the work. Please try again later.");
      });
  };

  return (
    <div className="container-edit">
      <h1>Edit Work</h1>
      <div className="container-edit-form">
        <form className="edit-work-form" onSubmit={handleSubmit}>
          <div className="left-side-edit">
            <label htmlFor="edit-title">Edit Title</label>
            <input
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              required
            />
            <label htmlFor="edit-description">Edit Description</label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              required
            />
          </div>
          <div className="midle-side-edit">
            <div className="change-images">
              <div className="change-images-up">
                <label htmlFor="change-images-radio"> Upload Images</label>
                <input
                  id="change-images-radio"
                  type="radio"
                  name="imageSource"
                  checked={useFile}
                  onChange={() => setUseFile(true)}
                />
              </div>
              <div className="change-images-url-radio">
                <label htmlFor="change-images-url"> Use URLs</label>
                <input
                  id="change-images-url"
                  type="radio"
                  name="imageSource"
                  checked={!useFile}
                  onChange={() => setUseFile(false)}
                />
              </div>
            </div>
            {useFile ? (
              <input
                type="file"
                name="images"
                onChange={handleImageFilesChange}
                accept="image/*"
                multiple
              />
            ) : (
              <>
                {formData.imageUrls.map((url, index) => (
                  <div key={index}>
                    <input
                      id="add-url-edit"
                      type="text"
                      name={`imageUrl${index}`}
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(index, e.target.value)
                      }
                      placeholder="Image URL"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-another-url-edit"
                  onClick={addImageUrlField}
                >
                  Add Another URL
                </button>
              </>
            )}
          </div>
          <div className="right-side-edit">
            <label htmlFor="edit-link">Edit Link</label>
            <input
              id="edit-link"
              name="workLink"
              value={formData.workLink}
              onChange={handleChange}
              required
            />

            <p>Change Visibility</p>
            <select
              id="chnage-visibility"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <button className="save-edit-btn" type="submit">
              Update Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditWorkForm;
