import React, { createContext, useContext, useState, useCallback } from "react";

const RenderedContext = createContext();

export const useRendered = () => {
    return useContext(RenderedContext);
};

export const RenderedProvider = ({ children }) => {
    const [isHomeRendered, setIsHomeRendered] = useState(false);
    const [isHistoryRendered, setIsHistoryRendered] = useState(false);
    const [isProfileRendered, setIsProfileRendered] = useState(false);

    const renderHome = useCallback(() => {
        setIsHomeRendered(true);
    }, []);

    const renderHistory = useCallback(() => {
        setIsHistoryRendered(true);
    }, []);

    const renderProfile = useCallback(() => {
        setIsProfileRendered(true);
    }, []);

    return (
        <RenderedContext.Provider
            value={{
                isHomeRendered,
                renderHome,
                isHistoryRendered,
                renderHistory,
                isProfileRendered,
                renderProfile,
            }}
        >
            {children}
        </RenderedContext.Provider>
    );
};
