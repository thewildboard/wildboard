# Dashboard

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


## Run

To run the application:

    node ./

The server is at `https://localhost:3000/`

To run the tests:

    npm test


##Documentation

###Events (Internal use)
To add dinamic functionality we have created events on the project. These events supports more than one callback
The core includes the functions on and call, and they should be used like this:
```javascript
core.on('serverSetup', function(data){
    //'data' contains the possible attributes that will come from the event.
    //Anything can be returned, and it will be received as an array of results.
    return ""; 
});

//To call an event just use the function 'call' and pass the attributes you want.
var results = core.call('serverSetup', data);
//results contains all the results from the events inside an array.
```

## Issues

Let us know your suggestions and bugs found to improve Dashboard [here!](https://github.com/h4ckademy/dashboard_back/issues)!

[https://github.com/h4ckademy/dashboard_back/issues](https://github.com/h4ckademy/dashboard_back/issues)

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

