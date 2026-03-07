"use client";

import React, { createContext, useContext, useState } from "react";
import { CreationFlowState } from "@/types";

interface CreationFlowContextType {
    state: CreationFlowState;
    updateState: (updates: Partial<CreationFlowState>) => void;
    resetState: () => void;
}

const initialState: CreationFlowState = {
    style: "abstract_illustration", // Default fallback if skipped
};

const CreationFlowContext = createContext<CreationFlowContextType | undefined>(undefined);

export function CreationFlowProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CreationFlowState>(initialState);

    const updateState = (updates: Partial<CreationFlowState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const resetState = () => {
        setState(initialState);
    };

    return (
        <CreationFlowContext.Provider value={{ state, updateState, resetState }}>
            {children}
        </CreationFlowContext.Provider>
    );
}

export function useCreationFlow() {
    const context = useContext(CreationFlowContext);
    if (context === undefined) {
        throw new Error("useCreationFlow must be used within a CreationFlowProvider");
    }
    return context;
}
