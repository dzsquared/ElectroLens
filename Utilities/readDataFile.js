import {initializeViewSetups} from "../MultiviewControl/initializeViewSetups.js";
export function readCSV(view,plotData,callback){

	var filename = view.dataFilename;
	view.data = [];
	d3.csv(filename, function (d) {
		d.forEach(function (d,i) {
			var n = +d.rho;

			if (n >1e-3){
				var temp = {
						x: +d.x,
						y: +d.y,
						z: +d.z,
						n: +d.rho,
						gamma: +d.gamma,
						epxc: +d.epxc,
						ad0p2: +d.ad0p2,
						deriv1: +d.deriv1,
						deriv2: +d.deriv2,
						selected: true
					}
			    	
				view.data.push(temp);
				plotData.push(temp);
			}
		})
	//number = number + view.data.length;
	//console.log(number);
	//console.log(view.data);
	callback(null);
	});

}


export function readCSV2(view,plotData,dataOptions,callback){

	var filename = view.dataFilename;
	view.data = [];
	d3.csv(filename, function (d) {
		d.forEach(function (d,i) {
			var n = +d.rho;

			if (n >1e-3){
				var temp = {
						x: +d.x,
						y: +d.y,
						z: +d.z,
						n: +d.rho,
						gamma: +d.gamma,
						epxc: +d.epxc,
						ad0p2: +d.ad0p2,
						deriv1: +d.deriv1,
						deriv2: +d.deriv2,
						selected: true
					}
			    	
				view.data.push(temp);
				plotData.push(temp);
			}
		})
	callback(null);
	});

}

function getCoordinateScales(data){
	var xValue = function(d) {return d.x;}
	var yValue = function(d) {return d.y;}
	var zValue = function(d) {return d.z;}
	var xMin = d3.min(data,xValue);
	var xMax = d3.max(data,xValue);
	var yMin = d3.min(data,yValue);
	var yMax = d3.max(data,yValue);
	var zMin = d3.min(data,zValue);
	var zMax = d3.max(data,zValue);
}


function preprocessData(view){
	var data = view.data;
}







/*

export function readViewsSetup(filname,callback){
	loadJSON(function(response) {
		// Parse JSON string into object
		views = JSON.parse(response);
		console.log(response);
		console.log(views);
		initializeViewSetups(views);
		callback(null);
	});
}

function loadJSON(filename,callback) {   

	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', filename, true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
		callback(xobj.responseText);
		}
	};
	xobj.send(null);  
}*/