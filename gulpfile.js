const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const folderdelete = require('folder-delete');
const minimist = require('minimist');
const through = require('through2');
const browserSync = require('browser-sync');
const { assign } = require('lodash');
const watchify = require('watchify');
const browserify = require('browserify');
const hbsfy = require('hbsfy');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const mergeStream = require('merge-stream');

const gulpPaths = require('./gulpPaths');
const serverConfig = require('./src/server/config');

const args = process.argv.slice(3);

const parsedArgs = minimist(process.argv, {
  default: {
    'server-port': serverConfig['server-port'],
  },
});

gulp.task('clean', () => {
  folderdelete('build', { debugLog: true });
});

gulp.task('browsersync:init', () => {
  browserSync.init({
    proxy: `localhost:${parsedArgs['server-port']}`,
    port: serverConfig['sync-port'],
  });
});

gulp.task('browsersync:reload', () => {
  browserSync.reload();
});

function createBundle(src) {
  if (!src.push) {
    src = [src];
  }

  const options = {
    entries: src,
    debug: true,
  };

  const parsedOptions = assign({}, watchify.args, options);

  const b = watchify(browserify(parsedOptions));

  b.transform('babelify');
  b.transform(hbsfy);

  b.on('log', plugins.util.log);
  return b;
}

function bundle(b, outputPath, callback = () => {}) {
  const splitPath = outputPath.split('/');
  const outputFile = splitPath[splitPath.length - 1];

  return (
    b
      .bundle()
      .on('error', plugins.util.log.bind(plugins.util, 'Browserify error'))
      .pipe(source(outputFile))
      .pipe(buffer())
      .pipe(plugins.sourcemaps.init({ loadMaps: true }))
      // .pipe(plugins.uglify())
      .pipe(plugins.sourcemaps.write('./'))
      .pipe(gulp.dest(gulpPaths.clientJsBUILD))
      .on('end', callback)
  );
}

const jsBundles = {
  'build/client/scripts/main_bundle.js': createBundle('./src/client/scripts/main.js'),
  'build/client/scripts/authResp.js': createBundle('./src/client/scripts/authResp.js'),
  'build/client/scripts/poll.js': createBundle('./src/client/scripts/poll.js'),
  'build/client/scripts/index.js': createBundle('./src/client/scripts/index.js'),
  'build/client/scripts/createPoll.js': createBundle('./src/client/scripts/createPoll.js'),
};

gulp.task('client:js', () => {
  return mergeStream(Object.keys(jsBundles).map(key => bundle(jsBundles[key], key)));
});

gulp.task('client:style', () =>
  gulp
    .src(gulpPaths.stylesSRC)
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({ outputStyle: 'compressed' }))
    .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(gulpPaths.stylesBUILD))
    .pipe(browserSync.stream()));

gulp.task('client:style:prod', () =>
  gulp
    .src(gulpPaths.stylesSRC)
    .pipe(plugins.sass.sync().on('error', plugins.sass.logError))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({ outputStyle: 'compressed' }))
    .pipe(plugins.autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(gulpPaths.stylesBUILD)));

gulp.task('server:js', () =>
  gulp
    .src(gulpPaths.serverJsSRC)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .on('error', plugins.util.log.bind(plugins.util))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(gulpPaths.serverJsBUILD)));

gulp.task('server:templates', () =>
  gulp
    .src(gulpPaths.templatesSRC)
    .pipe(plugins.handlebars())
    .pipe(plugins.defineModule('node'))
    .pipe(gulp.dest(gulpPaths.templatesBUILD)));

// gulp
//   .src(gulpPaths.templatesSRC)
//   .pipe(plugins.handlebars())
//   .pipe(through.obj((file, enc, callback) => {
//     file.defineModuleOptions.require = { Handlebars: 'handlebars/runtime' };
//     callback(null, file);
//   }))
//   .pipe(plugins.defineModule('commonjs'))
//   .pipe(plugins.rename((path) => {
//     path.extname = '.js';
//   }))
//   .pipe(gulp.dest(gulpPaths.templatesBUILD)));

gulp.task('develop-server-restart', () => {
  plugins.developServer.restart((err) => {
    browserSync.reload();
  });
});

gulp.task('server:develop', () => {
  plugins.developServer.listen({
    path: './index.js',
    cwd: './build/server',
    parsedArgs,
  });
  gulp.watch(['build/server/**/*.js'], ['develop-server-restart']);
});

gulp.task('watch', () => {
  gulp.watch([gulpPaths.serverJsSRC], ['server:js']);
  gulp.watch([gulpPaths.templatesSRC], ['server:templates']);
  gulp.watch([gulpPaths.stylesSRC], ['client:style']);
  gulp.watch(['build/client/scripts/**/*.js'], ['browsersync:reload']);

  Object.keys(jsBundles).map((key) => {
    const b = jsBundles[key];
    b.on('update', () => {
      bundle(b, key, browserSync.reload);
    });
  });
});

gulp.task('serve', (done) => {
  runSequence(
    'clean',
    ['server:js', 'server:templates', 'client:style', 'client:js'],
    ['server:develop', 'browsersync:init', 'watch'],
    done
  );
});

