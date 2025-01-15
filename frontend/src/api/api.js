const API_URL = 'http://localhost:5000/api';

export const fetchUserProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/user`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
};

export const fetchMovieRecommendations = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/auth/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            genres: ["28", "35"], // Example genres: Action, Comedy
            language: "en-US",
        }),
    });
    if (!response.ok) throw new Error('Failed to fetch movie recommendations');
    return await response.json();
};

export const fetchCategories = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/movies/categories`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return await response.json();
};