// Function to fetch an image from the Unsplash API
function fetchImage() {
    const accessKey = 'RMeNAfcp8YMlqf-P3OUnjE9CsuEsNc0kP4BshT3CmEU'; // Replace with your Unsplash access key
    const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}`;

    // Make a GET request to the Unsplash API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const imageUrl = data.urls.regular;

            // Display the image in the popup HTML
            const imageElement = document.getElementById('image');
            imageElement.src = imageUrl;
        })
        .catch(error => {
            console.error('Error fetching image:', error);
        });
}

// Call the fetchImage function when the popup is opened
fetchImage();
