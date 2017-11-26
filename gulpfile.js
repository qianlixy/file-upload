var gulp = require('gulp'),
  pug = require("gulp-pug"),
  replace = require("gulp-replace");

//同步静态资源
gulp.task("static", function() {
  return gulp.src('src/static/**/*.*', {base:'src'})
    .pipe(gulp.dest('dist'))
});

//编译pug模板
gulp.task("pug", function() {
  return gulp.src("src/view/**/*.pug", {base:'src'})
    .pipe(pug({pretty:true}))
    .pipe(replace(/\$\{relativePath\}\//g, function(match, p1) {
      var relative = this.file.relative.replace(/\\/g, "/");
      return relative.substr(0, relative.lastIndexOf("/") + 1).replace(/[^\/]+/g, "..");
    }))
    .pipe(gulp.dest("dist"));
});

//监听文件变动将编译pug模板和同步静态资源
gulp.task("watch", function() {
  gulp.watch("src/**/*", ["static", "pug"]);
});

gulp.task("default", ["static", "pug", "watch"]);
