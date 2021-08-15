import gulp from 'gulp';
import gulpIf from 'gulp-if';
import babel from 'gulp-babel';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import csso from 'gulp-csso';
import terser from 'terser';
import composer from 'gulp-uglify/composer';
import htmlMin from 'gulp-htmlmin';
import connect from 'gulp-connect';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import sassVariables from 'gulp-sass-variables';
import { removeSync, outputJson } from 'fs-extra';
import kebabCase from 'kebab-case';
import hexRgb from 'hex-rgb';
import ts from 'gulp-typescript';

import * as buildInfo from 'preval-build-info';
import config from './package.json';

import * as rawStyleConfig from './src/theme/default/legacy';

dotenv.config();

const sass = gulpSass(dartSass);
const uglify = composer(terser, console);

const isDevBuild = process.env.NODE_ENV === 'development';

const getTargetEnv = isDevBuild ? 'development' : 'production';

const tsProject = ts.createProject('tsconfig.json');

const styleConfig = Object.keys(rawStyleConfig).map(key => {
  const isHex = /^#[0-9A-F]{6}$/i.test(rawStyleConfig[key]);
  return {
    [`$raw_${kebabCase(key)}`]: isHex
      ? hexRgb(rawStyleConfig[key], { format: 'array' }).splice(0, 3).join(',')
      : rawStyleConfig[key],
  };
});

const paths = {
  src: 'src',
  dest: 'build',
  tmp: '.tmp',
  dist: 'out',
  package: `out/${config.version}`,
  buildInfoDestFile: 'build/buildInfo.json',
  recipes: {
    src: 'recipes/archives/*.tar.gz',
    dest: 'build/recipes/',
  },
  recipeInfo: {
    src: 'recipes/*.json',
    dest: 'build/recipes/',
  },
  html: {
    src: 'src/**/*.html',
    dest: 'build/',
    watch: 'src/**/*.html',
  },
  styles: {
    src: [
      'src/styles/main.scss',
      'src/styles/vertical.scss',
      'src/styles/animations.scss',
    ],
    dest: 'build/styles',
    watch: 'src/styles/**/*.scss',
  },
  javascripts: {
    src: 'src/**/*.js',
    dest: 'build/',
    watch: [
      'src/**/*.js',
      // 'packages/**/*.js',
    ],
  },
  typescripts: {
    src: 'src/**/*.ts',
    dest: 'build/',
    watch: [
      'src/**/*.ts',
      // 'packages/**/*.ts',
    ],
  },
  packages: {
    watch: 'packages/**/*',
    // dest: 'build/',
    // watch: [
    //   'src/**/*.js',
    //   // 'packages/**/*.js',
    // ],
  },
};

// eslint-disable-next-line no-unused-vars
function _shell(cmd, cb) {
  console.log('executing', cmd);
  exec(
    cmd,
    {
      cwd: paths.dest,
    },
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

      cb();
    },
  );
}

const clean = done => {
  removeSync(paths.tmp);
  removeSync(paths.dest);
  removeSync(paths.dist);

  done();
};
export { clean };

export function mvSrc() {
  return gulp
    .src(
      [
        `${paths.src}/*`,
        `${paths.src}/*/**`,
        `!${paths.javascripts.watch[0]}`,
        `!${paths.typescripts.watch[0]}`,
        `!${paths.src}/styles/**`,
      ],
      { since: gulp.lastRun(mvSrc) },
    )
    .pipe(gulp.dest(paths.dest));
}

export function mvPackageJson() {
  return gulp.src(['./package.json']).pipe(gulp.dest(paths.dest));
}

export function mvLernaPackages() {
  return gulp.src(['packages/**']).pipe(gulp.dest(`${paths.dest}/packages`));
}

export function exportBuildInfo() {
  const buildInfoData = {
    timestamp: buildInfo.timestamp,
    gitHashShort: buildInfo.gitHashShort,
    gitBranch: buildInfo.gitBranch,
  };
  return outputJson(paths.buildInfoDestFile, buildInfoData);
}

export function html() {
  return gulp
    .src(paths.html.src, { since: gulp.lastRun(html) })
    .pipe(
      gulpIf(
        !isDevBuild,
        htmlMin({
          // Only minify in production to speed up dev builds
          collapseWhitespace: true,
          removeComments: true,
        }),
      ),
    )
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload());
}

export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(
      sassVariables(
        Object.assign(
          {
            $env: getTargetEnv,
          },
          ...styleConfig,
        ),
      ),
    )
    .pipe(
      sass({
        includePaths: ['./node_modules', '../node_modules'],
      }).on('error', sass.logError),
    )
    .pipe(
      gulpIf(
        !isDevBuild,
        csso({
          // Only minify in production to speed up dev builds
          restructure: false, // Don't restructure CSS, otherwise it will break the styles
        }),
      ),
    )
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(connect.reload());
}

export function processJavascripts() {
  return gulp
    .src(
      [
        paths.javascripts.src,
      ],
      { since: gulp.lastRun(processJavascripts) },
    )
    .pipe(
      babel({
        comments: false,
      }),
    )
    .pipe(gulpIf(!isDevBuild, uglify())) // Only uglify in production to speed up dev builds
    .pipe(gulp.dest(paths.javascripts.dest))
    .pipe(connect.reload());
}

export function processTypescripts() {
  return gulp
    .src(
      [
        paths.typescripts.src,
      ],
      { since: gulp.lastRun(processTypescripts) },
    )
    .pipe(tsProject())
    .js
    .pipe(
      babel({
        comments: false,
      }),
    )
    .pipe(gulpIf(!isDevBuild, uglify())) // Only uglify in production to speed up dev builds
    .pipe(gulp.dest(paths.typescripts.dest))
    .pipe(connect.reload());
}

export function watch() {
  gulp.watch(paths.packages.watch, mvLernaPackages);
  gulp.watch(paths.styles.watch, styles);

  gulp.watch([paths.src], mvSrc);

  gulp.watch(paths.javascripts.watch, processJavascripts);
  gulp.watch(paths.typescripts.watch, processTypescripts);
}

export function webserver() {
  connect.server({
    root: paths.dest,
    livereload: true,
  });
}

export function recipes() {
  return gulp
    .src(paths.recipes.src, { since: gulp.lastRun(recipes) })
    .pipe(gulp.dest(paths.recipes.dest));
}

export function recipeInfo() {
  return gulp
    .src(paths.recipeInfo.src, { since: gulp.lastRun(recipeInfo) })
    .pipe(gulp.dest(paths.recipeInfo.dest));
}

const build = gulp.series(
  clean,
  gulp.parallel(mvSrc, mvPackageJson, mvLernaPackages, exportBuildInfo),
  gulp.parallel(html, processJavascripts, processTypescripts, styles, recipes, recipeInfo),
);
export { build };

const dev = gulp.series(build, gulp.parallel(webserver, watch));
export { dev };
