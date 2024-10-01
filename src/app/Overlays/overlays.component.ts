import { Component } from '@angular/core';
import { OverlaysService } from './overlays.service';
import { Overlays } from './overlays.model';

@Component({
    selector: 'app-overlays',
    templateUrl: './overlays.component.html',
})
export class OverlaysComponent {
    constructor(public overlaysService: OverlaysService) {}

    // You can add methods here to interact with the overlaysService
}
