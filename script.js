const API_ENDPOINT = "https://codeacademy-be-assignment-5.onrender.com";

const fetchCatPictures = async () => {
  // console.log("catPicture.path", catPicture.path);
  const catPicturesContainer = document.getElementById("catPictures");
  catPicturesContainer.classList.add("container");

  try {
    const response = await fetch(`${API_ENDPOINT}/fetch`);
    const catPictures = await response.json();
    catPicturesContainer.innerHTML = ""; // Clear previous cat pictures
    catPictures.forEach((catPicture) => {
      const imgCardContainer = document.createElement("div");
      imgCardContainer.classList.add("image-card-container");

      const imgContainer = document.createElement("div");
      imgContainer.classList.add("image-container");

      const img = document.createElement("img");
      img.src = catPicture.cloudinaryUrl;
      img.src = catPicture.path;
      img.alt = catPicture.filename;
      img.classList.add("image");
      imgContainer.appendChild(img);

      imgCardContainer.appendChild(imgContainer);

      const editDiv = document.createElement("div");
      editDiv.classList.add("edit-container");

      const updateForm = document.createElement("form");
      updateForm.classList.add("update-form");
      updateForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(updateForm);
        const catFile = formData.get("cat");
        updateCatPicture(catPicture._id, catFile);
      });

      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.name = "cat";
      fileInput.accept = "image/*";
      fileInput.required = true;

      const updateTextContent = document.createElement("p");
      updateTextContent.innerHTML =
        "Want to update an image? Select a new image from below and click on update button.";

      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "id";
      hiddenInput.value = catPicture._id;

      const submitButton = document.createElement("button");
      submitButton.type = "submit";
      submitButton.textContent = "Update Picture";

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () =>
        deleteCatPicture(catPicture._id)
      );

      updateForm.appendChild(updateTextContent);
      updateForm.appendChild(fileInput);
      updateForm.appendChild(hiddenInput);
      updateForm.appendChild(submitButton);
      updateForm.appendChild(deleteButton);

      editDiv.appendChild(updateForm);

      editDiv.appendChild(deleteButton);

      imgCardContainer.appendChild(editDiv);
      catPicturesContainer.appendChild(imgCardContainer);
    });
  } catch (error) {
    console.error("Error fetching cat pictures:", error);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");

  uploadForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(uploadForm);
    try {
      const response = await fetch(`${API_ENDPOINT}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log("Uploaded cat picture:", data);
      // Refresh the cat pictures after uploading
      fetchCatPictures();
    } catch (error) {
      console.error("Error uploading cat picture:", error);
    }
  });

  // Function to fetch and display uploaded cat pictures

  // Initial fetch of cat pictures when the page loads
  fetchCatPictures();
});

// Function to update a cat picture
async function updateCatPicture(id, file) {
  try {
    const formData = new FormData();
    formData.append("cat", file);

    const response = await fetch(`${API_ENDPOINT}/update/${id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await response.json();
    console.log(data.message);

    // Refresh the list of cat pictures after updating
    fetchCatPictures();
  } catch (error) {
    console.error("Error updating cat picture:", error);
  }
}

// Function to delete a cat picture
async function deleteCatPicture(id) {
  try {
    const response = await fetch(`${API_ENDPOINT}/delete/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data.message);
    // Refresh the list of cat pictures after deletion
    fetchCatPictures();
  } catch (error) {
    console.error("Error deleting cat picture:", error);
  }
}
