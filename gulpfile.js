// gulp.js configuration
var
  // modules
  gulp = require('gulp'),

  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),

  htmlclean = require('gulp-htmlclean'),

  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),

  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),

  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  ejs = require('gulp-ejs'),

  fs = require('fs'),

  browserSync = require('browser-sync'),

  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'build/'
  }
;

// image processing
gulp.task('images', function() {
  var out = folder.build + 'images/';
  return gulp.src(folder.src + 'images/**/*')
    .pipe(newer(out))
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(out));
});

gulp.task('ejs', ['images'], () => {
    var json = JSON.parse(fs.readFileSync(folder.src + 'views/var/var.json'));

    gulp.src([folder.src + 'views/*.ejs', folder.src + 'views/*.ejs.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(ejs(json))
        .pipe(rename({extname: ""})) // 拡張子一個目を消す
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest(folder.build + 'html'));
});

// JavaScript processing
gulp.task('js.concat', function() {

  var jsbuild = gulp.src([folder.src + 'assets/js/**/*'])
    .pipe(deporder())
    .pipe(concat('main.js'));

  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(uglify());
  }

  return jsbuild.pipe(gulp.dest(folder.build + 'assets/js/'));
});

gulp.task( 'font', ['images'], function() {
    return gulp.src(
        [ folder.src + 'assets/fonts/**' ],
        { base: folder.src }
    )
    .pipe( gulp.dest(folder.build) );
} );

// CSS processing
gulp.task('scss', ['images', 'font'], function() {

  var postCssOpts = [
  assets({ loadPaths: ['images/'] }),
  autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
  mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src([folder.src + 'assets/scss/origin/main.scss', folder.src + 'assets/scss/my_main.scss.css'])
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(concat('main.css'))
    .pipe(gulp.dest(folder.build + 'assets/css/'));

});

gulp.task( 'css.min', ['scss'], function() {
    return gulp.src(folder.src + 'assets/scss/*.min.css')
    .pipe( gulp.dest(folder.build + 'assets/css') );
});

gulp.task( 'css.image', ['scss'], function() {
    return gulp.src(folder.src + 'assets/scss/origin/images/**')
    .pipe( gulp.dest(folder.build + 'assets/css/images') );
});


gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: folder.build,       //対象ディレクトリ
      index  : "html/index.html"      //インデックスファイル
    }
  });
});

//
//ブラウザリロード
//
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// watch for changes
gulp.task('watch', function() {

  // image changes
  gulp.watch(folder.src + 'images/**/*', ['images']);

  // html changes
  gulp.watch(folder.src + 'views/**/*', ['html']);

  // javascript changes
  gulp.watch(folder.src + 'assets/js/**/*', ['js']);

  // css changes
  gulp.watch(folder.src + 'assets/scss/**/*', ['css']);
  gulp.watch(folder.src + 'assets/scss/images/**/*', ['css.image']);

  // font changes
  gulp.watch(folder.src + 'assets/fonts/**/*', ['font']);

  // reload
  gulp.watch(folder.build + "html/*.html", ['bs-reload']);
  gulp.watch(folder.build + "assets/**/*", ['bs-reload']);
});

gulp.task('default', ['run', 'watch', 'browser-sync']);
gulp.task('html', ['ejs']);
gulp.task('js', ['js.concat']);
gulp.task('css', ['scss', 'css.min', 'css.image']);

gulp.task('run', ['html', 'css', 'js', 'font']);