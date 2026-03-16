"use client";

import React, { createContext, useContext, useState } from "react";
import { MusicFlowState } from "@/types";

export interface MusicGenerationResult {
    audioBase64: string | null;
    coverBase64: string | null;
    creationStory: string;
    musicPrompt: string;
    lyriaAvailable: boolean;
    lyriaError: string | null;
}

interface MusicFlowContextType {
    state: MusicFlowState;
    updateState: (updates: Partial<MusicFlowState>) => void;
    resetState: () => void;
    musicResult: MusicGenerationResult | null;
    setMusicResult: (result: MusicGenerationResult | null) => void;
}

const initialState: MusicFlowState = {
    soundEffects: [],
    hasRecordedAudio: false,
};

const MusicFlowContext = createContext<MusicFlowContextType | undefined>(undefined);

export function MusicFlowProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<MusicFlowState>(initialState);
    const [musicResult, setMusicResult] = useState<MusicGenerationResult | null>(null);

    const updateState = (updates: Partial<MusicFlowState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    };

    const resetState = () => {
        setState(initialState);
        setMusicResult(null);
    };

    return (
        <MusicFlowContext.Provider value={{ state, updateState, resetState, musicResult, setMusicResult }}>
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
