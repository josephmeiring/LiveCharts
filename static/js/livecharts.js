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
    //var cpuplot = $.plot($('#cpugraph'), [{data: enumerate(cpudata)}], options);
    //var memplot = $.plot($('#memgraph'), [{data: enumerate(memdata)}], options);

    // Update the graph when we get new data from the server
    cpusocket.on('cpu_data', function(data) {
        cpudata = cpudata.slice(1);
        cpudata.push(data.point);
        //cpuplot.setData([{data: enumerate(cpudata)}]);
        //cpuplot.draw();
        cputick(cpudata);
    });

    // Update the graph when we get new data from the server
    memsocket.on('mem_data', function(data) {
        memdata = memdata.slice(1);
        memdata.push(data.point);
        //memplot.setData([{data: enumerate(memdata)}]);
        //memplot.draw();
        memtick(memdata);
    });



  //D3 stuff
  var margin = {top: 10, right: 10, bottom: 20, left: 40},
      width = 460 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
   
  var x = d3.scale.linear()
      .domain([0, cpudata.length])
      .range([0, width]);
   
  var y = d3.scale.linear()
      .domain([0, 100])
      .range([height, 0]);
   
  var line = d3.svg.line()
      .x(function(d, i) { return x(i); })
      .y(function(d, i) { return y(d); });
   
  var cpusvg = d3.select("#d3cpugraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  cpusvg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
   
  cpusvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
   
  cpusvg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));
   
  var cpupath = cpusvg.append("g")
       .attr("clip-path", "url(#clip)")
      .append("path")
       .data([cpudata])
       .attr("class", "line")
       .attr("d", line);





var memsvg = d3.select("#d3memgraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  memsvg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);
   
  memsvg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"));
   
  memsvg.append("g")
      .attr("class", "y axis")
      .call(d3.svg.axis().scale(y).orient("left"));
   
  var mempath = memsvg.append("g")
       .attr("clip-path", "url(#clip)")
      .append("path")
       .data([memdata])
       .attr("class", "line")
       .attr("d", line);


  

  
  function cputick(data) {

    console.log(data);
    // redraw the line, and slide it to the left
    cpupath.attr("d", line)
        .attr("transform", null)
        .data([data])
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")")

  }


  function memtick(data) {
    
    // redraw the line, and slide it to the left
    mempath.attr("d", line)
        .attr("transform", null)
        .data([data])
      .transition()
        .duration(1000)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")")

  }

});


