# initial-load-benchmarker
Measures the first-time load speed for dev.mensio.com. Used to measure the impact of bundling policy on performance.

Currently, results are directly outputted to the CLI. In the future, may add support for automatic generation of infographics and reports.

## Setup
```
$ npm i
```

## Usage
Run the benchmark with:
```
$ npm run benchmarker -- --url URLNAME --sampleSize SAMPLESIZE
```
