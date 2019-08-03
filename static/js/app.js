function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  var defaultURL = (`/metadata/${sample}`);

  // DEBUGGER TO CHECK URL
  // d3.json(defaultURL);

  // Promise to get info from the Route and pass that data to an in line function to pupulate the metadata panel
  d3.json(defaultURL).then(function (meta) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var panelBody = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    panelBody.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(meta).forEach(([key, value]) => {

      //DEBUGGER TO CHECK VALUES
      //console.log(value)

      // Print each key-value in the metadata to the pannel
      panelBody.append("h6").text(`${key}: ${value}`);

    });




    //*********Build the Gauge Chart*************


    // Get the Belly Button Wash Frequency from the metadata and store it into our level variable
    var level = meta.WFREQ;

        // Trig to calc meter point
        var degrees = 180 - (level*19),
        radius = .7;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
    /////////Do the math for the gauge so it move the appropriate amount the the Wash Frequency on the chart

    //*******Another method from stacked overflow I was working on.... */
    // // Trig to calc meter point
    // var degrees = 50,
    //   radius = .9;
    // var radians = degrees * Math.PI / 180;
    // var x = -1 * radius * Math.cos(radians) * meta.WFREQ;
    // var y = radius * Math.sin(radians);

    // Path: may have to change to create a better triangle
    var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
    var path = mainPath.concat(pathX, space, pathY, pathEnd);

    var data = [{
      type: 'scatter',
      x: [0], y: [0],
      marker: { size: 28, color: '850000' },
      showlegend: false,
      name: 'speed',
      text: level,
      hoverinfo: 'text+name'
    },

     
    // Set the values and lebels for the guage chart
    {
      values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      textinfo: 'text',
      textposition: 'inside',
      marker: {
        colors: ['rgb(0, 51, 25)', 'rgb(0, 102, 51)', 'rgb(0, 153, 76)', 'rgb(0, 204, 102)', 
                'rgb(0, 255, 128)', 'rgb(51, 255, 153)', 'rgb(100, 255, 178)', 'rgb(153, 255, 204)','rgb(204, 255, 229)', 'rgb(255, 255, 255)'],
        // colors: ['', '', '', '', '', '', '', '', '', 'rgb(255, 255, 255)']
      },
      labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
      hoverinfo: 'label',
      hole: .5,
      type: 'pie',
      showlegend: false
    }];


    // Complete the layout, title, and sizing etc...
    var layout = {
      shapes: [{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
      title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
      height: 600,
      width: 600,
      xaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      },
      yaxis: {
        zeroline: false, showticklabels: false,
        showgrid: false, range: [-1, 1]
      }
    };


    // Plot guage chart and attatch to the 'guage' ID in the HTML
    Plotly.newPlot('gauge', data, layout);
  });

}






function buildCharts(sample) {

  // Use `d3.json` to fetch the sample data for the plots
  var defaultURL = (`/samples/${sample}`);
  d3.json(defaultURL);


  // Promise to get info from the Route and pass that data to an in line function to pupulate the Bubble and Pie charts
  d3.json(defaultURL).then(function (response) {

    // Create variables for cleaner code in the traces for the charts
    var sampleValuesRaw = response.sample_values;
    var outIdsRaw = response.otu_ids;
    var labelsRaw = response.otu_labels;

    // DEBUGGER TO CHECK VALUES
    //console.log(valuesRaw)





    // *********Build Bubble Chart***********

    // Create trace for bubble plot
    var bubbleTrace = {
      x: outIdsRaw,
      y: sampleValuesRaw,
      text: labelsRaw,
      mode: 'markers',
      marker: {
        color: outIdsRaw,
        size: sampleValuesRaw
      }
    };


    // Put trace into a list for plotting
    var bubbleData = [bubbleTrace];


    //  Create the layout for chart sizing
    var bubbleLayout = {
      title: "All Sample Distribution for ID",
      titlefont: { size: 36 },
      showlegend: false,
      height: 750,
      width: 1300
    };

    // Plot bubble chart and attatch to the 'bubble' ID in the HTML
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);





    // *********Build Pie Chart***********
    //Use slice() to grab the top 10 sample_values, otu_ids, and labels (10 each). 
    var pieTrace = {
      values: sampleValuesRaw.slice(0, 10),
      labels: outIdsRaw.slice(0, 10),
      hovertext: labelsRaw.slice(0, 10),
      type: 'pie'
    };

    // Put trace into a list for plotting
    var pieData = [pieTrace];

    //  Create the layout for chart sizing
    var pieLayout = {
      title: "Top Ten Samples from ID",
      titlefont: { size: 26 },
      height: 500,
      width: 500
    };

    // Plot pie chart and attatch to the 'pie' ID in the HTML
    Plotly.newPlot("pie", pieData, pieLayout);
  });

}




function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}




// Initialize the dashboard
init();
