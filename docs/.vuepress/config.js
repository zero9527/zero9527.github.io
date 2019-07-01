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
        children: [
          '/js/js-a',
        ]
      },
      {
        title: 'VUE',
        children: [
          '/vue/vue-a',
          '/vue/vue-b',
        ]
      },
      {
        title: 'REACT',
        children: [
          '/react/react-a',
        ]
      },
      {
        title: 'NODE.JS',
        children: [
          // '/node-js',
        ]
      },
      {
        title: '小程序',
        children: [
          // '/mini-program',
        ]
      },
      {
        title: '其他',
        children: [
          // '/others',
        ]
      },
    ]
  },
}