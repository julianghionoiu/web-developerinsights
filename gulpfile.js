const gulp = require('gulp'),
    sass = require('gulp-sass'),
    notify = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    rename = require("gulp-rename"),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    image = require('gulp-image'),
    gulpEjsMonster = require('gulp-ejs-monster'),
    beautify = require('gulp-beautify'),
    htmlmin = require('gulp-htmlmin'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence');

const root = 'dist';

gulp.task('browser-sync', function () {
    browserSync.init({
        server: {
            baseDir: root,
            index: "home.html"
        },
        notify: false
    });
});

gulp.task('browser-reload', function (done) {
    browserSync.reload();
    done();
});

const paths = {
    scss: {
        src: 'app/assets/css/**/*.scss',
        dest: 'dist/assets/css'
    },
    js: {
        src: 'app/assets/js/main.js',
        dest: 'dist/assets/js/'
    },
    ejs: {
        src: 'app/**/**/*.ejs',
        dest: 'dist/'
    },
    img: {
        src: 'app/assets/img/**/**/*',
        dest: 'dist/assets/img/'
    },
    video: {
        src: 'app/assets/video/*',
        dest: 'dist/assets/video/'
    },
    fonts: {
        src: 'app/assets/fonts/**/**/*',
        dest: 'dist/assets/fonts/'
    },
    vendors: {
        src: 'app/assets/vendors/**/**/*',
        dest: 'dist/assets/vendors/'
    }
};

gulp.task('watch', ['browser-sync', 'scss', 'js'], function () {
    gulp.watch(paths.scss.src, ['scss']);
    gulp.watch(paths.js.src, ['js', 'browser-reload']);
    gulp.watch(paths.ejs.src, ['ejs', 'browser-reload']);
    gulp.watch(paths.img.src, ['build-images', 'browser-reload']);
    gulp.watch(paths.video.src, ['build-video', 'browser-reload']);
    gulp.watch(paths.fonts.src, ['build-fonts', 'browser-reload']);
    gulp.watch(paths.vendors.src, ['build-vendors', 'browser-reload']);
});

gulp.task('build-images', function () {
    return gulp.src(paths.img.src)
        .pipe(gulp.dest(paths.img.dest));
});

gulp.task('build-video', function () {
    return gulp.src(paths.video.src)
        .pipe(gulp.dest(paths.video.dest));
});

gulp.task('build-fonts', function () {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest));
});

gulp.task('build-vendors', function () {
    return gulp.src(paths.vendors.src)
        .pipe(gulp.dest(paths.vendors.dest));
});

gulp.task('ejs', function () {
    gulp.src(paths.ejs.src)
        .pipe(gulpEjsMonster().on('error', gulpEjsMonster.preventCrash))
        .pipe(gulp.dest(paths.ejs.dest));
});

gulp.task('js', function () {
    return gulp.src(paths.js.src)
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(rename("main.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.js.dest));
});

gulp.task('scss', function () {
    return gulp.src(paths.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', notify.onError({
            message: "<%= error.message %>",
            title: "Sass Error!"
        })))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.stream());
});

gulp.task('img', function () {
    return gulp.src(paths.img.src)
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 5}),
            imagemin.svgo({
                plugins: [
                    {removeViewBox: true},
                    {cleanupIDs: false}
                ]
            })

        ]))
        .pipe(image({}))
        .pipe(gulp.dest(paths.img.dest));
});

gulp.task('html-beautify', function () {
    return gulp
        .src(paths.html.src)
        .pipe(beautify.html({indent_size: 2}))
        .pipe(gulp.dest(paths.html.dest));
});

gulp.task('html-minify', () => {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(paths.html.dest));
});

gulp.task('clean-dist', function () {
    return gulp.src('dist/*')
        .pipe(clean({
            //force: true
        }));
});

gulp.task('default', function () {
    return runSequence(
        'clean-dist',
        'ejs',
        'build-images',
        'build-video',
        'build-fonts',
        'build-vendors',
        'watch');
});