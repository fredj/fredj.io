var MS_IN_DAY = 1000 * 60 * 60 * 24;

var parseDate = d3.timeParse('%d.%m.%Y');

var parseAmount = function(str) {
  return parseFloat(str.replace(/CHF/g, '').replace(/ /g, ''));
};

// roi amount at a given date
var roiAt = function(at, d) {
  if (at <= d.investment_date) {
    return 0;
  } else if (at >= d.repayment_date) {
    return d.roi;
  } else {
    var days = (at - d.investment_date) / MS_IN_DAY;
    console.assert(days < d.duration);
    return days * d.roi / d.duration;
  }
};


// csv line parser
var row = function(d, i) {
  var investment_date = parseDate(d['Financed']);
  if (investment_date) {
    var roi = parseAmount(d['Return on investment']);
    var investment = parseAmount(d['Investment']);
    var repayment_date =  parseDate(d['Repayment date']);

    // don't use 'Number of days' because the repayment delay
    // is not taken into account.
    var duration = (repayment_date - investment_date) / MS_IN_DAY;

    return {
      id: i,
      company: d['Company'],
      investment_date: investment_date,
      investment_amount: investment,
      duration: duration,
      repayment_date: repayment_date,
      repayment_amount: investment + roi,
      roi: roi
    };
  }
};

var margin = {top: 20, right: 20, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var xaxis = d3.axisBottom(x);
var yaxis = d3.axisLeft(y);

var svg = d3.select('#investments-graph').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var line = d3.line()
  .x(function(d) { return x(d.date); })
  .y(function(d) { return y(d.value); });

var plot = function(csv) {
  var data = d3.csvParse(csv, row);

  // compute the cumulative roi for every date
  var points = [];
  data.forEach(function(d, i, data) {
    points.push({
      date: d.investment_date,
      value: d3.sum(data.map(roiAt.bind(undefined, d.investment_date)))
    }, {
      date: d.repayment_date,
      value: d3.sum(data.map(roiAt.bind(undefined, d.repayment_date)))
    });
  });
  console.assert(points.length === data.length * 2);

  points = points.sort(function(a, b) {
    return a.date - b.date;
  });

  // add cumulative points to the investment
  data.forEach(function(d, i, data) {
    d.points = points.filter(function(p) {
      return p.date >= d.investment_date && p.date <= d.repayment_date;
    });
    console.assert(d.points.length >= 2);
  });

  x.domain([
    d3.min(points, function(d) { return d.date; }),
    d3.max(points, function(d) { return d.date; })
  ]);
  y.domain([0, d3.max(points, function(d) { return d.value; })]);

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xaxis);

  svg.append('g')
    .call(yaxis);

  svg.selectAll().data(data).enter()
    .append('path')
    .attr('class', 'cumulative-line')
    .attr('data-investment', function(d) { return d.id;})
    .attr('d', function(d) {
      return line(d.points);
    });

  // populate grid
  var formatDate = d3.timeFormat('%d.%m.%Y');

  var grid = document.querySelector('#investments-grid');
  grid.columns[1].renderer = function(cell) {
    cell.element.innerHTML = formatDate(cell.data)
  };
  grid.columns[2].renderer = function(cell) {
    cell.element.innerHTML = formatDate(cell.data)
  };
  grid.columns[3].renderer = function(cell) {
    cell.element.innerHTML = Math.round(cell.data);
  };
  grid.columns[4].renderer = function(cell) {
    cell.element.innerHTML = cell.data + ' CHF';
  };

  grid.addEventListener('selected-items-changed', function() {
    var path;
    var deselected = grid.selection.deselected();
    if (deselected.length === 1) {
      path = document.querySelector("[data-investment='" + selected[0] + "']");
      path.classList.remove('selected');
    }
    var selected = grid.selection.selected();
    if (selected.length === 1) {
      var previous =  document.querySelector("[data-investment].selected");
      if (previous) {
        previous.classList.remove('selected');
      }
      path = document.querySelector("[data-investment='" + selected[0] + "']");
      path.classList.add('selected');
    }
  });
  grid.items = data;

};
