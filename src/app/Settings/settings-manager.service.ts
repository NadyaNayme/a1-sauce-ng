import { Injectable } from '@angular/core';
import { DropdownOption } from './components'; // Adjust the import as needed
import * as Library from './Library/index'; // Adjust the import as needed

export const SettingsType = {
    Alarm: 'alarm',
    Button: 'button',
    Checkbox: 'checkbox',
    Dropdown: 'dropdown',
    Input: 'input',
    Number: 'number',
    Profile: 'profile',
    Range: 'range',
} as const;

@Injectable({
    providedIn: 'root',
})
export class SettingsManager {
    private static instance: SettingsManager;
    private name: string = '';
    public majorVersion: number = 0;
    public minorVersion: number = 0;
    public patchVersion: number = 0;
    private settings: HTMLElement[] = [];

    constructor() {
        if (!SettingsManager.instance) {
            SettingsManager.instance = this;
        }
        return SettingsManager.instance;
    }

    public setName(name: string): SettingsManager {
        this.name = name;
        return this;
    }

    public getName(): string {
        return this.name;
    }

    public addAlarmSetting(
        name: string,
        description: string,
        options?: any,
    ): SettingsManager {
        this.settings.push(
            Library.createAlarmSetting(name, description, options),
        );
        return this;
    }

    public addButton(
        name: string,
        content: string,
        fn: Function,
        options: { classes: Array<string> },
    ): SettingsManager {
        this.settings.push(Library.createButton(name, content, fn, options));
        return this;
    }

    public addCheckboxSetting(
        name: string,
        description: string,
        defaultValue: boolean,
        callback?: (value: boolean) => unknown,
    ): SettingsManager {
        this.settings.push(
            Library.createCheckboxSetting(
                name,
                description,
                defaultValue,
                callback,
            ),
        );
        return this;
    }

    public addDropdownSetting(
        name: string,
        description: string,
        defaultValue: number,
        options: DropdownOption[],
    ): SettingsManager {
        this.settings.push(
            Library.createDropdownSetting(
                name,
                description,
                defaultValue,
                options,
            ),
        );
        return this;
    }

    public addHeader(size: string, content: string): SettingsManager {
        this.settings.push(Library.createHeading(size, content));
        return this;
    }

    public addText(content: string): SettingsManager {
        this.settings.push(Library.createText(content));
        return this;
    }

    public addSmallText(content: string): SettingsManager {
        this.settings.push(Library.createSmallText(content));
        return this;
    }

    public addSeperator(): SettingsManager {
        this.settings.push(Library.createSeperator());
        return this;
    }

    public addTextSetting(
        name: string,
        description: string,
        defaultValue: string,
    ): SettingsManager {
        this.settings.push(
            Library.createTextSetting(name, description, defaultValue),
        );
        return this;
    }

    public addFileSetting(
        name: string,
        description: string,
        defaultValue: string,
    ): SettingsManager {
        this.settings.push(
            Library.createFileSetting(name, description, defaultValue),
        );
        return this;
    }

    public addNumberSetting(
        name: string,
        description: string,
        options: { defaultValue?: number; min?: number; max?: number } = {},
    ): SettingsManager {
        this.settings.push(
            Library.createNumberSetting(name, description, options),
        );
        return this;
    }

    public addRangeSetting(
        name: string,
        description: string,
        options: {
            classes?: Array<string>;
            defaultValue?: string;
            min?: number;
            max?: number;
        } = {},
        callback?: (value: number) => unknown,
    ): SettingsManager {
        this.settings.push(
            Library.createRangeSetting(name, description, options, callback),
        );
        return this;
    }

    public getSettings(): HTMLElement[] | null {
        return this.settings;
    }

    public build(): void {
        const settings = this.getSettings();
        if (settings === null) {
            throw new Error(
                'Settings are empty - add settings before calling build()',
            );
        }
        const container = document.createElement('div');
        container.id = 'Settings';
        for (let i = 0; i < settings.length; i++) {
            container.append(settings[i]);
        }
        document.body.append(container);
    }
}
