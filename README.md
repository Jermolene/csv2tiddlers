# CSV to JSON Conversion for TiddlyWiki

This repo contains a quick and dirty hack to convert CSV files into a JSON file that can be imported into TiddlyWiki.

## Pre-requisites

You'll need to install Node.js and npm from https://nodejs.org

## Installation

Clone or download this repository to a directory on your local machine.

From the repository directory run the following command to install dependencies:

```
npm install
```

## Execution

A demonstration CSV file is provided that contains data on the greatest films of all time [according to The Guardian](http://www.theguardian.com/news/datablog/2010/oct/16/greatest-films-of-all-time).

To convert the provided CSV file:

```
node ./convert.js
```

## Customisation

To use this tool with other CSV files you'll need to edit the source code of `convert.js` to reflect the fields present in the file. See the instructions in the source for more details.
