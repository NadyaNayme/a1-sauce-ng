import { Injectable } from '@angular/core';
import {
    Overlays,
    ImageOverlay,
    TextOverlay,
    RectOverlay,
} from './overlays.model';
import { isImageOverlay, isRectOverlay, isTextOverlay } from './overlays.utils';

@Injectable({
    providedIn: 'root',
})
export class OverlaysService {
    overlays: Overlays[] = [];
    overlayTimers: Map<string, number> = new Map();

    /**
     * Updates an existing managed overlay and if one does not exist adds it to the managed overlays
     * @param overlay - All necessary metadata to draw the overlay
     */
    updateOverlay(overlay: Overlays) {
        // If the overlay exists in Overlays[]
        if (this.overlayExists(overlay.name)) {
            // Data is different, update the existing overlay with the new data
            const existingOverlayIndex = this.overlays.findIndex(
                (existing) => existing.name === overlay.name,
            );
            const existingOverlay =
                this.overlays[existingOverlayIndex];
            this.overlays[existingOverlayIndex] = {
                ...existingOverlay,
                ...overlay,
            };

            // Redraw the overlay - which will also create a timer to redraw
            this.drawOverlays(overlay);
            return;
        }

        // If the overlay doesn't exist - add it to Overlays[] then draw them
        this.overlays.push(overlay);

        // Text overlays should always draw one higher than image overlays so that they appear above
        if (isTextOverlay(overlay)) {
            alt1.overLaySetGroupZIndex(overlay.name, 3);
            this.drawTextOverlay(overlay);
        }
        if (isImageOverlay(overlay)) {
            alt1.overLaySetGroupZIndex(overlay.name, 1);
            this.drawImageOverlay(overlay);
        }
        if (isRectOverlay(overlay)) {
            this.drawRectOverlay(overlay);
        }
    }

    /**
     * Get an overlay by name
     * @param name - String that is used to refer to the Overlay
     * @returns Overlay with matching name
     */
    getOverlay(name: string) {
        return this.overlays.find((overlay) => {
            overlay.name === name;
        });
    }

    overlayExists(name: string): boolean {
        return this.overlays.some(
            (overlay) => overlay.name === name,
        );
    }

    /**
     * Freezes all managed overlays. This will prevent Alt1 from updating them until continueOverlays() is called
     */
    freezeOverlays() {
        this.overlays.forEach((overlay) => {
            alt1.overLayFreezeGroup(overlay.name);
        });
    }

    /**
     * Clears all existing overlays
     */
    clearOverlays() {
        this.overlays.forEach((overlay) => {
            alt1.overLayClearGroup(overlay.name);
        });
    }

    /**
     * Continue rendering all managed overlays
     */
    continueOverlays() {
        this.overlays.forEach((overlay) => {
            alt1.overLayContinueGroup(overlay.name);
        });
    }

