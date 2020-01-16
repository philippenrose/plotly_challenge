function buildMetadata(sample) {
    d3.json(`/metadata/${sample}`).then((data) => {
      var mdata = d3.select("#sample-metadata");
      mdata.html("");
      Object.entries(data).forEach(([key, value]) => {
       var moutput = mdata.append("h6");
       moutput.text(`${key}:${value}`);
      });
});
};

function buildCharts(sample) {
  console.log("ran buildCharts");
  d3.json(`/samples/${sample}`).then((sampledata) => {

    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: sampledata.otu_ids,
      y: sampledata.sample_values,
      text: sampledata.otu_labels,
      mode: 'markers',
      marker: {
        color: sampledata.otu_ids,
        size: sampledata.sample_values,
        opacity: 1
      }
    };

    var pieData = [trace1];
    
    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };
    
    Plotly.newPlot('bubble', pieData, layout);

    // @TODO: Build a Pie Chart
    const value10 = sampledata.sample_values.slice(0,10);
    const label10 = sampledata.otu_ids.slice(0,10);
    const hovertext10 = sampledata.otu_labels.slice(0,10);

    var pieData = [{
      values: value10,
      labels: label10,
      hovertext: hovertext10,
      type: 'pie'
    }];

    var layout2 = {
      height: 500,
      width: 500
    };
  Plotly.newPlot('pie', pieData, layout2);
});
};

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
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();