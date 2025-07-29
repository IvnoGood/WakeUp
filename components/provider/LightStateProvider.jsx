import { createContext, useContext, useState } from 'react';

const StateContext = createContext(null);

function LightStateProvider({ children }) {
    const [state, setState] = useState(false);

    const value = { state, setState };

    return (
        <StateContext.Provider value={value}>
            {children}
        </StateContext.Provider>
    );
}

export const useLightState = () => {
    const context = useContext(StateContext);
    return context;
};

export default LightStateProvider;