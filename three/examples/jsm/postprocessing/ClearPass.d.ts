import { ColorRepresentation } from '../../../src/Three';

import { Pass, FullScreenQuad } from './Pass';

export class ClearPass extends Pass {
    constructor(clearColor?: ColorRepresentation, clearAlpha?: number);
    clearColor: ColorRepresentation;
    clearAlpha: number;
}
