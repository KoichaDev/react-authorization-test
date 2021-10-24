import React, { useState, useEffect, useCallbacks } from 'react';

let logoutTimer; 

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => { },
    logout: () => { },
});

const calculateRemainingTime = (expirationTime) => {
    // This will give you current Timestamp in milliseconds
    const currentTime = new Date().getTime();
    // We need to convert it to an object and also get the timestamp in milliseconds
    const adjustedExpirationTime = new Date(expirationTime).getTime();

    const remainingTimeDuration = adjustedExpirationTime - currentTime;

    return remainingTimeDuration;
}


const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expirationTime')

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    // This is to make sure that it doesn't make sense for the user to log the user in
    if(remainingTime <= 60000) {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        return null;
    }

    return {
        token: storedToken,
        remainingTime: remainingTime
    };
}


export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialToken; 
    if(tokenData) {
        initialToken = tokenData.token
    }

    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;

    const logoutHandler = useCallbacks(() => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');


        if(logoutTimer) {
            clearTimeout(logoutTimer)
        }
    }, []);

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime)

        const remainingTime = calculateRemainingTime(expirationTime)
        logoutTimer = setTimeout(logoutHandler, remainingTime);
    };

    useEffect(() => {
        if(tokenData) {
            console.table(tokenData);
            logoutTimer = setTimeout(logoutHandler, tokenData.remainingTime);
        }
    }, [tokenData, logoutHandler]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContext;