# pdy-resizable
A CSS3 + HTML5 Resizable Trial

## Motivation
Trying to implement a resizable feature without the help of handle element(as implemented in some frameworks such as jQueryUI), 
because a handle element with absolute position introduces redundant semantics and z-index conflicts

## Known issues of this implementation
* The browser must support HTML5/CSS3, to name a few: transform matrix, getComputedStyle
* In order to support the resizing movement outside the rectangle of a resized element, pseudo-element must be used. 
* Boundary calculation based on mouse coordinates is complex

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
## Source code
All source code is in /src/

