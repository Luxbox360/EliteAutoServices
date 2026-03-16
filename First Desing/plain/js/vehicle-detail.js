/**
 * Vehicle Detail Page JavaScript
 * Handles dynamic vehicle information loading and image gallery
 */

// Vehicle Database
const vehicleDatabase = {
    1: {
        title: '2019 Toyota RAV4',
        year: 2019,
        make: 'Toyota',
        model: 'RAV4',
        type: 'SUV',
        color: 'Blue Pearl',
        price: '$24,500',
        mileage: '45,000 miles',
        images: {
            main: 'assets/images/2019-toyota-rav4-blue-suv.jpg',
            thumb1: 'assets/images/2019-toyota-rav4-blue-suv.jpg',
            thumb2: 'assets/images/2019-toyota-rav4-blue-suv-front.jpg',
            thumb3: 'assets/images/2019-toyota-rav4-blue-suv-side.jpg',
            thumb4: 'assets/images/2019-toyota-rav4-blue-suv-interior.jpg',
            thumb5: 'assets/images/2019-toyota-rav4-blue-suv-cargo.jpg'
        }
    },
    2: {
        title: '2020 Honda Accord',
        year: 2020,
        make: 'Honda',
        model: 'Accord',
        type: 'Sedan',
        color: 'Silver',
        price: '$22,800',
        mileage: '32,000 miles',
        images: {
            main: 'assets/images/2020-honda-accord-silver-sedan.jpg',
            thumb1: 'assets/images/2020-honda-accord-silver-sedan.jpg',
            thumb2: 'assets/images/2020-honda-accord-silver-sedan-front.jpg',
            thumb3: 'assets/images/2020-honda-accord-silver-sedan-side.jpg',
            thumb4: 'assets/images/2020-honda-accord-silver-sedan-interior.jpg',
            thumb5: 'assets/images/2020-honda-accord-silver-sedan-back.jpg'
        }
    },
    3: {
        title: '2021 Ford F-150',
        year: 2021,
        make: 'Ford',
        model: 'F-150',
        type: 'Pickup Truck',
        color: 'Black',
        price: '$32,900',
        mileage: '28,500 miles',
        images: {
            main: 'assets/images/2021-ford-f-150-black-pickup-truck.jpg',
            thumb1: 'assets/images/2021-ford-f-150-black-pickup-truck.jpg',
            thumb2: 'assets/images/2021-ford-f-150-black-pickup-front.jpg',
            thumb3: 'assets/images/2021-ford-f-150-black-pickup-bed.jpg',
            thumb4: 'assets/images/2021-ford-f-150-black-pickup-interior.jpg',
            thumb5: 'assets/images/placeholder.jpg'
        }
    }
};

/**
 * Get vehicle ID from URL query parameter
 */
function getVehicleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 1;
}

/**
 * Load vehicle data and populate the page
 */
function loadVehicleData() {
    const vehicleId = getVehicleId();
    const vehicle = vehicleDatabase[vehicleId];

    if (!vehicle) {
        console.error('Vehicle not found');
        loadVehicleData = vehicleDatabase[1]; // Default to first vehicle
    }

    // Update page title
    document.title = `${vehicle.title} - Elite Auto Services`;

    // Update breadcrumb
    document.getElementById('breadcrumb-title').textContent = vehicle.title;

    // Update main heading
    document.getElementById('vehicleTitle').textContent = vehicle.title;

    // Update price
    document.getElementById('vehiclePrice').textContent = vehicle.price;

    // Update quick facts
    document.getElementById('vehicleYear').textContent = vehicle.year;
    document.getElementById('vehicleType').textContent = vehicle.type;
    document.getElementById('vehicleColor').textContent = vehicle.color;
    document.getElementById('vehicleMileage').textContent = vehicle.mileage;

    // Update specifications
    document.getElementById('specMakeModel').textContent = `${vehicle.make} ${vehicle.model}`;
    document.getElementById('specType').textContent = vehicle.type;
    document.getElementById('specColor').textContent = vehicle.color;
    document.getElementById('specMileage').textContent = vehicle.mileage;

    // Load images
    loadVehicleImages(vehicle);
}

/**
 * Load vehicle images into gallery
 */
function loadVehicleImages(vehicle) {
    // Set main image
    const mainImage = document.getElementById('mainImage');
    mainImage.src = vehicle.images.main;
    mainImage.alt = vehicle.title;

    // Set thumbnail images
    for (let i = 1; i <= 5; i++) {
        const thumbElement = document.getElementById(`thumb${i}`);
        const imageKey = `thumb${i}`;

        if (vehicle.images[imageKey]) {
            thumbElement.src = vehicle.images[imageKey];
            thumbElement.style.display = 'block';
        } else {
            thumbElement.style.display = 'none';
        }

        thumbElement.alt = `${vehicle.title} view ${i}`;
    }

    // Set first thumbnail as active
    updateThumbnailActive(document.getElementById('thumb1'));
}

/**
 * Change main image when thumbnail is clicked
 */
function changeMainImage(imageSrc) {
    const mainImage = document.getElementById('mainImage');
    mainImage.style.opacity = '0.7';
    mainImage.src = imageSrc;

    // Fade in effect
    setTimeout(() => {
        mainImage.style.opacity = '1';
    }, 200);

    // Update active thumbnail
    const clickedThumbnail = event.target;
    updateThumbnailActive(clickedThumbnail);
}

/**
 * Update active thumbnail styling
 */
function updateThumbnailActive(thumbnailElement) {
    // Remove active class from all thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });

    // Add active class to clicked thumbnail
    if (thumbnailElement) {
        thumbnailElement.classList.add('active');
    }
}

/**
 * Add smooth fade effect to main image
 */
function addImageTransition() {
    const mainImage = document.getElementById('mainImage');
    mainImage.style.transition = 'opacity 0.3s ease';
}

/**
 * Initialize page on DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading vehicle detail page...');

    // Add image transitions
    addImageTransition();

    // Load vehicle data
    loadVehicleData();

    // Setup thumbnail click handlers with proper delegation
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            changeMainImage(this.src);
        });
    });

    console.log('Vehicle detail page loaded successfully');
});

/**
 * Add keyboard navigation for image gallery
 */
document.addEventListener('keydown', function(e) {
    const thumbnails = Array.from(document.querySelectorAll('.thumbnail'));
    const activeThumbnail = document.querySelector('.thumbnail.active');

    if (!activeThumbnail) return;

    const activeIndex = thumbnails.indexOf(activeThumbnail);

    if (e.key === 'ArrowRight' && activeIndex < thumbnails.length - 1) {
        changeMainImage(thumbnails[activeIndex + 1].src);
        updateThumbnailActive(thumbnails[activeIndex + 1]);
    } else if (e.key === 'ArrowLeft' && activeIndex > 0) {
        changeMainImage(thumbnails[activeIndex - 1].src);
        updateThumbnailActive(thumbnails[activeIndex - 1]);
    }
});

/**
 * Log to console for debugging
 */
console.log(
    '%cVehicle Detail Page',
    'color: #000; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cUse arrow keys to navigate through vehicle images',
    'color: #666; font-size: 12px;'
);
