
document.addEventListener("DOMContentLoaded", function () {

    const collections = [
        {
            name: "Minimal Henna Designs",
            key: "minimal",
            file: "minimal.html",
            folder: "minimal",
            prefix: "minimal",
            count: 8
        },
        {
            name: "Floral Henna Designs",
            key: "floral",
            file: "floral.html",
            folder: "floral",
            prefix: "floral",
            count: 7
        },
        {
            name: "Intricate Semi-Bridal",
            key: "semi-bridal",
            file: "semi-bridal.html",
            folder: "semi-bridal",
            prefix: "semi-bridal",
            count: 7
        },
        {
            name: "Bridal Henna Designs",
            key: "bridal",
            file: "bridal.html",
            folder: "bridal",
            prefix: "bridal",
            count: 12
        }
    ];

    const page = window.location.pathname.split("/").pop().toLowerCase();

    const current = collections.find(
        collection => collection.file === page
    );

    if (!current) {
        console.error("Collection page not found:", page);
        return;
    }

    const title = document.getElementById("collection-title");
    const description = document.getElementById("collection-description");
    const grid = document.getElementById("collection-grid");
    const otherCollections = document.getElementById("other-collections");

    if (!title || !description || !grid || !otherCollections) {
        console.error("One or more collection HTML elements are missing.");
        return;
    }

    title.textContent = current.name;

    // CREATE THE PHOTO GRID
    const galleryImages = [];

    for (let i = 1; i <= current.count; i++) {

        const number = String(i).padStart(2, "0");
        const image = document.createElement("img");

        image.src = `images/${current.folder}/${current.prefix}-${number}.jpg`;
        image.alt = `${current.name} ${i}`;
        image.loading = "lazy";
        image.tabIndex = 0;
        image.style.cursor = "pointer";

        image.addEventListener("click", function () {
            openLightbox(i - 1);
        });

        image.addEventListener("keydown", function (event) {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openLightbox(i - 1);
            }
        });

        image.addEventListener("error", function () {
            console.error("Image not found:", image.src);
        });

        grid.appendChild(image);
        galleryImages.push(image);
    }

    // OTHER COLLECTION LINKS
    collections.forEach(function (collection) {

        if (collection.key === current.key) return;

        const link = document.createElement("a");

        link.href = collection.file;
        link.className = "other-collection-link";
        link.textContent = collection.name + " →";

        otherCollections.appendChild(link);
    });

    // LIGHTBOX ELEMENTS
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.getElementById("lightbox-close");

    if (!lightbox || !lightboxImage || !closeButton) {
        console.error("Lightbox HTML elements are missing.");
        return;
    }

    // CREATE VIEWER CONTROLS
    const controls = document.createElement("div");
    controls.className = "lightbox-controls";

    controls.innerHTML = `
        <button type="button" class="lightbox-prev" aria-label="Previous image">❮</button>
        <span class="lightbox-counter" aria-live="polite"></span>
        <button type="button" class="lightbox-next" aria-label="Next image">❯</button>
        <button type="button" class="lightbox-zoom-out" aria-label="Zoom out">−</button>
        <button type="button" class="lightbox-zoom-in" aria-label="Zoom in">+</button>
    `;

    lightbox.appendChild(controls);

    const previousButton = controls.querySelector(".lightbox-prev");
    const nextButton = controls.querySelector(".lightbox-next");
    const zoomOutButton = controls.querySelector(".lightbox-zoom-out");
    const zoomInButton = controls.querySelector(".lightbox-zoom-in");
    const counter = controls.querySelector(".lightbox-counter");

    let currentIndex = 0;
    let zoomLevel = 1;
    let touchStartX = 0;
    let touchStartY = 0;

    // OPEN IMAGE
    function openLightbox(index) {

        currentIndex = index;
        zoomLevel = 1;

        showImage();

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    // DISPLAY CURRENT IMAGE
    function showImage() {

        const selectedImage = galleryImages[currentIndex];

        lightboxImage.src = selectedImage.src;
        lightboxImage.alt = selectedImage.alt;

        counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;

        zoomLevel = 1;
        updateZoom();

        previousButton.disabled = currentIndex === 0;
        nextButton.disabled = currentIndex === galleryImages.length - 1;
    }

    // NEXT IMAGE
    function nextImage() {

        if (currentIndex < galleryImages.length - 1) {
            currentIndex++;
            showImage();
        }
    }

    // PREVIOUS IMAGE
    function previousImage() {

        if (currentIndex > 0) {
            currentIndex--;
            showImage();
        }
    }

    // ZOOM
    function updateZoom() {
        lightboxImage.style.transform = `scale(${zoomLevel})`;
        lightboxImage.classList.toggle("zoomed", zoomLevel > 1);
    }

    function zoomIn() {
        zoomLevel = Math.min(zoomLevel + 0.25, 3);
        updateZoom();
    }

    function zoomOut() {
        zoomLevel = Math.max(zoomLevel - 0.25, 1);
        updateZoom();
    }

    // BUTTON EVENTS
    nextButton.addEventListener("click", nextImage);
    previousButton.addEventListener("click", previousImage);
    zoomInButton.addEventListener("click", zoomIn);
    zoomOutButton.addEventListener("click", zoomOut);

    // DOUBLE CLICK TO ZOOM
    lightboxImage.addEventListener("dblclick", function () {

        zoomLevel = zoomLevel === 1 ? 2 : 1;
        updateZoom();

    });

    // MOBILE SWIPE
    lightbox.addEventListener("touchstart", function (event) {

        if (event.touches.length !== 1) return;

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

    }, { passive: true });

    lightbox.addEventListener("touchend", function (event) {

        if (!touchStartX && !touchStartY) return;

        const endX = event.changedTouches[0].clientX;
        const endY = event.changedTouches[0].clientY;

        const differenceX = endX - touchStartX;
        const differenceY = endY - touchStartY;

        if (Math.abs(differenceX) > 55 &&
            Math.abs(differenceX) > Math.abs(differenceY)) {

            if (differenceX < 0) {
                nextImage();
            } else {
                previousImage();
            }
        }

        touchStartX = 0;
        touchStartY = 0;

    }, { passive: true });

    // CLOSE VIEWER
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        lightboxImage.src = "";
        lightboxImage.style.transform = "scale(1)";

        document.body.style.overflow = "";

        zoomLevel = 1;
    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    // KEYBOARD CONTROLS
    document.addEventListener("keydown", function (event) {

        if (!lightbox.classList.contains("active")) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "ArrowRight") {
            nextImage();
        }

        if (event.key === "ArrowLeft") {
            previousImage();
        }

        if (event.key === "+" || event.key === "=") {
            zoomIn();
        }

        if (event.key === "-") {
            zoomOut();
        }

    });

});
