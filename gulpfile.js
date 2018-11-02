var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var fs = require('fs');
var path = require('path');
var url = require('url');
var data = require('./src/data/data.json');
//编译sass
gulp.task('sass', function() {
    return gulp.src('./src/scss/style.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'));
});
//监听sass
gulp.task('watchSacc', function() {
    return gulp.watch('./src/scss/style.scss', gulp.series('sass'));
});
//起服务
gulp.task('server', function() {
    return gulp.src('./src')
        .pipe(webserver({
            port: 8888,
            livereload: true,
            directoryListing: true,
            open: true,
            fallback: 'index.html',
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return res.end();
                }
                var pathname = url.parse(req.url).pathname;
                if (/^\/api/.test(req.url)) { //接口请求
                    if (pathname === '/api/getData') {
                        res.end(JSON.stringify({ code: 0, data: data.data }));
                    } else {
                        res.end('请求失败!');
                    }
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }));
})