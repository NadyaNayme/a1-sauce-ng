import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SettingsState } from './settings.reducer';

export const selectSettings = createFeatureSelector<SettingsState>('settings');

export const selectSetting = (name: string) =>
    createSelector(selectSettings, (settings) => settings[name]);
