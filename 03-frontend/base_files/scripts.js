//tâche 1
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    fetchPlaces();
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const success = await loginUser(email, password);

                if (success) {
                    window.location.href = './index.html';
                } else {
                    alert('Login failed. Please check your credentials and try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
            }
        });
    }
});

async function loginUser(email, password) {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = './index.html'; //redirige vers la page index.html
        console.log('Cookie set:', document.cookie);//affiche le cookie (c'est bon les cookies)
    } else {
        alert('Login failed: ' + response.statusText);
    }
}

//tâche 2
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');
   

    if (loginLink) {
        if (!token) {
            loginLink.style.display = 'block';

        } else {
            loginLink.style.display = 'none';
            // Fetch places data if the user is authenticated
            fetchPlaces(token);
          // Store the token for later use
          fetchPlaceDetails(token, placeId);
        }
        return token;
    } else {
        console.error('Login link not found');
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

async function fetchPlaces() {
    try {
        const response = await fetch('http://127.0.0.1:5000/places');
        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = ''; // Clear the current content of the places list

    places.forEach(place => {
        const placeDiv = document.createElement('div');
        placeDiv.className = 'place-card';
        placeDiv.setAttribute('data-country', place.country_name);

        placeDiv.innerHTML = `
            <h3>${place.description}</h3>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
            <p><strong>Max guests:</strong> ${place.max_guests}</p>
            <button class="details-button" data-id="${place.id}">View Detail</button>
        `;

        placesList.appendChild(placeDiv);
    });
}

document.getElementById('country-filter').addEventListener('change', (event) => {
    const selectedCountry = event.target.value.toLowerCase();
    const places = document.querySelectorAll('.place-card');

    places.forEach(place => {
        const placeCountry = place.getAttribute('data-country').toLowerCase();
        if (selectedCountry === '' || placeCountry === selectedCountry) {
            place.style.display = 'block';
        } else {
            place.style.display = 'none';
        }
    });
});

