import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

const initialProfile = {
    firstName: '',
    lastName: '',
    phone: ''
};

export const UserProvider = ({ children }) => {
    // Pokusíme se načíst profil z localStorage, nebo použijeme prázdný
    const [profile, setProfile] = useState(() => {
        const savedProfile = localStorage.getItem('userProfile');
        return savedProfile ? JSON.parse(savedProfile) : initialProfile;
    });

    // Vždy, když se profil změní, uložíme ho do localStorage
    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, [profile]);

    return (
        <UserContext.Provider value={{ profile, setProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);