    /**
     * Used to force a redraw of all existing managed overlays at once and reset any existing timers
     */
    forceClearOverlays() {
        this.overlays.forEach((overlay) => {
            const timeoutId = this.overlayTimers.get(overlay.name);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.overlayTimers.delete(overlay.name);
            }
            alt1.overLayClearGroup(overlay.name);
        });
        this.overlays = [];
        this.freezeOverlays();
        this.clearOverlays();
        this.continueOverlays();
    }

    refreshOverlay(name: string) {
        alt1.overLayRefreshGroup(name);
    }

    freezeOverlay(name: string) {
        alt1.overLayFreezeGroup(name);
    }

    clearOverlay(name: string) {
        alt1.overLayClearGroup(name);
    }

    continueOverlay(name: string) {
        alt1.overLayContinueGroup(name);
    }

    forceClearOverlay(name: string) {
        alt1.overLaySetGroup(name);
        alt1.overLayFreezeGroup(name);
        alt1.overLayClearGroup(name);
        alt1.overLayContinueGroup(name);
    }

    /**
     * Draws all overlays that match the specified category.
     * @param category - The category to filter overlays by.
     */
    drawOverlaysByCategory(category: number) {
        // First, clear overlays that do not match the category
        this.removeOverlaysByCategory(category);

        // Now draw the remaining overlays that match the category
        this.overlays.forEach((overlay) => {
            if (overlay.category === category) {
                this.drawOverlays(overlay);
            } else {
                this.forceClearOverlay(overlay.name);
            }
        });
    }

    drawOverlays(overlay: Overlays) {
        const existingOverlayIndex = this.overlays.findIndex(
            (existing) => existing.name === overlay.name,
        );
        if (isImageOverlay(overlay) && existingOverlayIndex >= 0) {
            const existingOverlay =
                this.overlays[existingOverlayIndex];
            if (
                isImageOverlay(existingOverlay) &&
                !this.overlayTimers.get(overlay.name)
            ) {
                this.drawImageOverlay(overlay);
            }
        }
        if (isTextOverlay(overlay) && existingOverlayIndex >= 0) {
            const existingOverlay =
                this.overlays[existingOverlayIndex];
            if (
                isTextOverlay(existingOverlay) &&
                !this.overlayTimers.get(overlay.name)
            ) {
                this.drawTextOverlay(overlay);
            }
        }
        if (isRectOverlay(overlay)) {
            this.drawRectOverlay(overlay);
        }

        /* Start a timer for the overlay to redraw if a timer doesn't already exist */
        if (!this.overlayTimers.get(overlay.name)) {
            const timeoutId = window.setTimeout(() => {
                this.removeOverlaysByCategory(
                    overlay.category,
                );
                this.overlayTimers.delete(overlay.name);

                // Order of operations really matters here. We must delete the key before drawing
                // otherwise we never recreate the key. (Nyu is very stupid)
                this.drawOverlays(overlay);
            }, 15000);
            this.overlayTimers.set(overlay.name, timeoutId);
        }
    }

    drawImageOverlay(overlay: ImageOverlay) {
        if (!this.overlayExists(overlay.name)) return;

        this.forceClearOverlay(overlay.name);

        alt1.overLayImage(
            overlay.position.x,
            overlay.position.y,
            overlay.image,
            overlay.width,
            overlay.duration,
        );
    }

    drawTextOverlay(overlay: TextOverlay) {
        if (!this.overlayExists(overlay.name)) return;

        this.forceClearOverlay(overlay.name);

        alt1.overLayTextEx(
            overlay.text,
            overlay.color,
            overlay.size,
            overlay.position.x,
            overlay.position.y,
            overlay.duration,
            '',
            true,
            true,
        );
        alt1.overLayRefreshGroup(overlay.name);
    }

    drawRectOverlay(overlay: RectOverlay) {
        if (!this.overlayExists(overlay.name)) return;
        alt1.overLaySetGroup(overlay.name);
        alt1.overLayRect(
            overlay.color,
            overlay.position.x,
            overlay.position.y,
            overlay.width,
            overlay.height,
            overlay.duration,
            overlay.lineWidth,
        );
    }

    /**
     * Removes all overlays and their timers from Overlays[] and overlayTimers that
     * do not match the specified category.
     * @param category - The category to filter overlays by.
     */
    removeOverlaysByCategory(category: number) {
        const remainingOverlays: Overlays[] = [];

        this.overlays.forEach((overlay) => {
            if (overlay.category === category) {
                remainingOverlays.push(overlay); // Keep overlays that match the category
            } else {
                // If it does not match clear the overlays
                this.forceClearOverlay(overlay.name);
            }
            const timeoutId = this.overlayTimers.get(overlay.name);
            if (timeoutId) {
                clearTimeout(timeoutId);
                this.overlayTimers.delete(overlay.name);
            }
        });

        this.overlays = remainingOverlays;
    }
}
