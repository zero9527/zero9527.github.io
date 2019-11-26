module.exports = {
  title: 'zero9527的小站',
  description: 'Just playing around',
  configureWebpack: {
    resolve: {
      alias: {
        '@static': 'static'
      }
    }
  },
  themeConfig: {
    nav: [
      { text: 'VuePress', link: 'https://vuepress.vuejs.org' },
      { text: 'github', link: 'https://github.com/zero9527' },
      { text: '掘金', link: 'https://juejin.im/user/57c2df4175c4cd72901a8e7e' },
    ],
    sidebar: [
      {
        title: 'JS',
        sidebarDepth: 2,
        children: [
          '/js/promise.md',
          '/js/scroll-load.md',
          '/js/amd-cmd.md',
          '/js/evt.md',
          '/js/js-review.md'
        ]
      },
      {
        title: 'React',
        sidebarDepth: 2,
        children: [
          '/react/react-ts-template.md',
          '/react/movie-db-web.md',
          '/react/react-keep-alive.md',
          '/react/next-js.md'
        ]
      },
      {
        title: 'Vue',
        sidebarDepth: 2,
        children: [
          '/vue/uni-app.md',
          // '/vue/summary.md',
        ]
      },
      {
        title: 'Node.js',
        sidebarDepth: 2,
        children: [
          '/node.js/directory-1.md',
          '/node.js/directory-2.md',
          '/node.js/cmd-line.md'
        ]
      },
      {
        title: '小程序',
        sidebarDepth: 2,
        children: [
          '/mini-program/movie-db.md',
        ]
      },
      {
        title: '其他',
        sidebarDepth: 2,
        children: [
          '/others/web-component.md',
        ]
      },
    ]
  },
}