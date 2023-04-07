module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: false, // polyfill 选项, entry: 根据浏览器版本全部引入, false: 全部引入, usage: 按需引入
        corejs: 3
      }
    ]
    // '@babel/preset-typescript' // 处理 ts
  ]
}
