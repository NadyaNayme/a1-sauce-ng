import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { updateSetting } from './settings.actions';
import { selectSetting } from './settings.selectors';
import { DropdownOption } from './settings.model';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private alarms: DropdownOption[] = [
        {
            name: 'alarm2',
            value: './Alarms/alarm2.wav',
        },
        {
            name: 'notification1',
            value: './Alarms/notification1.wav',
        },
        {
            name: 'notification2',
            value: './Alarms/notification2.wav',
        },
        {
            name: 'notification3',
            value: './Alarms/notification3.wav',
        },
        {
            name: 'bell',
            value: './Alarms/bell.wav',
        },
        {
            name: 'elevator',
            value: './Alarms/elevator.wav',
        },
        {
            name: 'nuclear',
            value: './Alarms/nuclear.wav',
        },
    ];

    private container!: HTMLElement;

    constructor(private store: Store) {}

    createContainer(): this {
		const settingsContainer = document.createElement('section');
        settingsContainer.id = 'Settings';
        this.container = settingsContainer;
        return this;
    }

    build(): HTMLElement {
		document.body.appendChild(this.container);
        return this.container;
    }

	addFlexContainer(classes?: string[]): this {
		this.container.appendChild(this.createFlexContainer(classes));
		return this;
	}

	addOutput(): this {
		this.container.appendChild(this.createOutput())
		return this;
	}

    getSetting(name: string): Observable<any> {
        return this.store.select(selectSetting(name));
    }

    updateSetting(name: string, value: any): void {
        this.store.dispatch(updateSetting({ name, value }));
    }

    private createFlexContainer(classes?: string[]): HTMLElement {
        const container = document.createElement('div');
        container.classList.add('flex', 'setting');
        if (classes && classes.length) {
            classes.forEach((cls) => container.classList.add(cls));
        }
        return container;
    }

    private createOutput(): HTMLOutputElement {
        return document.createElement('output');
    }

    private createLabel(name: string, description: string): HTMLLabelElement {
        const label = document.createElement('label');
        label.setAttribute('for', name);
        label.innerText = description;
        document.body.appendChild(label);
        return label;
    }

    private createInput(
        type: string,
        name: string,
        defaultValue: unknown,
    ): HTMLInputElement {
        const input = document.createElement('input');
        input.id = name;
        input.type = type;

        this.getSetting(name).subscribe((value) => {
            input.value = String(value ?? defaultValue);
        });

        input.addEventListener('change', () => {
            this.updateSetting(name, input.value);
        });

        document.body.appendChild(input);
        return input;
    }

    private createCheckboxInput(name: string, defaultValue: unknown): HTMLInputElement {
        const input = document.createElement('input');
        input.id = name;
        input.type = 'checkbox';

        this.getSetting(name).subscribe((value) => {
            input.checked = Boolean(value ?? defaultValue);
        });

        input.addEventListener('change', () => {
            this.updateSetting(name, input.checked);
        });

        document.body.appendChild(input);
        return input;
    }

    private createDropdown(
        name: string,
        defaultValue: string | number,
        options: { name: string; value: string }[],
    ): HTMLSelectElement {
        const select = document.createElement('select');
        select.id = name;

        options.forEach((optionData) => {
            const option = document.createElement('option');
            option.value = optionData.value;
            option.innerText = optionData.name;
            select.appendChild(option);
        });

        this.getSetting(name).subscribe((value) => {
            select.value = String(value ?? options[0].value);
        });

        select.addEventListener('change', () => {
            this.updateSetting(name, select.value);
        });

        document.body.appendChild(select);
        return select;
    }

    private createHeading(size: string, content: string): HTMLElement {
        const header = document.createElement(size);
        header.innerHTML = content;
        document.body.appendChild(header);
        return header;
    }

    private createText(content: string): HTMLElement {
        const text = document.createElement('p');
        text.innerHTML = content;
        document.body.appendChild(text);
        return text;
    }

    private createSmallText(content: string): HTMLElement {
        const text = document.createElement('small');
        text.innerHTML = content;
        document.body.appendChild(text);
        return text;
    }

    private createSeparator(): HTMLElement {
        const separator = document.createElement('hr');
        document.body.appendChild(separator);
        return separator;
    }

    private createRangeSetting(
        name: string,
        description: string,
        options: {
            classes?: Array<string>;
            defaultValue?: string;
            min?: number;
            max?: number;
            unit?: string;
        } = {},
        callback?: (value: number) => unknown,
    ): HTMLElement {
        const {
            classes = options.classes ?? '',
            defaultValue = options.defaultValue ?? '100',
            min = options.min ?? 0,
            max = options.max ?? 100,
            unit = options.unit ?? '%',
        } = options;

        const rangeInput = this.createInput('range', name, defaultValue);
        rangeInput.setAttribute('min', min.toString());
        rangeInput.setAttribute('max', max.toString());

        const value =
            ((parseInt(defaultValue, 10) - parseInt(rangeInput.min, 10)) /
                (parseInt(rangeInput.max, 10) - parseInt(rangeInput.min))) *
            100;

        rangeInput.style.background =
            'linear-gradient(to right, #3e5765 0%, #3e5765 ' +
            value +
            '%, #0d1c24 ' +
            value +
            '%, #0d1c24 100%)';

        this.getSetting(name).subscribe((value) => {
            rangeInput.value = String(value ?? defaultValue);
            updateRangeInputBackground(rangeInput);
            output.innerText = rangeInput.value + unit;
        });

        return container;
    }

    private createNumberSetting(
        name: string,
        description: string,
        options: {
            defaultValue?: number;
            min?: number;
            max?: number;
        } = {},
    ): HTMLElement {
        const {
            defaultValue = options.defaultValue ?? 10,
            min = options.min ?? 1,
            max = options.max ?? 20,
        } = options;

        const input = this.createInput('number', name, defaultValue);
        input.id = name;
        input.setAttribute('min', min.toString());
        input.setAttribute('max', max.toString());

        this.getSetting(name).subscribe((value) => {
            input.value = String(value ?? defaultValue);
        });

        input.addEventListener('change', () => {
            this.updateSetting(name, parseInt(input.value, 10));
        });

        const label = this.createLabel(name, description);
        const container = this.createFlexContainer(['reverse-setting']);
        container.appendChild(input);
        container.appendChild(label);
        return container;
    }

    private createTextSetting(
        name: string,
        description: string,
        defaultValue: string,
    ): HTMLElement {
        const input = this.createInput('text', name, defaultValue);
        input.id = name;

        this.getSetting(name).subscribe((value) => {
            input.value = String(value ?? defaultValue);
        });

        input.addEventListener('change', () => {
            this.updateSetting(name, input.value);
        });

        const label = this.createLabel(name, description);
        label.setAttribute('for', name);
        const container = this.createFlexContainer();
        container.appendChild(input);
        container.appendChild(label);
        return container;
    }

    private createCheckboxSetting(
        name: string,
        description: string,
        defaultValue: boolean,
        callback?: (value: boolean) => unknown,
    ): HTMLElement {
        const input = this.createCheckboxInput(name, defaultValue);
        const label = this.createLabel(name, description);
        const checkboxLabel = this.createLabel(name, '');
        const checkbox = document.createElement('span');
        checkbox.classList.add('checkbox');
        checkbox.id = name;
        const container = this.createFlexContainer(['reverse-setting']);

        checkboxLabel.appendChild(input);
        checkboxLabel.appendChild(checkbox);
        container.appendChild(checkboxLabel);
        container.appendChild(label);

        container.addEventListener('click', (e) => {
            e.preventDefault();
            const newValue = !input.checked;

            callback?.(newValue);

            input.checked = newValue;
            input.dispatchEvent(new CustomEvent('change', { bubbles: true }));
            this.updateSetting(name, input.checked);
        });

        return container;
    }

    private createDropdownSetting(
        name: string,
        description: string,
        defaultValue: number | string,
        options: DropdownOption[],
    ): HTMLElement {
        const select = this.createDropdown(name, defaultValue, options);
        const label = this.createLabel(name, description);
        select.id = name;

        // Set the default selected index
        if (typeof defaultValue === 'number') {
            select.selectedIndex = defaultValue;
        } else if (typeof defaultValue === 'string') {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].value === defaultValue) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }

        // Add event listener to update setting on change
        select.addEventListener('change', () => {
            const value = select.value;
            this.updateSetting(name, value); // Update setting in store
        });

        const container = this.createFlexContainer(['reverse-setting']);
        container.appendChild(select);
        container.appendChild(label);
        return container;
    }

    private createButton(
        name: string,
        content: string,
        callback: () => void,
        options: { classes?: string[] } = {},
    ): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = name;
        button.innerHTML = content;

        if (options.classes && options.classes.length) {
            options.classes.forEach((cls) => button.classList.add(cls));
        }

        this.getSetting(name).subscribe((value) => {
            if (value === false) {
                button.disabled = true;
            }
        });

        button.addEventListener('click', () => {
            callback();
        });

        return button;
    }

    private createAlarmSetting(
        name: string,
        description: string,
        options: { classes?: string[] } = {},
    ): HTMLElement {
        const { classes = [] } = options;

        const shortDescription = this.createText(description);
        const activeCheckbox = this.createCheckboxSetting(
            name + 'Active',
            'Active',
            false,
        );
        activeCheckbox.classList.add('alarm-active');
        activeCheckbox.style.marginRight = '20px';

        const alertDropdown = this.createDropdown(
            name + 'AlertSound',
            '',
            this.alarms,
        );
        alertDropdown.classList.add('alarm-dropdown', 'full');
        alertDropdown.style.marginBottom = '5px';

        const loopCheckbox = this.createCheckboxSetting(
            name + 'Loop',
            'Loop',
            false,
        );
        loopCheckbox.classList.add('alarm-looping');

        const volumeSlider = this.createRangeSetting(name + 'Volume', '', {
            defaultValue: '100',
            unit: '%',
            min: 0,
            max: 100,
        });
        volumeSlider.classList.add('half', 'alarm-volume');

        const alarmSoundText = this.createText('Alarm Sound');
        alarmSoundText.classList.add('full', 'alarm-sound');
        alarmSoundText.style.paddingTop = '0px';
        alarmSoundText.style.marginTop = '0px';

        const volumeText = this.createText('Volume');
        volumeText.style.marginTop = '-1px';
        volumeText.style.marginRight = '5px';
        volumeText.classList.add('half');
        volumeText.style.paddingTop = '0px';

        const container = this.createFlexContainer(['flex-wrap']);
        container.classList.add('alarm-setting');

        if (classes.length) {
            classes.forEach((cls) => container.classList.add(cls));
        }

        container.appendChild(shortDescription);
        const innerContainer = this.createFlexContainer();
        innerContainer.appendChild(activeCheckbox);
        innerContainer.appendChild(loopCheckbox);
        innerContainer.classList.remove('setting');
        container.appendChild(innerContainer);
        container.appendChild(alarmSoundText);
        container.appendChild(alertDropdown);
        container.appendChild(volumeText);
        container.appendChild(volumeSlider);

        return container;
    }
}

function updateRangeInputBackground(rangeInput: HTMLInputElement) {
    const value =
        ((parseInt(rangeInput.value, 10) - parseInt(rangeInput.min, 10)) /
            (parseInt(rangeInput.max, 10) - parseInt(rangeInput.min))) *
        100;

    rangeInput.style.background = `linear-gradient(to right, #3e5765 0%, #3e5765 ${value}%, #0d1c24 ${value}%, #0d1c24 100%)`;
}
