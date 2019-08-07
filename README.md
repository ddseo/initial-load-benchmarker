# initial-load-benchmarker
CLI to measure the first-time load speed and related metrics for any website. Originally created to measure the impact of bundling policy on performance.

Currently, the resulting HAR file is outputted in the directory `initial-load-benchmarker/build`, and metrics are outputted directly to the CLI. In the future, may add support for automatic generation of infographics and reports.

## Setup
```
$ git clone https://github.com/ddseo/initial-load-benchmarker.git
$ cd initial-load-benchmarker
$ npm i
```

## Usage
Run the benchmark with:
```
$ benchmark --url URLNAME --sampleSize SAMPLESIZE
```
Note: if you get an error similar to `-bash: benchmark: command not found`, your npm `$PATH` is likely misconfigured. Fix it or just use the following:
```
$ npm run benchmark -- --url URLNAME --sampleSize SAMPLESIZE
```
Options which can be provided:

    --url <URL>                             URL to test
    --samples, --sampleSize <sampleSize>    Number of times to load the URL
    --printHar,                             Flag to print the HAR file to stderr
