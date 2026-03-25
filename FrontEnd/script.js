const token = localStorage.getItem("token");
let allWorks = [];

/* ===================== DISPLAY WORKS ===================== */

function displayWorks(works) {
const gallery = document.querySelector(".gallery");
if (!gallery) return;

gallery.innerHTML = "";

works.forEach(work => {
const figure = document.createElement("figure");

const image = document.createElement("img");
image.src = work.imageUrl;
image.alt = work.title;

const caption = document.createElement("figcaption");
caption.innerText = work.title;

figure.append(image, caption);
gallery.appendChild(figure);
});
}

function displayModalWorks(works) {
const modalGallery = document.querySelector(".modal-gallery");
if (!modalGallery) return;

modalGallery.innerHTML = "";

works.forEach(work => {
const figure = document.createElement("figure");
figure.classList.add("modal-work");

const image = document.createElement("img");
image.src = work.imageUrl;
image.alt = work.title;

const deleteButton = document.createElement("button");
deleteButton.type = "button";
deleteButton.classList.add("delete-work");
deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

deleteButton.addEventListener("click", async () => {
await deleteWork(work.id);
});

figure.append(image, deleteButton);
modalGallery.appendChild(figure);
});
}

/* ===================== DELETE ===================== */

async function deleteWork(workId) {
try {
const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
method: "DELETE",
headers: { Authorization: `Bearer ${token}` }
});

if (response.ok) {
allWorks = allWorks.filter(work => work.id !== workId);
displayWorks(allWorks);
displayModalWorks(allWorks);
}
} catch (error) {
console.error("Erreur suppression :", error);
}
}

/* ===================== FETCH WORKS ===================== */

fetch("http://localhost:5678/api/works")
.then(r => r.json())
.then(works => {
allWorks = works;
displayWorks(allWorks);
displayModalWorks(allWorks);
});

/* ===================== FETCH CATEGORIES ===================== */

fetch("http://localhost:5678/api/categories")
.then(r => r.json())
.then(categories => {
const filtersContainer = document.querySelector(".filters");
const select = document.getElementById("category");

if (filtersContainer) {
filtersContainer.innerHTML = "";

const buttonAll = document.createElement("button");
buttonAll.innerText = "Tous";
filtersContainer.appendChild(buttonAll);

buttonAll.addEventListener("click", () => displayWorks(allWorks));

categories.forEach(category => {
const button = document.createElement("button");
button.innerText = category.name;
filtersContainer.appendChild(button);

button.addEventListener("click", () => {
const filtered = allWorks.filter(
work => work.categoryId === category.id
);
displayWorks(filtered);
});
});
}

if (select) {
select.innerHTML = "";
categories.forEach(category => {
const option = document.createElement("option");
option.value = category.id;
option.textContent = category.name;
select.appendChild(option);
});
}
});

/* ===================== MODE EDIT ===================== */

const isLogged = !!localStorage.getItem("token");

if (isLogged) {
const filters = document.querySelector(".filters");
if (filters) filters.style.display = "none";

const loginLink = document.querySelector('a[href="./login.html"]');
if (loginLink) {
loginLink.textContent = "logout";
loginLink.href = "#";
loginLink.addEventListener("click", () => {
localStorage.removeItem("token");
window.location.reload();
});
}

const editBanner = document.getElementById("edit-banner");
if (editBanner) editBanner.style.display = "flex";

const editButton = document.getElementById("edit-projects");
if (editButton) editButton.style.display = "block";

} else {
// 🔥 TRÈS IMPORTANT : on cache explicitement
const editBanner = document.getElementById("edit-banner");
if (editBanner) editBanner.style.display = "none";

const editButton = document.getElementById("edit-projects");
if (editButton) editButton.style.display = "none";
}

/* ===================== MODAL ===================== */

const modal = document.getElementById("modal");
const openBtn = document.getElementById("edit-projects");
const closeBtn = document.querySelector(".modal-close");

openBtn?.addEventListener("click", () => modal.style.display = "flex");
closeBtn?.addEventListener("click", () => modal.style.display = "none");

modal?.addEventListener("click", e => {
if (e.target === modal) modal.style.display = "none";
});

/* ===================== SWITCH VIEWS ===================== */

const galleryView = document.getElementById("modal-gallery-view");
const addView = document.getElementById("modal-add-view");
const openAdd = document.getElementById("open-add-photo");
const backBtn = document.querySelector(".modal-back");

if (addView) addView.style.display = "none";
if (backBtn) backBtn.style.display = "none";

openAdd?.addEventListener("click", () => {
galleryView.style.display = "none";
addView.style.display = "block";
backBtn.style.display = "block";
});

backBtn?.addEventListener("click", () => {
addView.style.display = "none";
galleryView.style.display = "block";
backBtn.style.display = "none";
});

/* ===================== FORM ADD ===================== */

const addPhotoForm = document.getElementById("add-photo-form");
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const validateButton = document.querySelector(".validate-photo");

addPhotoForm?.addEventListener("submit", async (e) => {
e.preventDefault();

const imageFile = imageInput.files[0];
const titleValue = titleInput.value.trim();
const categoryValue = categorySelect.value;

if (!imageFile || !titleValue || !categoryValue) return;

const formData = new FormData();
formData.append("image", imageFile);
formData.append("title", titleValue);
formData.append("category", categoryValue);

try {
const response = await fetch("http://localhost:5678/api/works", {
method: "POST",
headers: { Authorization: `Bearer ${token}` },
body: formData
});

if (!response.ok) return alert("Erreur lors de l'ajout");

const newWork = await response.json();

allWorks.push(newWork);
displayWorks(allWorks);
displayModalWorks(allWorks);

addPhotoForm.reset();
resetPreview();

addView.style.display = "none";
galleryView.style.display = "block";
backBtn.style.display = "none";

updateValidateButton();
} catch (error) {
console.error(error);
}
});

/* ===================== VALIDATION ===================== */

function updateValidateButton() {
const valid =
imageInput?.files.length > 0 &&
titleInput?.value.trim() !== "" &&
categorySelect?.value !== "";

validateButton.style.backgroundColor = valid ? "#1D6154" : "#A7A7A7";
validateButton.disabled = !valid;
}

titleInput?.addEventListener("input", updateValidateButton);
categorySelect?.addEventListener("change", updateValidateButton);

/* ===================== PREVIEW ===================== */

const previewImage = document.getElementById("preview-image");
const previewIcon = document.getElementById("preview-icon");
const previewLabel = document.getElementById("preview-label");
const previewText = document.getElementById("preview-text");
const uploadPlaceholder = document.querySelector(".upload-placeholder");

function resetPreview() {
if (previewImage) {
previewImage.style.display = "none";
previewImage.src = "";
}

previewIcon && (previewIcon.style.display = "block");
previewLabel && (previewLabel.style.display = "block");
previewText && (previewText.style.display = "block");
uploadPlaceholder?.classList.remove("preview-mode");
}

imageInput?.addEventListener("change", () => {
const file = imageInput.files[0];
if (!file) return;

const url = URL.createObjectURL(file);

previewImage.src = url;
previewImage.style.display = "block";

uploadPlaceholder?.classList.add("preview-mode");

previewIcon && (previewIcon.style.display = "none");
previewLabel && (previewLabel.style.display = "none");
previewText && (previewText.style.display = "none");

updateValidateButton();
});

updateValidateButton();