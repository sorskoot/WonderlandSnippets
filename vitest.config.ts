import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',

        include: ['./tests/**/*.{test,spec}.{js,ts}'],
        exclude: ['node_modules', 'dist', 'snippets'],
        coverage: {
            include: ['src/**/*.{js,ts}'],
            exclude: [
                'node_modules/**',
                'tests/**',
                '**/*.test.{js,ts}',
                '**/*.spec.{js,ts}',
                '**/types/**',
                '**/*.d.ts',
                'vitest.config.ts',
                'vite.config.ts',
                '**/snippets/**',
                '**/dist/**',
            ],
        },
    },
    resolve: {
        alias: {
            '@': './js',
        },
    },
    define: {
        WL_EDITOR: JSON.stringify(false),
    },
});
