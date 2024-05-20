document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('milestoneForm');
    const formContainer = document.getElementById('milestoneFormContainer');
    const timeline = document.getElementById('timeline');
    const modal = document.getElementById('modal');
    const closeModalButton = document.querySelector('.close');
    const editButton = document.getElementById('editButton');
    const editForm = document.getElementById('editForm');
    const navAddMilestone = document.getElementById('navAddMilestone');
    const navSlideshow = document.getElementById('navSlideshow');
    let map;
    let markers = [];
    let currentEditIndex = null;
    let slideshowInterval = null;

    form.addEventListener('submit', addMilestone);
    editForm.addEventListener('submit', updateMilestone);
    closeModalButton.addEventListener('click', closeModal);
    window.addEventListener('click', outsideClick);
    editButton.addEventListener('click', () => {
        editForm.style.display = 'flex';
    });
    navAddMilestone.addEventListener('click', () => {
        formContainer.classList.toggle('show');
    });
    navSlideshow.addEventListener('click', startSlideshow);

    async function initMap() {
        // The default location
        const position = { lat: 0, lng: 0 };
        // Request needed libraries.
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        const { Marker } = await google.maps.importLibrary("marker");

        // The map, centered at the default location
        map = new Map(document.getElementById("map"), {
            zoom: 2,
            center: position,
            mapId: "YOUR_MAP_ID" // Replace with your valid Map ID
        });

        renderMilestones();
    }

    function addMilestone(e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const date = document.getElementById('date').value;
        const location = document.getElementById('location').value;
        const mediaFiles = document.getElementById('media').files;

        const milestone = {
            title,
            description,
            date,
            location,
            media: []
        };

        if (mediaFiles.length > 0) {
            const readerPromises = Array.from(mediaFiles).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = event => resolve({ src: event.target.result, type: file.type });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readerPromises).then(media => {
                milestone.media = media;
                saveMilestone(milestone);
                renderMilestones();
                form.reset();
            });
        } else {
            saveMilestone(milestone);
            renderMilestones();
            form.reset();
        }
    }

    function saveMilestone(milestone) {
        let milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        milestones.push(milestone);
        milestones.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        localStorage.setItem('milestones', JSON.stringify(milestones));
    }

    function renderMilestones() {
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        timeline.innerHTML = '';
        clearMarkers();
        milestones.forEach((milestone, index) => {
            const milestoneElement = document.createElement('div');
            milestoneElement.classList.add('milestone');

            const titleElement = document.createElement('h2');
            titleElement.innerText = milestone.title;

            if (milestone.media && milestone.media.length > 0) {
                const thumbnailElement = document.createElement('img');
                thumbnailElement.src = milestone.media[0].src;
                milestoneElement.appendChild(thumbnailElement);
            }

            milestoneElement.appendChild(titleElement);

            const yearElement = document.createElement('div');
            yearElement.classList.add('year');
            yearElement.innerText = new Date(milestone.date).getFullYear();
            milestoneElement.appendChild(yearElement);

            milestoneElement.addEventListener('click', () => {
                openModal(milestone, index);
            });

            timeline.appendChild(milestoneElement);

            // Geocode the location and add a marker
            geocodeLocation(milestone, index);
        });
    }

    function openModal(milestone, index) {
        currentEditIndex = index;
        document.getElementById('modalTitle').innerText = milestone.title;
        document.getElementById('modalDescription').innerText = milestone.description;
        document.getElementById('modalDate').innerText = milestone.date;
        document.getElementById('modalLocation').innerText = milestone.location;

        document.getElementById('editTitle').value = milestone.title;
        document.getElementById('editDescription').value = milestone.description;
        document.getElementById('editDate').value = milestone.date;
        document.getElementById('editLocation').value = milestone.location;

        const modalMedia = document.getElementById('modalMedia');
        modalMedia.innerHTML = '';

        if (milestone.media && milestone.media.length > 0) {
            milestone.media.forEach(mediaItem => {
                let mediaElement;
                if (mediaItem.type.startsWith('image')) {
                    mediaElement = document.createElement('img');
                    mediaElement.src = mediaItem.src;
                } else if (mediaItem.type.startsWith('video')) {
                    mediaElement = document.createElement('video');
                    mediaElement.src = mediaItem.src;
                    mediaElement.controls = true;
                }
                modalMedia.appendChild(mediaElement);
            });
        }

        modal.style.display = 'block';
        editForm.style.display = 'none';
    }

    function closeModal() {
        modal.style.display = 'none';
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
    }

    function outsideClick(e) {
        if (e.target == modal) {
            closeModal();
        }
    }

    function updateMilestone(e) {
        e.preventDefault();

        const title = document.getElementById('editTitle').value;
        const description = document.getElementById('editDescription').value;
        const date = document.getElementById('editDate').value;
        const location = document.getElementById('editLocation').value;
        const mediaFiles = document.getElementById('editMedia').files;

        let milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        const milestone = milestones[currentEditIndex];

        milestone.title = title;
        milestone.description = description;
        milestone.date = date;
        milestone.location = location;

        if (mediaFiles.length > 0) {
            const readerPromises = Array.from(mediaFiles).map(file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = event => resolve({ src: event.target.result, type: file.type });
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readerPromises).then(media => {
                milestone.media = media;
                saveUpdatedMilestones(milestones);
            });
        } else {
            saveUpdatedMilestones(milestones);
        }
    }

    function saveUpdatedMilestones(milestones) {
        milestones.sort((a, b) => new Date(a.date) - new Date(b.date));
        localStorage.setItem('milestones', JSON.stringify(milestones));
        renderMilestones();
        closeModal();
    }

    function startSlideshow() {
        const milestones = JSON.parse(localStorage.getItem('milestones')) || [];
        let index = 0;

        function showNextMilestone() {
            if (index >= milestones.length) {
                index = 0; // Loop back to the first milestone
            }

            const milestone = milestones[index];
            openModal(milestone, index);
            index++;
        }

        showNextMilestone(); // Show the first milestone immediately

        slideshowInterval = setInterval(showNextMilestone, 5000); // Show next milestone every 5 seconds
    }

    async function geocodeLocation(milestone, index) {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: milestone.location }, async (results, status) => {
            if (status === 'OK') {
                const position = results[0].geometry.location;
                //@ts-ignore
                const { Marker } = await google.maps.importLibrary("marker");

                const marker = new Marker({
                    map: map,
                    position: position,
                    title: `Milestone ${index + 1}`
                });

                marker.addListener('click', () => {
                    showInfoWindow(milestone, marker);
                });

                markers.push(marker);

                // Adjust map bounds to include the new marker
                const bounds = new google.maps.LatLngBounds();
                markers.forEach(marker => bounds.extend(marker.getPosition()));
                map.fitBounds(bounds);
            } else {
                console.error(`Geocode was not successful for the following reason: ${status}`);
            }
        });
    }

    function showInfoWindow(milestone, marker) {
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h2>${milestone.title}</h2>
                    <p>${milestone.description}</p>
                    <p>Date: ${milestone.date}</p>
                    <p>Location: ${milestone.location}</p>
                    ${milestone.media && milestone.media.length > 0 ? `<img src="${milestone.media[0].src}" style="max-width: 100px; max-height: 100px;">` : ''}
                </div>
            `
        });
        infoWindow.open(map, marker);
    }

    function clearMarkers() {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    initMap();
});
