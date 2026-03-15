"use client";

import React, { createContext, useContext, useState } from "react";
import { MusicFlowState } from "@/types";

interface MusicFlowContextType {
    state: MusicFlowState;
    updateState: (updates: Partial<MusicFlowState>) => void;
    resetState: () => void;
}

const initialState: MusicFlowState = {
    soundEffects: [],
    hasRecordedAudio: false,
};

const MusicFlowContext = createContext<MusicFlowContextType | undefined>(undefined);

export function MusicFlowProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<MusicFlowState>(initialState);

    const updateState = (updates: Partial<MusicFlowState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const resetState = () => {
        setState(initialState);
    };

    return (
        <MusicFlowContext.Provider value={{ state, updateState, resetState }}>
            {children}
        </MusicFlowContext.Provider>
    );
}

export function useMusicFlow() {
    const context = useContext(MusicFlowContext);
    if (context === undefined) {
        throw new Error("useMusicFlow must be used within a MusicFlowProvider");
    }
    return context;
}
