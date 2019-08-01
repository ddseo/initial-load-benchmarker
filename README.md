# initial-load-benchmarker
Measures the first-time load speed for dev.mensio.com. Used to measure the impact of bundling policy on performance.

## Setup
```
$ npm i
```

## Usage
First start a headless instance of chrome with debug port set to `9222`.
There's a script set up to do this with OSX:
```
$ npm run headless-chrome
```
Once the chrome instance is running, run the benchmark with:
```
$ npm run benchmarker
```
