import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

export interface Error {
    title: string;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class LogErrorService {
    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);
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
            this.closeError(headerContainer.parentElement());
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

    public showError(error: Error, parentElement: HTMLElement) {
        const activeError = parentElement.querySelector('#Error');
        if (
            activeError &&
            activeError.querySelector('h2')?.innerText === error.title
        ) {
            return;
        }

        const container = this.createErrorContainer();
        const headerContainer = this.createErrorHeader(error);

        this.renderer.appendChild(container, headerContainer);
        this.renderer.appendChild(container, this.createErrorMessage(error));
        this.renderer.appendChild(parentElement, container);
    }

    private closeError(container: HTMLElement) {
        if (container) {
            this.renderer.removeChild(container.parentElement, container);
        }
    }
}
