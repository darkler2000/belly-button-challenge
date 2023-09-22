let link = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(link).then(function(data) {

    d3.select("#selDataset")
    .selectAll("option")
    .data(data.names)
    .enter()
    .append("option")
    .text(d=>d)
    .attr("value",d=>d);

optionChanged(d3.select("#selDataset").property("value"));
    
  });

  // create bar chart
  function barChart(x,y,text) {
    let barData = [{
        type: 'bar',
        x: x,
        y: y,
        text: text,
        orientation: 'h'
    }];

    let layout = {
        title: "Top 10 OTUs"
      };

    Plotly.newPlot('bar', barData, layout);
  }

  // create bubble chart
  function bubbleChart(x,y,text) {
    let bubData = [{
        x: x,
        y: y,
        text: text,
        mode: 'markers',
        marker: {
            size: y,
            color: x.map(value=>value)
        }
    }];
    var layout = {
        title: "OTU Values",
        xaxis: {
            title: {
                text: 'OTU ID',
            }
        }
    };
    Plotly.newPlot('bubble', bubData, layout);
  }

  // create gague chart
  function gaugeChart(num) {
    var gauData = [{
        domain : {x: [0,1], y: [0, 1]},
        value: num,
        title: "Weekly Belly Button Washing Frequency",
        type: "indicator",
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 10]},
            bar: {color: "#ecfefd"},
            steps: [
                {range: [0, 1], color:"#0df2eb"},
                {range: [1, 2], color:"#0cdfd9"},
                {range: [2, 3], color:"#0bcdc7"},
                {range: [3, 4], color:"#0abab5"},
                {range: [4, 5], color:"#09a7a3"},
                {range: [5, 6], color:"#089591"},
                {range: [6, 7], color:"#07827f"},
                {range: [7, 8], color:"#06706d"},
                {range: [8, 9], color:"#055d5a"}
            ],
        }
    }];
    Plotly.newPlot('gauge', gauData);
  }

  function Meta(data) {
    let div = d3.select('#sample-metadata');
    div.html("")
    let list = div.append("ul");
    Object.entries(data).forEach(([key, value]) => {
        list.append("li").text(key + ": " + value);
    });
  }

  function optionChanged(value) {
    d3.json(link).then(function(incomingData) {
        let metadata = incomingData.metadata.filter(data => data.id == value);
        console.log(metadata);

        let sample = incomingData.samples.filter(data => data.id == value);
        console.log(sample);

        barChart(sample[0].sample_values.slice(0,10).reverse(), sample[0].otu_ids.slice(0,10).reverse().map(a=>"OTU " +a), sample[0].otu_labels.slice(0,10).reverse());
        bubbleChart(sample[0].otu_ids, sample[0].sample_values, sample[0].otu_labels);
        Meta(metadata[0]);
        gaugeChart(metadata[0].wfreq);
    });
  }