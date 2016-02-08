# pdy-resizable
A CSS3 + HTML5 Resizable Trial

## Motivation
Trying to implement a resizable feature without the help of handle element(as implemented in some frameworks such as jQueryUI), 
because a handle element with absolute position introduces redundant semantics and z-index conflicts

## Known issues of this implementation
* The browser must support HTML5/CSS3, to name a few: transform matrix, getComputedStyle
* In order to support the resizing movement outside the rectangle of a resized element, a absolute-positioned pseudo-element must be used. 
  And in this case the element must has relative position 
* Boundary calculation based on mouse coordinates and element rectangles is complex

[Check online example on jsfiddle](https://jsfiddle.net/pandazy/orLdtv0g/)


## Setup
### Require NodeJS (>=5)
###Install dependencies
```cmd
> npm install
```
### Compile and run local server
```cmd
> gulp serve
```
All compiled code will be in \<rootDir\>/build/dev
### Run test cases
```cmd
> npm test
```
#### something about test cases
* used [Jest](http://facebook.github.io/jest/) with its [Jasmine 2](http://jasmine.github.io/2.0/introduction.html) support
* added a customized matcher [toBeImmutable](https://github.com/pandazy/pdy-resizable/blob/master/test_lib/immutableMatcher.js)
* in [test/lib](https://github.com/pandazy/pdy-resizable/blob/master/test_lib/index.js) there are some methods used to enhance test cases
  such as adding description to make it more meaningful and check expectation amount to make sure no feature is missed.

## Source code
All source code is in [/src/](https://github.com/pandazy/pdy-resizable/tree/master/src/)

