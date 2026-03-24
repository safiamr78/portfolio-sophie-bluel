const token = localStorage.getItem("token");

let allWorks = [];

function displayWorks(works) {
const gallery = document.querySelector(".gallery");
gallery.innerHTML = "";

works.forEach(work => {
const figure = document.createElement("figure");

const image = document.createElement("img");
image.src = work.imageUrl;
image.alt = work.title;

const caption = document.createElement("figcaption");
caption.innerText = work.title;

figure.appendChild(image);
figure.appendChild(caption);

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
        deleteButton.classList.add("delete-work");
        deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

        figure.appendChild(image);
        figure.appendChild(deleteButton);
        modalGallery.appendChild(figure);
    });
}

fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(works => {
allWorks = works;
displayWorks(allWorks);
displayModalWorks(allWorks);
})
.catch(error => {
console.error("Erreur :", error);
});

fetch("http://localhost:5678/api/categories")
.then(response => response.json())
.then(categories => {
const filtersContainer = document.querySelector(".filters");
filtersContainer.innerHTML = "";

const buttonAll = document.createElement("button");
buttonAll.innerText = "Tous";
filtersContainer.appendChild(buttonAll);

buttonAll.addEventListener("click", () => {
displayWorks(allWorks);
});

categories.forEach(category => {
const button = document.createElement("button");
button.innerText = category.name;
filtersContainer.appendChild(button);

button.addEventListener("click", () => {
const filteredWorks = allWorks.filter(
work => work.categoryId === category.id
);
displayWorks(filteredWorks);
});
});
})
.catch(error => {
console.error("Erreur :", error);
});

if (token) {
    const filters = document.querySelector(".filters");
    if (filters) {
        filters.style.display = "none";
    }

    const loginLink = document.querySelector('a[href="./login.html"]');

    if (loginLink) {
        loginLink.textContent = "logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", () => {
            localStorage.removeItem("token");
            window.location.reload();
        });
    }
}

if (token) {
const editBanner = document.getElementById("edit-banner");
if (editBanner) {
editBanner.style.display = "flex";
}

const editButton = document.getElementById("edit-projects");
if (editButton) {
editButton.style.display = "block";
}
}

const modal = document.getElementById("modal");
const modalOpenButton = document.getElementById("edit-projects");
const closeModal = document.querySelector(".modal-close");

if (modalOpenButton) {
modalOpenButton.addEventListener("click", () => {
if (modal) {
modal.style.display = "flex";
}
});
}

if (closeModal) {
closeModal.addEventListener("click", () => {
if (modal) {
modal.style.display = "none";
}
});
}

window.addEventListener("click", (event) => {
if (modal && event.target === modal) {
modal.style.display = "none";
}
});