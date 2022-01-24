const TerserPlugin = require('terser-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: config => {
    const prdPlugins = [
      // 删除console插件
      new TerserPlugin({
        parallel: true,
        sourceMap: false,
        terserOptions: {
          warnings: false,
          compress: {
            // 打包时删除console以及debugger，测试环境如需使用console或者debugger请改为false（不要直接删除）
            drop_console: true,
            drop_debugger: true
          },
          output: {
            // 去掉注释内容
            comments: true
          }
        }
      }),
      new FileManagerPlugin({
        onEnd: {
          archive: [{
            source: './dist',
            destination: `./dist/h5-vue-template-${process.VUE_CLI_SERVICE.mode}.tar.gz`,
            format: 'tar',
            options: {
              gzip: true,
              gzipOptions: {
                level: 1
              },
              globOptions: {
                nomount: true
              }
            }
          }]
        }
      }),
      new BundleAnalyzerPlugin(// 打包检测
        {
          analyzerMode: 'disabled',
          openAnalyzer: true,
          generateStatsFile: false,
          statsFilename: 'stats.json'
        }
      )
    ]
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      config.plugins = [...config.plugins, ...prdPlugins]
    }
  }
}
