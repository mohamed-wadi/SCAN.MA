import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        name: 'Mohammed Amine',
        email: 'user@example.com',
        phone: '+212 600 000 000',
        avatar: 'https://ui-avatars.com/api/?name=User+Scan&background=34C759&color=fff',
        joinDate: '2024',
        scanCount: 0
    });

    const updateUser = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    const incrementScanCount = () => {
        setUser(prev => ({ ...prev, scanCount: prev.scanCount + 1 }));
    };

    return (
        <UserContext.Provider value={{ user, updateUser, incrementScanCount }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
