## Documentation

### Events (Internal use)
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