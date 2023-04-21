const theme = {
    chalk: {
        //背景颜色
        backgroundColor: '#161522',
        titleColor: "#ffffff",
        logoSrc: 'logo_dark.png',
        themeSrc: 'qiehuan_dark.png',
        headerBorderSrc: 'header_border_dark.png'
    },
    vintage: {
        backgroundColor: "#eaeaea",
        titleColor: "#000",
        logoSrc: 'logo_light2.png',
        themeSrc: 'qiehuan_light.png',
        headerBorderSrc: 'header_border_light.png'
    }
}
export function getThemeValue(themeName) {
    return theme[themeName]
}