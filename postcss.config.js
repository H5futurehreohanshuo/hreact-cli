const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  plugins: [
    autoprefixer({
      browsers: [
        '> 1%',
        'last 2 versions',
        'Android >= 3.2',
        'Firefox >= 20',
        'iOS 7',
      ],
    }),
    pxtorem({
      rootValue: 37.5,
      // 忽略border相关属性
      propList: ['*', '!border*', '!font-size*'],
    }),
  ],
};
