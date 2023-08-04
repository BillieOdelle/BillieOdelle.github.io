// // Get the Roadster endpoint
const roadster = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the JSON data and console log it
d3.json(roadster).then(function(data) {
  console.log(data);
});

// Initialize the dashboard at start up 
function init() {

    // Use D3 to select the dropdown menu
    let dropdown = d3.select("#selDataset");

    // Use D3 to get sample names and populate the drop-down selector
    d3.json(roadster).then((data) => {
        
        // Set a variable for the sample names
        let names = data.names;

        // Add  samples to dropdown menu
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);

            dropdown.append("option").text(id).property("value",id);});

        // Set the first sample from the list
        let samples = names[0];

        // Log the value of sample_one
        console.log(samples);

        // Build the initial plots
        Metadata(samples);
        BarChart(samples);
        BubbleChart(samples);
   });
};

// Function that populates metadata info
function Metadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(roadster).then((data) => {

        // Retrieve all metadata
        let metadata = data.metadata;

        // Filter based on the value of the sample
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        d3.select("#sample-metadata").selectAll("*").remove();
        
        Object.entries(valueData).forEach(([key,value]) => {

            // Add the individual key/value pairs, being appended to the metadata list
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });

};


// Function that builds the bar chart
function BarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(roadster).then((data) => {

        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let sampleData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = sampleData.otu_ids;
        let otu_labels = sampleData.otu_labels;
        let sample_values = sampleData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"
        };

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)
    });
};

// Function that builds the bubble chart
function BubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(roadster).then((data) => {
        
        // Retrieve all sample data
        let sampleInfo = data.samples;

        // Filter based on the value of the sample
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let valueData = value[0];

        // Get the otu_ids, lables, and sample values
        let otu_ids = valueData.otu_ids;
        let otu_labels = valueData.otu_labels;
        let sample_values = valueData.sample_values;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for bubble chart
        let trace1 = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        // Set up the layout
        let layout = {
            title: "Bacteria Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
        };

        // Call Plotly to plot the bubble chart
        Plotly.newPlot("bubble", [trace1], layout)
    });
};

// Function that updates dashboard when sample is changed
function optionChanged(value) { 

    // Log the new value
    console.log(value); 

    // Call all functions 
    Metadata(value);
    BarChart(value);
    BubbleChart(value);
    
};

// Call the initialize function
init();
