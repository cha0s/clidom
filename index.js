
var fs = require('fs');
var url = require('url');

var cheerio = require('cheerio');
var cssWhat = require('css-what');
var request = require('request');

var argv = require('yargs')
  .usage('Usage: $0 selector [URL] [options]')

  // Make sure a CSS selector is specified.
  .check(function(argv) {

    if (0 === argv._.length) {
      return "Missing CSS selector";
    }

    return true;
  })

  .describe('o', 'File to write JSON output')
  .default('o', '-', "'-' (stdout)")
  .alias('o', 'out-file')

  .describe('p', 'Pretty JSON output')
  .boolean('p')
  .default('p', true)
  .alias('p', 'pretty')

  .describe('t', 'Trim empty results')
  .boolean('t')
  .default('t', true)
  .alias('t', 'trim')

  .help('h')
  .alias('h', 'help')

  .epilog(
    'See https://github.com/cha0s/clidom for examples and documentation.'
  )

  .showHelpOnFail(false, "Specify --help for available options")
  .argv
;

// Selector is the first token.
var selectors = argv._.shift();

// URL was passed? HTTP request.
if (argv._.length > 0 && url.parse(argv._[0]).hostname) {
  request(argv._[0], function(error, response, body) {
    processDom(body);
  });
}

// Otherwise, from stdin.
else {
  var body = '';
  process.stdin.on('data', function(chunk) {
    body += chunk.toString('utf8');
  });
  process.stdin.on('end', function() {
    processDom(body);
  });
}

// Parse a DOM from a string using cheerio.
function processDom(string) {
  var $ = cheerio.load(string);

  // Map selectors to the results.
  var object = {};

  selectors = selectors.split(',')
  for (var i in selectors) {

    // If the selector contains ::, it's both a selector and a subselector.
    var selector = selectors[i].trim();
    var values = object[selector] = object[selector] || [];

    var subselector = null;
    if (~selector.indexOf('::')) {
      var parts = selector.split('::');
      selector = parts[0];
      subselector = parts[1];
    }

    $(selector).each(function(index, element) {
      var value = {};

      // Subselector used to extract parts from matched elements.
      if (subselector) {

        switch (subselector) {

          // Return inner HTML.
          case 'innerHtml':
            value = $(element).html();
            break;

          // Return outer HTML.
          case 'outerHtml':
            value = $.html(element);
            break;

          // Return text (strip tags).
          case 'text':
            value = $(element).text();
            break;

          // It's a CSS selector.
          default:

            var parsed = cssWhat(subselector);
            for (var j in parsed) {
              var parsedSelector = parsed[j];
              for (var k in parsedSelector) {
                var what = parsedSelector[k];

                // Attribute selector? Extract the attribute value.
                switch (what.type) {
                  case 'attribute':
                    value[what.name] = $(element).attr(what.name);
                    break;
                }
              }
            }
        }
      }

      // Otherwise, take the inner HTML of the selected elements.
      else {
        value = $(element).html();
      }

      // Push the value unless trimming and it's empty.
      if (!argv.t || value) {
        values.push(value);
      }
    })
  }

  // Outfile defaults to stdout.
  var stream;
  if ('-' === argv.o) {
    stream = process.stdout;
  }

  // Otherwise, stream to specified filename.
  else {
    stream = fs.createWriteStream(argv.o);
  }

  var args = [object];

  // Prettify the JSON?
  if (argv.p) args.push(null, '  ');
  stream.write(JSON.stringify.apply(JSON, args));
}
