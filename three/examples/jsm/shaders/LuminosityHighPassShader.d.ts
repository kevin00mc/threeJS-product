import { IUniform } from '../../../src/Three';

export const LuminosityHighPassShader: {
    shaderID: string;
    uniforms: {
        tDiffuse: IUniform;
        luminosityThreshold: IUniform;
        smoothWidth: IUniform;
        defaultColor: IUniform;
        defaultOpacity: IUniform;
    };
    vertexShader: string;
    fragmentShader: string;
};
