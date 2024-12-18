import React, { useEffect, useState } from 'react';

const Profile = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // Fetch user data using the JWT token from localStorage
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => response.json())
                .then(data => setUserData(data))
                .catch(err => console.error('Error fetching user data:', err));
        }
    }, []);

    return (
        <div>
            <h1>Profile Page</h1>
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default Profile;
