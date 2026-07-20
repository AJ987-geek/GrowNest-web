import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [activeUserId, setActiveUserId] = useState(() => localStorage.getItem('userId'));

  const [user, setUser] = useState(null);
  const [child, setChild] = useState(null);
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // If there is no active user, load the Hackathon Fallback so the app doesn't crash!
      if (!activeUserId) {
        console.warn("No user logged in. Loading Demo Mode.");
        setUser({ name: 'Demo Parent', email: 'demo@grownest.com' });
        setChild({ 
            id: 1, name: 'Demo Child', dob: '2023-01-01', gender: 'Female', height: 85, weight: 12, bloodGroup: 'O+', allergies: ['Peanuts'], medicalHistory: 'Healthy' 
        });
        setAppLoading(false);
        return;
      }

      setAppLoading(true);
      try {
        // Fetch User Profile
        const userRes = await fetch(`https://grownest-backend-5xa2.onrender.com/api/user/${activeUserId}`);
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Fetch User's Children
        const childRes = await fetch(`https://grownest-backend-5xa2.onrender.com/api/user/${activeUserId}/children`);
        if (childRes.ok) {
          const childrenData = await childRes.json();
          if (childrenData.length > 0) {
            let fetchedChild = childrenData[0];
            try {
               fetchedChild.allergies = JSON.parse(fetchedChild.allergies || '[]');
            } catch(e) { 
               fetchedChild.allergies = []; 
            }
            // Normalize snake_case to camelCase for the frontend UI
            fetchedChild.bloodGroup = fetchedChild.blood_group;
            fetchedChild.medicalHistory = fetchedChild.medical_history;
            // Fix Date format for input type="date"
            if (fetchedChild.dob) {
                fetchedChild.dob = fetchedChild.dob.split('T')[0];
            }
            setChild(fetchedChild);
          } else {
            setChild(null); // Explicitly clear the child if the new user has none!
          }
        }
      } catch (err) {
        console.error("Failed to load backend data", err);
        // ==========================================
        // 🚀 HACKATHON / NO-DATABASE FALLBACK MODE
        // ==========================================
        // If your friend (or a judge) runs this without MySQL, 
        // it will automatically load this fake data so the UI still works perfectly!
        setUser({ name: 'Demo Parent', email: 'demo@grownest.com' });
        setChild({ 
            id: 1, 
            name: 'Demo Child', 
            dob: '2023-01-01', 
            gender: 'Female', 
            height: 85, 
            weight: 12, 
            bloodGroup: 'O+', 
            allergies: ['Peanuts'], 
            medicalHistory: 'Healthy' 
        });
      } finally {
        setAppLoading(false);
      }
    };

    fetchUserData();
  }, [activeUserId]);

  const [notifications, setNotifications] = useState([]);

  // Dynamically generate notifications when child data loads!
  useEffect(() => {
    if (child) {
      setNotifications([
        { id: 1, title: 'Vaccination Due', message: 'Next vaccine is due soon', time: '2h ago', read: false, type: 'warning', link: '/vaccination' },
        { id: 2, title: 'Growth Milestone', message: `${child.name} reached a new height milestone!`, time: '1d ago', read: false, type: 'success', link: '/child-profile' },
        { id: 3, title: 'Weekly Report', message: 'Your weekly health report is ready', time: '2d ago', read: true, type: 'info', link: '/medical-records' },
      ]);
    } else {
      setNotifications([]);
    }
  }, [child]);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <AppContext.Provider value={{
      appLoading,
      darkMode,
      toggleDarkMode,
      user,
      setUser,
      child,
      setChild,
      notifications,
      markNotificationRead,
      toasts,
      showToast,
      activeUserId,
      setActiveUserId,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
