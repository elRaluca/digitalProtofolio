import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../apiConfig";
import "../css/addWorkForm.css";
function AddWorkForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    workLink: "",
    status: "visible",
    imageUrls: [""],
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [useFile, setUseFile] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setImageFiles(e.target.files);
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

    if (useFile && imageFiles.length > 0) {
      Array.from(imageFiles).forEach((file) => {
        formDataObj.append("images", file);
      });
    } else if (!useFile) {
      formDataObj.append("images", JSON.stringify(formData.imageUrls));
    }

    fetch(`${API_URL}/works`, {
      method: "POST",
      body: formDataObj,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        alert("Work added successfully!");
        navigate("/");
      })
      .catch((error) => console.error("Error adding work:", error));
  };

  return (
    <div className="container-addWorkForm">
      <h1>Add A New Work</h1>
      <div className="container-form">
        <form className="add-work-form" onSubmit={handleSubmit}>
          <div className="left-side">
            <label htmlFor="add-title">Add Title</label>
            <input
              id="add-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="add-description">Add Description</label>
            <textarea
              id="add-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="right-side">
            <div className="choose-images">
              <div className="add-images">
                <label htmlFor="add-images-radio">Add Images</label>
                <input
                  id="add-images-radio"
                  type="radio"
                  name="imageSource"
                  value="file"
                  checked={useFile}
                  onChange={() => setUseFile(true)}
                />
              </div>
              <div>
                <label htmlFor="add-url-radio">Use Url</label>
                <input
                  id="add-url-radio"
                  type="radio"
                  name="imageSource"
                  value="url"
                  checked={!useFile}
                  onChange={() => setUseFile(false)}
                />
              </div>
            </div>
            {useFile ? (
              <input
                id="add-file-input"
                type="file"
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
            ) : (
              <>
                {formData.imageUrls.map((url, index) => (
                  <div key={index}>
                    <input
                      id="add-url"
                      type="text"
                      name={`imageUrl${index}`}
                      value={url}
                      onChange={(e) =>
                        handleImageUrlChange(index, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  className="add-another-url-btn"
                  onClick={addImageUrlField}
                >
                  Add Another URL
                </button>
              </>
            )}
            <label htmlFor="add-work-link">Work Link</label>
            <input
              id="add-work-link"
              name="workLink"
              value={formData.workLink}
              onChange={handleChange}
              required
            />
            <p>Choose Visibility</p>
            <select
              id="choose-visibility"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="visible">Visible</option>
              <option value="hidden">Hidden</option>
            </select>
            <button className="save-work-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddWorkForm;
