function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = "/metadata/"+sample;
  console.log(url);

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response) {
    // console.log(response);
    // var numOfRecords = Object.keys(response).length;
    // console.log(numOfRecords);

    // Use d3 to select the panel with id of `#sample-metadata`
    var html = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    html.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var table = html.append("table");
    var tbody =  table.append("tbody");
    var trow;

      trow = tbody.append("tr");
      Object.entries(response).forEach(([key, value]) => {
        trow = tbody.append("tr");
        var td = trow.append("td").text(`${key}: `);
        trow.append("td").text(` ${value}`);
        // console.log(`${key}: ${value}`);
      });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
});
}

function buildCharts(sample) {
  var chartUrl = "/samples/"+sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(chartUrl).then(function(sampleData) {
    // console.log(sampleData);
    // @TODO: Build a Bubble Chart using the sample data
    var otu_ids = sampleData.otu_ids;
    var sample_values = sampleData.sample_values;
    var otu_labels = sampleData.otu_labels;

      
    var trace1 = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values,
        colorscale: "Earth"
      }
    };
    
    var data = [trace1];
    
    var layout = {
      xaxis: {
        title: {
          text: 'OTU ID'}},
      showlegend: false
      // height: 600,
      // width: 600
    };
    
    Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var otu_ids_10 = otu_ids.slice(0,10);
    var sample_values_10 = sample_values.slice(0,10);
    var otu_labels_10 = otu_labels.slice(0,10);

    var trace2 = {
    labels: otu_ids_10,
    values: sample_values_10,
    hoverinfo: otu_labels_10,
    type: 'pie'
  };

  var data = [trace2];

  Plotly.newPlot("pie", data);

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
