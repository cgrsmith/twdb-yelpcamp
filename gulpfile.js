var gulp = require("gulp");
var sass = require("gulp-sass");

gulp.task("sass", function() {
    return gulp.src("./public/styles/style.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/styles/"))
});



gulp.task("watch", ["sass"], function() {
    gulp.watch("./public/styles/*.scss", ["sass"]);
});
