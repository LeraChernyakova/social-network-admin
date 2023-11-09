const gulp = require("gulp");
const gulpBabel = require("gulp-babel");
const gulpUglify = require("gulp-uglify");
const gulpLess = require("gulp-less");
const gulpCleanCSS = require("gulp-clean-css");
const gulpPug = require("gulp-pug");

const {getAllUsers, getUser, getUserChats, getFriendsNews} = require("./router/function/routesFunction");

const users = getAllUsers();
const currentUser = getUser(1);
const usersChats = getUserChats(1);
const usersNews = getFriendsNews(1);

function img() {
    return gulp.src('images/*.*')
        .pipe(gulp.dest('public/img'));
}

function js() {
    return gulp.src('scripts/index.js')
        .pipe(gulpBabel())
        .pipe(gulpUglify())
        .pipe(gulp.dest('public/scripts'));
}

function less() {
    return gulp.src('less/style.less')
        .pipe(gulpLess())
        .pipe(gulpCleanCSS())
        .pipe(gulp.dest('public/styles'));
}

function pug() {
    return gulp.src('views/*.pug')
        .pipe(gulpPug({ locals: { users, currentUser, usersChats, usersNews } }))
        .pipe(gulp.dest('public/html'));
}

gulp.task("script", js);
gulp.task("css", less);
gulp.task("img", img);
gulp.task("html", pug);

gulp.task('watch', function () {
    gulp.watch('less/style.less', gulp.series('css'));
    gulp.watch('scripts/index.js', gulp.series('script'));
    gulp.watch('images/*.*', gulp.series('img'));
    gulp.watch('views/*.pug', gulp.series('html'));
});

gulp.task("default", gulp.series(img, less, js, pug, 'watch', function(done) {
    done();
}));