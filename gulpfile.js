var gulp = require('gulp');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var fs = require('fs');
var path = require('path');
var url = require('url');
var data = require('./src/data/data.json');
//es6转es5
gulp.task('min', function() {
    return gulp.src('./src/js/index.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./src/js/minjs'))
});
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
            //open: true,
            fallback: 'index.html',
            middleware: function(req, res, next) {
                if (req.url === '/favicon.ico') {
                    return res.end();
                }
                var pathname = url.parse(req.url).pathname;
                if (/^\/api/.test(req.url)) { //接口请求
                    if (pathname === '/api/getData') {
                        var idx = url.parse(req.url, true).query.idx;
                        var start = idx * 4;
                        var end = start + 4;
                        var datas = data.data.slice(start, end);
                        res.end(JSON.stringify({ code: 0, data: datas }));
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