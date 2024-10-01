import {
    Overlay,
    ImageOverlay,
    TextOverlay,
    RectOverlay,
} from './overlays.model';

export const isImageOverlay = (overlay: Overlay): overlay is ImageOverlay => {
    return (overlay as ImageOverlay).image !== undefined;
};

export const isTextOverlay = (overlay: Overlay): overlay is TextOverlay => {
    return (overlay as TextOverlay).text !== undefined;
};

export const isRectOverlay = (overlay: Overlay): overlay is RectOverlay => {
    return (overlay as RectOverlay).lineWidth !== undefined;
};
