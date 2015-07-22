# WildBoard
##### An open source, api-ready dashboard for you app

![wildboard](https://raw.githubusercontent.com/thewildboard/wildboard/master/docs/logos/logo.png)

[![Build Status](https://travis-ci.org/thewildboard/wildboard.svg)](https://travis-ci.org/thewildboard/wildboard)

----

## Install

Install Node.js and MongoDB on your system. For Linux machines it'd be something like this:

    sudo apt-get install node mongodb

Install project dependencies:

    npm install

Generate self-signed server certificates:

    mkdir ssl && cd ssl
    openssl genrsa -out server-key.pem 2048
    openssl req -new -sha256 -key server-key.pem -out server-csr.pem
    openssl x509 -req -in server-csr.pem -signkey server-key.pem -out server-cert.pem
    rm server-csr.pem

Generate the config and modify it to your requirements:
    
    node ./ -g config

The file config.js will be created on the main folder.


## Run

To run the application:

    node ./

The server is at `https://localhost:3000/`

To run the tests:

    npm test


##Documentation

[https://github.com/thewildboard/wildboard/blob/master/docs/README.md](https://github.com/thewildboard/wildboard/blob/master/docs/README.md)

## Issues

WildBoard is currently in heavy development, if you want to help let us know your suggestions and bugs found [here!](https://github.com/thewildboard/wildboard/issues)!

[https://github.com/thewildboard/wildboard/issues](https://github.com/thewildboard/wildboard/issues)

## License

The MIT License (MIT)

Copyright (c) 2014-2015 @muitxer (https://github.com/muit)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

