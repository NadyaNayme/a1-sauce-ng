import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Error {
    title: string;
    message: string;
}

@Component({
    selector: 'app-log-error',
    standalone: true,
	imports: [CommonModule],
    templateUrl: './log-error.component.html',
    styleUrls: ['./log-error.component.css'],
})
export class LogErrorComponent implements OnInit {
    @Input() error!: Error;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
    ) {}

    ngOnInit() {
        if (this.error) {
            this.showError(this.error);
        }
    }

    private createErrorContainer(): HTMLElement {
        const container = this.renderer.createElement('div');
        this.renderer.setAttribute(container, 'id', 'Error');
        return container;
    }

    private createErrorHeader(error: Error): HTMLElement {
        const headerContainer = this.renderer.createElement('div');
        this.renderer.addClass(headerContainer, 'title-row');

        const header = this.renderer.createElement('h2');
        this.renderer.setProperty(header, 'innerText', error.title);

        const closeButton = this.renderer.createElement('button');
        this.renderer.setProperty(closeButton, 'innerText', 'Close Error');
        this.renderer.setAttribute(closeButton, 'title', 'Close error window');
        this.renderer.addClass(closeButton, 'nisbutton');
        this.renderer.addClass(closeButton, 'close-button');

        this.renderer.listen(closeButton, 'click', () => {
            this.closeError();
        });

        this.renderer.appendChild(headerContainer, header);
        this.renderer.appendChild(headerContainer, closeButton);
        return headerContainer;
    }

    private createErrorMessage(error: Error): HTMLElement {
        const msg = this.renderer.createElement('div');
        this.renderer.setProperty(msg, 'innerHTML', error.message);
        return msg;
    }

    public showError(error: Error) {
        const activeError = this.el.nativeElement.querySelector('#Error');
        if (
            activeError &&
            activeError.querySelector('h2')?.innerText === error.title
        )
            return;

        const container = this.createErrorContainer();
        const headerContainer = this.createErrorHeader(error);

        this.renderer.appendChild(container, headerContainer);
        this.renderer.appendChild(container, this.createErrorMessage(error));
        this.renderer.appendChild(this.el.nativeElement, container);
    }

    public closeError() {
        const container = this.el.nativeElement.querySelector('#Error');
        if (container) {
            this.renderer.removeChild(this.el.nativeElement, container);
        }
    }
}
