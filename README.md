# initial-load-benchmarker
CLI to measure the first-time load speed and related metrics for any website. Originally created to measure the impact of bundling policy on performance.

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
    
    
## Output
Metrics printed to the command line:

    Network Load time                       Time for all network requests to return
    DOMContentLoaded time                   Time for Chrome's DOMContentLoaded event to fire
    
Files created in a new subfolder of the `/build` directory:

    HAR                                     Aggregate HAR file of all pings
    Network Load Graph                      Histogram displaying Network Load time distribution

Additional metrics and infographics can be generated - don't hesitate to ask if you need them
