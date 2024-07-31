document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const success = await loginUser(email, password);

                if (success) {
                    window.location.href = '/base_files/index.html';
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
    const response = await fetch('http://127.0.0.1:5000/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });
    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        console.log('Cookie set:', document.cookie);
        window.location.href = '/base_file/index.html';
    } else {
        alert('Login failed: ' + response.statusText);
    }
}