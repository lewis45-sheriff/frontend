import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Import AuthContext for authentication management

const HomePage = () => {
    const { authTokens, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null); // Profile data
    const [courses, setCourses] = useState([]); // Courses data
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        getProfile(); // Fetch user profile
        getCourses(); // Fetch course data
    }, []); // Empty dependency array ensures this effect runs only once

    // Fetch user profile
    const getProfile = async () => {
        try {
            let response = await fetch('http://127.0.0.1:8000/api/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
            });

            let data = await response.json();
            if (response.status === 200) {
                setProfile(data);
            } else if (response.statusText === 'Unauthorized') {
                logoutUser();
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        }
    };

    // Fetch courses from the backend
    const getCourses = async () => {
        setLoading(true); // Set loading to true before fetching data
        try {
            let response = await fetch('http://127.0.0.1:8000/api/courses/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + String(authTokens.access),
                },
            });

            let data = await response.json();
            if (response.status === 200) {
                setCourses(data); // Set course data
            } else {
                setError('Failed to load courses.');
            }
        } catch (error) {
            console.error("Error fetching courses:", error);
            setError('Network error. Please try again later.'); // Handle network error
        } finally {
            setLoading(false); // Set loading to false after the fetch
        }
    };

    return (
        <div>
            <h2>Your courses</h2>

            {/* Display user's profile information */}
            {profile ? (
                <>
                    <h3>Welcome, {profile.user.first_name} {profile.user.last_name}</h3>
                    <p>Email: {profile.user.email}</p>
                    <p>Bio: {profile.bio}</p>
                    <p>Location: {profile.location}</p>
                    <p>Birth Date: {profile.birth_date}</p>
                    {profile.avatar && <img src={profile.avatar} alt="Profile Avatar" width="150" />}
                </>
            ) : (
                <p>No profile data found.</p>
            )}

            {/* Loading and error handling for courses */}
            {loading ? (
                <p>Loading courses...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <>
                    <h3>Available Courses:</h3>
                    {courses.length > 0 ? (
                        <ul>
                            {courses.map((course) => (
                                <li key={course.id}>
                                    <h4>{course.title}</h4>
                                    <p>{course.description}</p>
                                    <p>Instructor: {course.instructor}</p>
                                    <p>Duration: {course.duration} hours</p>
                                    <p>Price: ${course.price}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No courses available at the moment.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default HomePage;
