import { createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';

export interface SettingsState {
    [key: string]: any;
}

export const initialState: SettingsState = {};

export const settingsReducer = createReducer(
    initialState,
    on(SettingsActions.updateSetting, (state, { name, value }) => ({
        ...state,
        [name]: value,
    })),
);
