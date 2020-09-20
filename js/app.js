let url =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";

let colorScale = [
  { name: "Action", color: "#55efc4" },
  { name: "Drama", color: "#81ecec" },
  { name: "Adventure", color: "#74b9ff" },
  { name: "Family", color: "#a29bfe" },
  { name: "Animation", color: "#fab1a0" },
  { name: "Comedy", color: "#ff7675" },
  { name: "Biography", color: "#fd79a8" },
];

let movieData;

let width = 1000,
  height = 600,
  padding = 60;

let svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

let tooltip = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

let drawTreeMap = () => {
  // Create hierarchy
  let hierarchy = d3
    .hierarchy(movieData, (d) => d.children)
    .sum((d) => d.value)
    .sort((node1, node2) => node2.value - node1.value);

  let createTreeMap = d3.treemap().size([width, height]).paddingInner(2);

  createTreeMap(hierarchy);

  let movieTiles = hierarchy.leaves();

  // Create a "g" group element for each movieTiles array elements
  let cell = svg
    .selectAll("g")
    .data(movieTiles)
    .enter()
    .append("g")
    .attr("transform", (d) => "translate(" + d.x0 + "," + d.y0 + ")");

  // Add rectangles to "g" group elements
  cell
    .append("rect")
    .attr("width", (d) => d.x1 - d.x0)
    .attr("height", (d) => d.y1 - d.y0)
    .attr("class", "tile")
    .attr("fill", (d) => {
      let category = d.data.category;
      return colorScale.find((d) => d.name == category).color;
    })
    .attr("data-name", (d) => d.data.name)
    .attr("data-category", (d) => d.data.category)
    .attr("data-value", (d) => d.data.value)
    .on("mouseover", (d) => {
      tooltip
        .html(
          "Title: " +
            d.data.name +
            "<br>" +
            "Category: " +
            d.data.category +
            "<br>" +
            "Value: " +
            d.data.value
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px")
        .style("opacity", 0.9)
        .attr("data-value", d.data.value);
    })
    .on("mouseout", (d) => {
      tooltip.style("opacity", 0);
    });

  // Use tspan to allow line breaks
  cell
    .append("text")
    .selectAll("tspan")
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", (d, i) => 4)
    .attr("y", (d, i) => 12 + i * 10)
    .style("font-size", "0.7em")
    .text((d) => d);
};

let createLegend = () => {
  let legend = svg
    .append("g")
    .attr("id", "legend")
    .selectAll("g")
    .data(colorScale)
    .enter()
    .append("g")
    .attr("transform", "translate(200, 650)");

  legend
    .append("rect")
    .attr("class", "legend-item")
    .attr("width", 80)
    .attr("height", 30)
    .attr("x", (d, i) => i * 90)
    .attr("y", 0)
    .attr("fill", (d, i) => d.color);

  legend
    .append("text")
    .text((d) => d.name)
    .attr("x", (d, i) => 39 + i * 90)
    .attr("y", -10)
    .attr("text-anchor", "middle");
};

d3.json(url).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    movieData = data;
    drawTreeMap();
    createLegend();
  }
});
