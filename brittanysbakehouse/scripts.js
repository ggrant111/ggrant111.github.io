document.addEventListener("DOMContentLoaded", function() {
    const images = document.querySelectorAll('.carousel img');
    let currentIndex = 0;

    function showCurrentImage() {
        images.forEach((img, index) => {
            img.style.display = 'none'; // Hide all images
        });
        images[currentIndex].style.display = 'block'; // Show current image
    }

    document.querySelector('.next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % images.length; // Move to the next image
        showCurrentImage();
    });

    document.querySelector('.prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + images.length) % images.length; // Move to the previous image
        showCurrentImage();
    });

    showCurrentImage(); // Initialize carousel display
});

function toggleMenu() {
    var navbar = document.getElementById('navbar');
    if (navbar.style.display === 'flex') {
        navbar.style.display = 'none';
    } else {
        navbar.style.display = 'flex';
    }
}
