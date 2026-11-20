
document.addEventListener("DOMContentLoaded", function () {

    const collections = [
        {
            key: "semi-bridal",
            id: "semi-bridal-gallery",
            folder: "semi-bridal",
            prefix: "semi-bridal",
            count: 7
        },
        {
            key: "minimal",
            id: "minimal-gallery",
            folder: "minimal",
            prefix: "minimal",
            count: 8
        },
        {
            key: "floral",
            id: "floral-gallery",
            folder: "floral",
            prefix: "floral",
            count: 7
        },
        {
            key: "bridal",
            id: "bridal-gallery",
            folder: "bridal",
            prefix: "bridal",
            count: 12
        }
    ];

    const categoryMenu = document.getElementById("category-menu");
    const galleryView = document.getElementById("gallery-view");
    const backButton = document.getElementById("back-to-categories");

    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const closeButton = document.getElementById("lightbox-close");

    // Create all gallery photographs
    collections.forEach(function (collection) {

        const section = document.getElementById(collection.id);
        const photoGrid = section.querySelector(".photo-grid");

        for (let i = 1; i <= collection.count; i++) {

            const number = String(i).padStart(2, "0");
            const image = document.createElement("img");

            image.src = `images/${collection.folder}/${collection.prefix}-${number}.jpg`;
            image.alt = `${collection.key} henna design ${i}`;
            image.loading = "lazy";

            image.addEventListener("click", function () {
                lightboxImage.src = image.src;
                lightboxImage.alt = image.alt;

                lightbox.classList.add("active");
                lightbox.setAttribute("aria-hidden", "false");
                document.body.style.overflow = "hidden";
            });

            image.addEventListener("error", function () {
                image.remove();
            });

            photoGrid.appendChild(image);
        }
    });

    // Open the selected category
    document.querySelectorAll(".category-card").forEach(function (card) {

        card.addEventListener("click", function () {

            const selectedCategory = card.dataset.category;

            categoryMenu.hidden = true;
            galleryView.hidden = false;

            collections.forEach(function (collection) {

                const section = document.getElementById(collection.id);

                section.hidden = collection.key !== selectedCategory;

            });

            window.scrollTo({
                top: galleryView.offsetTop - 80,
                behavior: "smooth"
            });

        });

    });

    // Return to the four categories
    backButton.addEventListener("click", function () {

        galleryView.hidden = true;
        categoryMenu.hidden = false;

        window.scrollTo({
            top: categoryMenu.offsetTop - 80,
            behavior: "smooth"
        });

    });

    // Close enlarged photograph
    function closeLightbox() {

        lightbox.classList.remove("active");
        lightbox.setAttribute("aria-hidden", "true");

        lightboxImage.src = "";
        document.body.style.overflow = "";

    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", function (event) {

        if (event.target === lightbox) {
            closeLightbox();
        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeLightbox();
        }

    });

});
