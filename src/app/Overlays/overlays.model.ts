export type Position = {
    x: number;
    y: number;
};

export type Overlay = {
    name: string;
    active: boolean;
    position: Position;
    duration: number;
    category: number;
};

export type ImageOverlayData = {
    image: string;
    width: number;
};

export type TextOverlayData = {
    text: string;
    size: number;
    color: number;
};

export type RectOverlayData = {
    color: number;
    x: number;
    y: number;
    width: number;
    height: number;
    duration: number;
    lineWidth: number;
};

export type ImageOverlay = Overlay & ImageOverlayData;
export type TextOverlay = Overlay & TextOverlayData;
export type RectOverlay = Overlay & RectOverlayData;

export type Overlays = ImageOverlay | TextOverlay | RectOverlay;
