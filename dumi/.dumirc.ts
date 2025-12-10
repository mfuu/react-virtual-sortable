import { defineConfig } from 'dumi';
import path from 'path';

export default defineConfig({
  chainWebpack(memo) {
    memo.resolve.alias.set('@', path.join(__dirname, '../src/'));
    memo.plugins.delete('copy');
  },
  locales: [{ id: 'en-US', name: 'English' }],
  base: '/react-virtual-sortable/',
  publicPath: '/react-virtual-sortable/',
  themeConfig: {
    mode: 'doc',
    prefersColor: { default: 'auto' },
    socialLinks: { github: 'https://github.com/mfuu/react-virtual-sortable' },
    nav: [
      {
        title: 'Guide',
        link: '/guide/install',
      },
      {
        title: 'Demo',
        link: '/demo/basic',
      },
    ],

    sidebar: {
      '/guide': [
        {
          children: [
            { title: 'Start', link: '/guide/install' },
            { title: 'Props', link: '/guide/props' },
            { title: 'Callback', link: '/guide/callback' },
            { title: 'Methods', link: '/guide/methods' },
          ],
        },
      ],
      '/demo': [
        {
          children: [
            { title: 'Basic', link: '/demo/basic' },
            { title: 'Group', link: '/demo/group' },
            { title: 'Horizontal', link: '/demo/horizontal' },
            { title: 'Infinity', link: '/demo/infinity' },
            { title: 'ScrollTo', link: '/demo/scrollto' },
            { title: 'Scroller', link: '/demo/scroller' },
            { title: 'Table Mode', link: '/demo/table' },
          ],
        },
      ],
    },
  },
});
