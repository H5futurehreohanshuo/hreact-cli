module.exports = {
  plugins: [
    require('autoprefixer')({
      browsers: [
        "> 1%",
        "last 2 versions",
        "Android >= 3.2",
        "Firefox >= 20",
        "iOS 7"
      ]
    }),
    require('postcss-pxtorem')({
      rootValue: 37.5,
      // 忽略border相关属性
      propList: ["*", "!border*", "!font-size*"]
    })
  ]
}
