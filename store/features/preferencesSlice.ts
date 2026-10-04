import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
    /** ISO 3166-1 country code used for watch-provider availability. */
    region: string;
    /** Provider IDs the user subscribes to ("my services"). */
    myProviders: number[];
    /** True once preferences have been loaded from storage. */
    hydrated: boolean;
}

export const DEFAULT_REGION = 'US';

const initialState: PreferencesState = {
    region: DEFAULT_REGION,
    myProviders: [],
    hydrated: false,
};

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        hydratePreferences: (state, action: PayloadAction<Partial<Pick<PreferencesState, 'region' | 'myProviders'>>>) => {
            if (action.payload.region) state.region = action.payload.region;
            if (action.payload.myProviders) state.myProviders = action.payload.myProviders;
            state.hydrated = true;
        },
        setRegion: (state, action: PayloadAction<string>) => {
            state.region = action.payload;
        },
        toggleMyProvider: (state, action: PayloadAction<number>) => {
            const id = action.payload;
            state.myProviders = state.myProviders.includes(id)
                ? state.myProviders.filter((p) => p !== id)
                : [...state.myProviders, id];
        },
        setMyProviders: (state, action: PayloadAction<number[]>) => {
            state.myProviders = action.payload;
        },
    },
});

export const { hydratePreferences, setRegion, toggleMyProvider, setMyProviders } = preferencesSlice.actions;

export default preferencesSlice.reducer;
