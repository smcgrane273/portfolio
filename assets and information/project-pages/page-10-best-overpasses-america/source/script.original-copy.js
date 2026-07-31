const plates = [
  {
    file: "images/high-five-interchange.png",
    location: "High Five Interchange, Dallas, Texas. I-635 and US-75. 5-level stack.",
    source: "https://maps.google.com/?q=High+Five+Interchange+Dallas"
  },
  {
    file: "images/judge-harry-pregerson-interchange.png",
    location: "Judge Harry Pregerson Interchange, Los Angeles, California. I-105 and I-110. Multi-level stack.",
    source: "https://maps.google.com/?q=Judge+Harry+Pregerson+Interchange"
  },
  {
    file: "images/four-level-interchange.png",
    location: "Four Level Interchange, Los Angeles, California. US-101 and I-110. 4-level stack.",
    source: "https://maps.google.com/?q=Four+Level+Interchange+Los+Angeles"
  },
  {
    file: "images/tom-moreland-spaghetti-junction.png",
    location: "Tom Moreland Interchange (Spaghetti Junction), Atlanta, Georgia. I-85 and I-285. Complex stack.",
    source: "https://maps.google.com/?q=Spaghetti+Junction+Atlanta"
  },
  {
    file: "images/i10-i405-interchange.png",
    location: "I-10 / I-405 Interchange, Los Angeles, California. I-10 and I-405. Major interchange.",
    source: "https://maps.google.com/?q=I-10+I-405+Interchange"
  },
  {
    file: "images/stack-interchange-phoenix.png",
    location: "Stack Interchange, Phoenix, Arizona. I-10, SR-51, and Loop 202. 4-level stack.",
    source: "https://maps.google.com/?q=Phoenix+Stack+Interchange"
  },
  {
    file: "images/marquette-interchange.png",
    location: "Marquette Interchange, Milwaukee, Wisconsin. I-94, I-43, and I-794. Multi-level.",
    source: "https://maps.google.com/?q=Marquette+Interchange"
  },
  {
    file: "images/newark-airport-interchange.png",
    location: "Newark Airport Interchange, Newark, New Jersey. I-95, I-78, and US-1/9. Complex interchange.",
    source: "https://maps.google.com/?q=Newark+Airport+Interchange"
  },
  {
    file: "images/springfield-interchange-mixing-bowl.png",
    location: "Springfield Interchange (Mixing Bowl), Springfield, Virginia. I-95, I-495, and I-395. Multi-level.",
    source: "https://maps.google.com/?q=Springfield+Mixing+Bowl"
  },
  {
    file: "images/i10-loop-1604-interchange.png",
    location: "I-10 / Loop 1604 Interchange, San Antonio, Texas. I-10 and Loop 1604. Stack interchange.",
    source: "https://maps.google.com/?q=I-10+Loop+1604+Interchange+San+Antonio"
  }
];

let currentIndex = 0;
let isTransitioning = false;

const plate = document.getElementById("plate");
const photo = document.getElementById("photo");
const locationText = document.getElementById("location");
const sourceLink = document.getElementById("source-link");
const counter = document.getElementById("counter");
const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const metaToggle = document.getElementById("meta-toggle");
const metaPanel = document.getElementById("meta-panel");

function updateMeta(item) {
  counter.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(plates.length).padStart(2, "0")}`;
  sourceLink.href = item.source;
}

function renderPlate(index) {
  const item = plates[index];
  photo.src = item.file;
  photo.alt = item.location;
  locationText.textContent = item.location;
  updateMeta(item);
}

function goToIndex(nextIndex) {
  if (isTransitioning) {
    return;
  }

  isTransitioning = true;
  plate.classList.add("is-transitioning");

  window.setTimeout(() => {
    currentIndex = (nextIndex + plates.length) % plates.length;
    renderPlate(currentIndex);
    plate.classList.remove("is-transitioning");

    window.setTimeout(() => {
      isTransitioning = false;
    }, 220);
  }, 170);
}

function showPrevious() {
  goToIndex(currentIndex - 1);
}

function showNext() {
  goToIndex(currentIndex + 1);
}

previousButton.addEventListener("click", showPrevious);
nextButton.addEventListener("click", showNext);

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    showPrevious();
  }

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();
    showNext();
  }
});

metaToggle.addEventListener("click", () => {
  const expanded = metaToggle.getAttribute("aria-expanded") === "true";
  metaToggle.setAttribute("aria-expanded", String(!expanded));
  metaPanel.hidden = expanded;
});

renderPlate(currentIndex);
