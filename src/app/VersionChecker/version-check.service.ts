import { Injectable, Input } from '@angular/core';
import { getA1Sauce } from '../a1sauce';
import { tempTooltip } from '../Utilities/temporary-tooltip';

@Injectable({
    providedIn: 'root',
})
export class VersionCheckService {
    @Input() versionUrl!: string;

    constructor() {}

    async getVersion(versionUrl: string): Promise<string> {
        const response = await fetch(versionUrl, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        const latestVersion = await response.json();
        return latestVersion;
    }

    async startVersionChecking(versionUrl: string): Promise<void> {
        const version = await this.getVersion(versionUrl);
        this.updateAlert(version);

        setInterval(
            async () => {
                const version = await this.getVersion(versionUrl);
                this.updateAlert(version);
            },
            1000 * 60 * 15,
        );
    }

    updateAlert(version: string): void {
        const sauce = getA1Sauce();
        if (version === sauce.getVersion()) {
            tempTooltip(
                `A new update for ${sauce.getPublicName()} is available! Reload ${sauce.getPublicName()} for update.`,
                3000,
            );
        }
    }
}
