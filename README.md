# Parse a DOM from the command line

## Installation

```bash
npm install clidom
```

## Usage

```bash
Usage: clidom selector [URL] [options]

Options:
  -o, --out-file  File to write JSON output              [default: '-' (stdout)]
  -p, --pretty    Pretty JSON output
  -h, --help      Show help

Examples:
  clidom a http://www.google.com    output a json object of all the links on
                                    http://www.google.com to stdout

```
