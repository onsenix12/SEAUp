"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// The data we want to carry across a creation flow while a facilitator is active.
interface FacilitatorSessionData {
    facilitatorId: string | null;  // Supabase Auth UID
    creatorName: string;           // Inserted pre-session
    organisation: string;          // Inserted pre-session
    sessionStartTime: number;      // To calculate duration_minutes at the end
    isActive: boolean;             // True if they clicked "Start Session"
}

interface FacilitatorContextType {
    sessionData: FacilitatorSessionData;
    startSession: (facilitatorId: string, creatorName: string, org: string) => void;
    endSession: () => void;
}

const defaultState: FacilitatorSessionData = {
    facilitatorId: null,
    creatorName: '',
    organisation: '',
    sessionStartTime: 0,
    isActive: false,
};

const FacilitatorContext = createContext<FacilitatorContextType | undefined>(undefined);

export function FacilitatorProvider({ children }: { children: ReactNode }) {
    const [sessionData, setSessionData] = useState<FacilitatorSessionData>(defaultState);

    const startSession = (facilitatorId: string, creatorName: string, org: string) => {
        setSessionData({
            facilitatorId,
            creatorName,
            organisation: org,
            sessionStartTime: Date.now(),
            isActive: true,
        });
    };

    const endSession = () => {
        setSessionData(defaultState);
    };

    return (
        <FacilitatorContext.Provider value={{ sessionData, startSession, endSession }}>
            {children}
        </FacilitatorContext.Provider>
    );
}

export function useFacilitator() {
    const context = useContext(FacilitatorContext);
    if (context === undefined) {
        throw new Error('useFacilitator must be used within a FacilitatorProvider');
    }
    return context;
}
