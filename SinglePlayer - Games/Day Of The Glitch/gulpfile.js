var fs = require('fs'),
    cheerio = require('cheerio'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    htmlmin = require('gulp-htmlmin'),
    whitespace = require('gulp-whitespace'),
    rimraf = require('gulp-rimraf'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    webserver = require('gulp-webserver'),
    uglify = require('gulp-uglify'),
    uglifyjs = require('uglify-js'),
    unzip = require('gulp-unzip'),
    zip = require('gulp-zip'),
    eslint = require('gulp-eslint'),
    argv = require('yargs').argv,
    exclude_min = ['js/lib/jsfxr.min.js'],
    config = { js: [] };


gulp.task('build', ['initbuild', 'jsmin', 'addjs', 'zip', 'unzip', 'clean', 'report']);


gulp.task('serve', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: false,
      host: '0.0.0.0',
      port: 8013,
      open: true
    }));
});


gulp.task('initbuild', function() {

  var stream, html, $, src, js = [], exclude = [];

  // delete prev files
  stream = gulp.src('game.zip')
        .pipe(rimraf());

  stream = gulp.src('g.js')
        .pipe(rimraf());

  stream = gulp.src('index.html')
        .pipe(rimraf());


  // get a list of all js scripts from our dev file
  html = fs.readFileSync('dev.html', 'utf-8', function(e, data) {
    return data;
  });

  $ = cheerio.load(html);

  exclude = ['js/engine/screenshot.js', 'js/lib/stats.js'];
  exclude = exclude.concat(exclude_min);
  console.log(exclude_min);
  $('script').each(function() {
    src = $(this).attr('src');
    if (exclude.indexOf(src) === -1) {
      js.push(src);
    }
  });

  

  config.js = js;
  console.log(js);

});

gulp.task('jsmin', ['initbuild'], function() {

  var stream = gulp.src(config.js)
    .pipe(concat('g.js'))
		.pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify({
      mangle: true
    }))
    .pipe(gulp.dest('.'));

  return stream;

});

gulp.task('addjs', ['jsmin'], function() {

    var js = fs.readFileSync('g.js', 'utf-8', function(e, data) {
      return data;
    });

    var i, tmp, extra_js = '';

    for (i = 0; i < exclude_min.length; i += 1) {
      // console.log(exclude_min[i])
      extra_js += fs.readFileSync(exclude_min[i], 'utf-8', function(e, data) {
        return data;
      });
    }
    // console.log(extra_js.length, 'OK', exclude_min);

    var stream = gulp.src('dev.html')
      .pipe(replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, ''))
      .pipe(replace(/<\/body>/igm, '<script>'+extra_js+' '+js+'</script></body>'))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(rename('index.html'))
      .pipe(whitespace({removeTrailing: true, removeLeading: true}))
      .pipe(gulp.dest('./tmp'));

    return stream;

});

gulp.task('zip', ['addjs'], function() {
  var stream = gulp.src('tmp/index.html')
      .pipe(zip('game.zip'))
      .pipe(gulp.dest('.'));

  return stream;
});


gulp.task('unzip', ['zip'], function() {
  var stream = gulp.src('game.zip')
      .pipe(unzip())
      .pipe(gulp.dest('.'));

  return stream;
});


gulp.task('clean', ['unzip'], function() {
  var stream = gulp.src('tmp/')
        .pipe(rimraf());


  return stream;
});

gulp.task('report', ['clean'], function() {
  var stat = fs.statSync('game.zip'),
      limit = 1024 * 13,
      size = stat.size,
      remaining = limit - size,
      percentage = (remaining / limit) * 100;

  percentage = Math.round(percentage * 100) / 100

  console.log('\n\n-------------');
  console.log('BYTES USED: ' + stat.size);
  console.log('BYTES REMAINING: ' + remaining);
  console.log(percentage +'%');
  console.log('-------------\n\n');
});


gulp.task('encodeAll', function() {

  var files = fs.readdirSync('a'),
      ext = '.gif',
      re = /\"/gi,
      encoded = {},
      output = '$.data.i = ',
      totalImages = 0,
      n;

  var encode = function(img) {

    var i =  fs.readFileSync(img);
    i = i.toString('base64').replace('R0lGODlh', '');
    console.log(i);

    return i;
  }

  for (n in files) {
    if (files[n].indexOf(ext) !== -1) {
      encoded[files[n].replace(ext, '')] = encode('a/'+files[n]);
      totalImages += 1;
    } 

  }

  encoded = JSON.stringify(encoded);
  encoded = encoded.replace(re, "'");
  output += encoded + ';';

  // console.log(output);
  console.log('IMAGES ENCODED');
  console.log('BYTES: ' + output.length);
  console.log('IMAGES: ' + totalImages);


  fs.writeFileSync('js/game/data/i.js', output);


});


gulp.task('encode', function()  {

  var img = argv.img;

  if (!img) {
    console.log('USAGE: gulp encode --img=<IMG>');
    return;
  }

  fs.readFile(img, function(err, original_data){
      var base64Image = original_data.toString('base64');
      var append = 'data:image/gif;base64,';
      console.log(append+base64Image);
  });
  
});

gulp.task('lint', function() {
  return gulp.src([ 'js/**', '!js/lib/**' ]).pipe(eslint({
    'parserOptions': {
        'ecmaVersion': 6,
    },
    'rules':{
        'camelcase': 1,
        'comma-dangle': 2,
        'quotes': [1, 'single'],
        'semi': [1, 'always']
    }
  }))
  .pipe(eslint.format())
  // Brick on failure to be super strict
  .pipe(eslint.failOnError());
});


