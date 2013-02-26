$(document).ready(function() {

    //WEB_SOCKET_SWF_LOCATION = "/static/WebSocketMain.swf";
    //WEB_SOCKET_DEBUG = true;

    // Socket.io specific code
    var cpusocket = io.connect('/cpu');
    var memsocket = io.connect('/mem');

    var cpudata = [];
    for (var i=0; i<31; i++)
        cpudata.push(0);

    // Initial plot data is a bunch of 0's
    var memdata = [];
    for (var i=0; i<31; i++)
        memdata.push(0);


    // Create the inital graph
    //var cpuplot = $.plot($('#cpugraph'), [{data: enumerate(cpudata)}], options);
    //var memplot = $.plot($('#memgraph'), [{data: enumerate(memdata)}], options);

    // Update the graph when we get new data from the server
    cpusocket.on('cpu_data', function(data) {
        //cpudata = cpudata.slice(1);
        //cpudata.push(data.point);
        cpudraw(data);
    });

    // Update the graph when we get new data from the server
    memsocket.on('mem_data', function(data) {
        //memdata = memdata.slice(1);
        //memdata.push(data.point);
        memdraw(data);
    });

  //D3 stuff
  var margin = {top: 20, right: 10, bottom: 20, left: 40},
      width = 460 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;
   
  var x = d3.scale.linear()
      .domain([0, cpudata.length-1])
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
       .attr("id", "cpuclip")
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
       .attr("clip-path", "url(#cpuclip)")
      .append("path")
       .data([cpudata])
       .attr("class", "line")
       .attr("d", line);

  cpusvg.append("text")
      .text("CPU Usage")
      .attr("class", "title")
      .attr("x", x(0))
      .attr("y", y(100))


  var memsvg = d3.select("#d3memgraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
   
  memsvg.append("defs").append("clipPath")
       .attr("id", "memclip")
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
       .attr("clip-path", "url(#memclip)")
      .append("path")
       .data([memdata])
       .attr("class", "line")
       .attr("d", line);

  memsvg.append("text")
      .text("Memory Usage")
      .attr("class", "title")
      .attr("x", x(0))
      .attr("y", y(100))



  function cpudraw(data) {
    cpudata.push(data.point)
    // redraw the line, and slide it to the left
    cpupath.attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")")

    cpudata.shift()

  }



  function memdraw(data) {
   
    memdata.push(data.point)

    // redraw the line, and slide it to the left
    mempath.attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(5000)
        .ease("linear")
        .attr("transform", "translate(" + x(-1) + ")")

    memdata.shift()

   }

  



});


