import React, { createContext, useContext, useReducer } from "react";

// Membuat context untuk global state
const GlobalContext = createContext();

// Action type untuk reducer
const SET_USER_DATA = "SET_USER_DATA";

// Reducer function untuk mengubah nilai global state
const globalReducer = (state, action) => {
    switch (action.type) {
        case SET_USER_DATA:
            return { ...state, globalUserData: action.payload };
        default:
            return state;
    }
};

// Custom hook untuk menggunakan global state di komponen lain
export const useGlobalState = () => {
    return useContext(GlobalContext);
};

// Provider component untuk membungkus aplikasi
export const GlobalProvider = ({ children }) => {
    // State awal
    const initialState = {
        globalUserData: null,
    };

    // Menggunakan useReducer dengan reducer dan initialState
    const [state, dispatch] = useReducer(globalReducer, initialState);

    // Function untuk mengubah nilai globalUserData
    const setGlobalUserData = (userData) => {
        dispatch({ type: SET_USER_DATA, payload: userData });
    };

    return (
        <GlobalContext.Provider
            value={{
                globalUserData: state.globalUserData, // Global state
                setGlobalUserData, // Function untuk mengubah nilai
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};
