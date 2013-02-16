$(document).ready(function() {

    //WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
    WEB_SOCKET_DEBUG = true;

    // Socket.io specific code
    var cpusocket = io.connect('/cpu');
    var memsocket = io.connect('/mem');

    // Setup plot
    var options = {
        series: { shadowSize: 0 }, // drawing is faster without shadows
        yaxis: { min: 0, max: 100 },
        xaxis: { show: false }
    };

    // For formatting the plot data
    var enumerate = function(l) {
        var res = [];
        for (var i=0; i<l.length; ++i)
            res.push([i, l[i]])
        return res;
    };

    // Initial plot data is a bunch of 0's
    var cpudata = [];
    for (var i=0; i<300; i++)
        cpudata.push(0);

    // Initial plot data is a bunch of 0's
    var memdata = [];
    for (var i=0; i<300; i++)
        memdata.push(0);

    // Create the inital graph
    var cpuplot = $.plot($('#cpugraph'), [{data: enumerate(cpudata)}], options);
    var memplot = $.plot($('#memgraph'), [{data: enumerate(memdata)}], options);

    // Update the graph when we get new data from the server
    cpusocket.on('cpu_data', function(data) {
        cpudata = cpudata.slice(1);
        cpudata.push(data.point);
        cpuplot.setData([{data: enumerate(cpudata)}]);
        cpuplot.draw();
    });

    // Update the graph when we get new data from the server
    memsocket.on('mem_data', function(data) {
        memdata = memdata.slice(1);
        memdata.push(data.point);
        memplot.setData([{data: enumerate(memdata)}]);
        memplot.draw();
    });

});


