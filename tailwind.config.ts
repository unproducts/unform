import defineConfig from '@nuxtjs/tailwindcss/config';

export default defineConfig({
  theme: {
    extend: {
      colors: {
        bermuda: {
          '50': '#f3faf7',
          '100': '#d7f0e8',
          '200': '#aee1d0',
          '300': '#77c8b0',
          '400': '#52af96',
          '500': '#39937c',
          '600': '#2b7665',
          '700': '#265f52',
          '800': '#224d44',
          '900': '#20413a',
          '950': '#0e2522',
        },
      },
    },
  },
  plugins: [],
});
