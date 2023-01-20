const gulp = require('gulp');
const cleancss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const htmlmin = require('gulp-html-minifier-terser');
var fontmin = require('gulp-fontmin');


// 压缩public目录下的css文件
// 可接受参数的文档：https://github.com/jakubpawlowicz/clean-css#constructor-options
gulp.task('minify-css', () => {
    return gulp.src('./public/**/*.css')           // 处理public目录下所有的css文件，下同
        .pipe(cleancss({ compatibility: 'ie8' }))  // 兼容到IE8
        .pipe(gulp.dest('./public'));
});

// 压缩public目录下的js文件
gulp.task('minify-js', () => {
    return gulp.src('./public/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

// 压缩public目录下的html文件
// 可接受参数的文档：https://github.com/terser/html-minifier-terser#options-quick-reference
gulp.task('minify-html', () => {
    return gulp.src('./public/**/*.html')
        .pipe(htmlmin({
            removeComments: true,                 // 移除注释
            removeEmptyAttributes: true,          // 移除值为空的参数
            removeRedundantAttributes: true,      // 移除值跟默认值匹配的属性
            collapseBooleanAttributes: true,      // 省略布尔属性的值
            collapseWhitespace: true,             // 移除空格和空行
            minifyCSS: true,                      // 压缩HTML中的CSS
            minifyJS: true,                       // 压缩HTML中的JS
            minifyURLs: true                      // 压缩HTML中的链接
        }))
        .pipe(gulp.dest('./public'))
});

//压缩字体
function minifyFont(text, cb) {
    gulp
    .src('./public/fonts/*.ttf') //原字体所在目录
    .pipe(fontmin({
        text: text
    }))
    .pipe(gulp.dest('./public/fonts/')) //压缩后的输出目录
    .on('end', cb);
}

gulp.task('minify-font', (cb) => {
    var buffers = [];
    gulp
      .src(['./public/**/*.html']) //HTML文件所在目录请根据自身情况修改
      .on('data', function(file) {
        buffers.push(file.contents);
      })
      .on('end', function() {
        var text = Buffer.concat(buffers).toString('utf-8');
        minifyFont(text, cb);
      });
  });

// 默认任务，不带任务名运行gulp时执行的任务
gulp.task('default', gulp.parallel(
    'minify-css', 'minify-js', 'minify-html', 'minify-font'
));
