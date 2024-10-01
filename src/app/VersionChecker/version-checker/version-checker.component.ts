import { Component, OnInit } from '@angular/core';
import { VersionCheckService } from '../version-check.service';

@Component({
    selector: 'app-version-checker',
    templateUrl: './version-checker.component.html',
    styleUrls: ['./version-checker.component.css'],
})
export class VersionCheckerComponent implements OnInit {
    constructor(private versionCheckService: VersionCheckService) {}

    ngOnInit(): void {
        const versionUrl = 'YOUR_VERSION_URL_HERE'; // Replace with your actual URL
        this.versionCheckService.startVersionChecking(versionUrl);
    }
}
