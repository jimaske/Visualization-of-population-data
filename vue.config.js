const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false,
    // devServer: {
    //     port: 8999,
    //     proxy: {
    //         '/api': {
    //             target: 'http://localhost:5000',
    //             changeOrigin: true,
    //             pathRewrite: { '^/api': '' }
    //         }
    //     }
    // }
})