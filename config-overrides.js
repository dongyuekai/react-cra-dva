const { override, fixBabelImports, addWebpackAlias, addDecoratorsLegacy } = require('customize-cra')
const path = require('path')
const rewirePostcss = require('react-app-rewire-postcss')
const px2rem = require('postcss-px2rem-exclude')

module.exports = override(
  // 针对antd 和 antd-mobile 按需加载
  fixBabelImports('import',
    {
      libraryName: 'antd-mobile',
      libraryDirectory: 'es',
      style: 'css'
    }
  ),
  // 增加路径别名处理
  addWebpackAlias({
    "@": path.resolve('./src')
  }),
  addDecoratorsLegacy(),
  (config, env) => {
    // 重写postcss
    rewirePostcss(config, {
      plugins: () => [
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009'
          },
          stage: 3
        }),
        // 设置px2rem
        px2rem({
          remUnit: 37.5,//这里最开始写的是75，但是antd的样式变的可小，查询后看人家设置的是37.5，然后试了下确实好了
          exclude: /node-modules/i,
        })
      ]
    })
    return config
  }
)
