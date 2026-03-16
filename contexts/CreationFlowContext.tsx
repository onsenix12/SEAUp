"use client";

import React, { createContext, useContext, useState } from "react";
import { CreationFlowState } from "@/types";

interface CreationFlowContextType {
    state: CreationFlowState;
    updateState: (updates: Partial<CreationFlowState>) => void;
    resetState: () => void;
    validateState: () => boolean;
}

const initialState: CreationFlowState = {
    nickname: "",
    style: "abstract_illustration", // Default fallback if skipped
    has_drawn: false,
    photo_taken: false,
    stickers_used: 0,
    journey: undefined,
};

const CreationFlowContext = createContext<CreationFlowContextType | undefined>(undefined);

export function CreationFlowProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CreationFlowState>(initialState);



    const updateState = (updates: Partial<CreationFlowState>) => {
        setState((prev) => {
            const newState = { ...prev, ...updates };
            return newState;
        });
    };

    const validateState = () => {
        const requiredFields: (keyof CreationFlowState)[] = ['mood', 'colour_palette', 'subject'];
        return requiredFields.every(field => !!state[field]);
    };

    const resetState = () => {
        setState(initialState);
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('generated_creation_story');
            sessionStorage.removeItem('generated_artwork_url');
        }
    };

    return (
        <CreationFlowContext.Provider value={{ state, updateState, resetState, validateState }}>
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
