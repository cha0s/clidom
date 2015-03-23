# Parse a DOM from the command line

Ever wanted to do a one-off scrape of a web page? Tired of writing scraping
boilerplate for applications and wish you had a nice UNIX-style command to call
to do it for you? Enter clidom!

## Installation

```bash
npm install -g clidom
```

## Usage

```bash
clidom selector [URL] [options]
```

## Selector specification:

selector[::subselector]

clidom extends selector syntax to allow you to not only select elements, but
mutate the elements as needed. clidom provides the following syntax for
subselectors:

- (default) `innerHtml` - Returns the element's inner HTML
- `outerHtml`           - Returns the element's outer HTML
- `text`                - Returns the text inside the element, stripping tags
- `[attribute]`         - Returns the value of the specified attribute

## Options

```bash
-o, --out-file  File to write JSON output              [default: '-' (stdout)]
-p, --pretty    Pretty JSON output                             [default: true]
-t, --trim      Trim empty results                             [default: true]
-h, --help      Show help
```

## Examples

Output a pretty JSON object of button labels on http://www.google.com:

```bash
clidom input[type="submit"]::[value] https://www.google.com
```

Output:

```bash
{
  "input[type=submit]::[value]": [
    {
      "value": "Google Search"
    },
    {
      "value": "I'm Feeling Lucky"
    }
  ]
}
```

Output a pretty JSON object of Twitter usernames talking about node.js:

```bash
clidom 'span.username b' 'https://twitter.com/search?f=realtime&q=node.js'
```

Output: (will vary over time)

```bash
{
  "span.username b": [
    "hashedrock",
    "mashupaward",
    "orangesuzuki",
    "RJ_Hsiao",
    "mongodbExpert",
    "JanilsonPy",
    "npm_tweets",
    "nodenpm",
    "npm_tweets",
    "StrongLoop",
    "DevelopersDojo",
    "adstweetbot",
    "Johnny_Rehab",
    "jramonleon",
    "questionjs",
    "AsadNomanMS",
    "amit_intelli",
    "rekkuuzadx",
    "npm_tweets",
    "adstweetbot"
  ]
}
```
