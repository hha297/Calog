declare module '*.svg' {
        import React from 'react';
        import { SvgProps } from 'react-native-svg';
        const content: React.FC<SvgProps>;
        export default content;
}

declare module '@env' {
        export const GOOGLE_CLIENT_ID: string;
}
