  //d3 setup 
  var margin = {top: 50, right: 40, bottom: 100, left: 100},
    xsize = 550, ysize=300, 
    width = xsize - margin.left - margin.right,
    height = ysize - margin.top - margin.bottom;

  //foramtter for big text on charts
  var textFormatter = d3.format(".1f");


  //clears all charts out of the main div
  var clearAllCharts = function() { $("#charts").empty() };

  /////////////////////////////////////////////////
  ////  Make a plot given the targetID        /////
  /////////////////////////////////////////////////

  
  var drawTimeseries = function(targetID, data) {
       //dump the old one and re draw an svg
      //d3.select("svg").remove();
      //removeAllCharts()
      // var idx = App.dataController.get("idx");
      // var thisdata = App.dataController.get("currentData")[idx];
      // var data = jQuery.extend(true, {}, thisdata);
      // var key = thisdata.key
      // var data = data.data

      //var svg = d3.select(targetID)
      var svg = d3.select("#"+targetID).append("svg")
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      /* For the drop shadow filter... */
      var defs = svg.append("defs");

      var filter = defs.append("filter")
          .attr("id", "dropshadow")

      filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 4)
          .attr("result", "blur");
      filter.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 2)
          .attr("dy", 2)
          .attr("result", "offsetBlur");

      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
          .attr("in", "offsetBlur")
      feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");


      var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;

      data.forEach(function(d){ 
         d.timestamp = parseDate(d.timestamp);
        })

      var x = d3.time.scale()
          .range([0, width], .1);

      var y = d3.scale.linear()
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");
      
      var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

      var lastPointValue = data[data.length -1 ].value
      var xdomain = d3.extent(data, function(d) { return d.timestamp; });
      var ydomain = d3.extent(data, function(d) { return d.value; });
      x.domain(xdomain);
      y.domain(ydomain);

      // console.log(xdomain, ydomain);
      // console.log(y(ydomain[0]))

      var mean_y = d3.mean(data, function(d) {return d.value});

      var colors = d3.scale.category20();

      var line = d3.svg.line()
        .x(function(d) { return x(d.timestamp); })
        .y(function(d) { return y(d.value); });
      
     
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end") 
      
      var area = d3.svg.area()
        .x(function(d) { return x(d.timestamp); })
        .y0(height)
        .y1(function(d) { return y(d.value); })

      svg.append("path")
          .datum(data)
          .attr("class", "line")
          //.attr("filter", "url(#dropshadow)")
          .attr("d", line)
        .transition().delay(function(d) { return d} )
          //.transition().delay(100)
          .duration(2500)
          //.attr("fill-opacity", "1.0")
          .attr("stroke-opacity", "1.0");
       

      svg.append("path")
          .datum(data)
          .attr("class", "area")
          .attr("d", area)
          // .attr("filter", "url(#dropshadow)")
        .transition().delay(function(d) { return d} )
          //.transition().delay(100)
          .duration(1500)
          //.attr("fill-opacity", "1.0")
          .attr("fill-opacity", "1.0");
      
      // svg.selectAll("line")
      //     .attr("stroke", function() { 
      //       var i = Math.floor(Math.random()*21);
      //       return colors(i);
      //     });

      //figure out if its a % or kbs by the key name
      if ( key.indexOf("tx") !== -1 || key.indexOf("rx") !== -1 ) {
         var label = "Kbs"
      } else {
         var label = "%"
      }
    
      if (lastPointValue > 75) {
        var color = "yellow"
      } else {
        var color = "cyan"
      }

      svg.append("text")
        .text(textFormatter(lastPointValue)+label)
        .attr("filter", "url(#dropshadow)")
        .attr("x", x(xdomain[0])/1.0)
        .attr("y", y(ydomain[0])/5.0)
        .attr("class", "big-text")
        .style("fill", color)

        // xlabel
      svg.append("text")
        .attr("class", "xlabel")
        .attr("text-anchor", "middle")
        .attr("x", width/2 )
        .attr("y", height + margin.bottom/2)
        .text(key);

      var idx = App.dataController.get("idx")
      if (idx == App.dataController.get("currentData").length-1) {
          App.dataController.set("idx", 0) 
        }
      else { 
        App.dataController.set("idx", idx+1)
      }
    }
  });