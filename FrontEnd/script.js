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



fetch("http://localhost:5678/api/works")
.then(response => response.json())
.then(works => {
allWorks = works;
displayWorks(allWorks);
})
.catch(error => {
console.error("Erreur :", error);
});