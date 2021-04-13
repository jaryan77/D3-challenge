var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData) {
  
    // parse data
    healthData.forEach(function(data) {
      data.income = +data.income;
      data.healthcare = +data.healthcare;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear().domain([d3.min(healthData, d => d.income) * 0.8, d3.max(healthData, d => d.income) * 1.2])
    .range([0, width]);
  
    // Create y scale function
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare) * 0.8, d3.max(healthData, d => d.healthcare) * 1.2])
      .range([height, 0]);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// append axes
    chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
    chartGroup.append("g")
    .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5")
    .classed("stateCircle",true);

// text of circles    
    chartGroup.append("g")
    .selectAll("text")
    .data(healthData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d.income))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("dy", 3)
    .attr("fill","black")
    .attr("opacity", ".5")
    .classed("text",true)
    .attr("text-anchor","middle");
  
// append text titles to axes    
    // x axis
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .text("Household Income")
    .attr("text-anchor","middle")
    .attr("fill","black")
    .attr("font-size", "16px")
    .style("font-weight", "bold");

     // append y axis
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - ((margin.left/2) +2))
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("HealthCare")
    .attr("fill","black")
    .attr("font-size", "16px")
    .style("font-weight", "bold");  

});