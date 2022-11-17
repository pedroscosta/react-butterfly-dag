import {resolve} from 'node:path';

import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import EsLint from 'vite-plugin-linter';
import tsConfigPaths from 'vite-tsconfig-paths';
import * as packageJson from './package.json';
const {EsLinter, linterPlugin} = EsLint;
// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
    plugins: [
        react(),
        tsConfigPaths(),
        linterPlugin({
            include: ['./src}/**/*.{ts,tsx}'],
            linters: [new EsLinter({configEnv})],
        }),
        dts({
            include: ['src/components/'],
        }),
    ],
    build: {
        lib: {
            entry: resolve('src', 'components/index.ts'),
            name: 'react-butterfly-dag',
            formats: ['es', 'cjs'],
            fileName: (format) => `react-butterfly-dag.${format}.js`,
        },
        rollupOptions: {
            external: [
                ...Object.keys(packageJson.peerDependencies),
                'react',
                'react-dom',
                'react-dom/client',
            ],
        },
    },
}));
