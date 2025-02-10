import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState({
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 123-4567",
    dateOfBirth: new Date(1995, 2, 15),
    address: "123 Healthcare Ave, Medical District",
    gender: "Female",
    height: "168",
    weight: "65",
    patientId: "SJ150395",
    bloodType: "O+",
    profileImage: null,
    allergies: "Penicillin, Peanuts",
    medications: "Levothyroxine 50mcg daily",
    emergencyContact: "John Johnson (Spouse)",
    emergencyPhone: "+1 (555) 987-6543"
  });

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  const value = {
    userData,
    updateUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 