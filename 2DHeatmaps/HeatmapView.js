export function arrangeDataToHeatmap(view,unfilteredData){

	var X = view.options.plotX, Y = view.options.plotY;
	var XTransform = view.options.plotXTransform, YTransform = view.options.plotYTransform;
	var numPerSide = view.options.numPerSide;

	var heatmapStep = [];

	for (var i=1; i <= numPerSide; i++) {
		heatmapStep.push(""+i);
	}
	
	if (XTransform == 'linear') {var xValue = function(d) {return d[X];}}
	if (YTransform == 'linear') {var yValue = function(d) {return d[Y];}}

	if (XTransform == 'log10') {var xValue = function(d) {return Math.log10(d[X]);};}
	if (YTransform == 'log10') {var yValue = function(d) {return Math.log10(d[Y]);};}

	if (XTransform == 'neglog10') {var xValue = function(d) {return Math.log10(-1*d[X]);}}
	if (YTransform == 'neglog10') {var yValue = function(d) {return Math.log10(-1*d[Y]);}}

	if (XTransform == 'symlog10') {var xValue = function(d) {
		if (d[X]>0.0){
			return Math.log10(d[X]) + 3.0;
		}else if (d[X]<0.0) {
			return -1*Math.log10(-1*d[X]) - 3.0;
		}
		else {
			return 0.0;
		}
	}}
	if (YTransform == 'symlog10') {var yValue = function(d) {
		if (d[Y]>0.0){
			return Math.log10(d[Y]) + 3.0;
		}else if (d[Y]<0.0) {
			return -1*Math.log10(-1*d[Y]) - 3.0;
		}
		else {
			return 0.0;
		}
	}}

	if (XTransform == 'symlogPC') {var xValue = function(d) {
		if (d[X]>0.0){
			return Math.log10(d[X]) -2.0;
		}else if (d[X]<0.0) {
			return -1*Math.log10(-1*d[X]) + 2.0;
		}
		else {
			return 0.0;
		}
	}}
	if (YTransform == 'symlogPC') {var yValue = function(d) {
		if (d[Y]>0.0){
			return Math.log10(d[Y]) + 4.5;
		}else if (d[Y]<0.0) {
			return -1*Math.log10(-1*d[Y]) - 4.5;
		}
		else {
			return 0.0;
		}
	}}
	
	var xMin = Math.floor(d3.min(unfilteredData,xValue));
	var xMax = Math.ceil(d3.max(unfilteredData,xValue));
	var yMin = Math.floor(d3.min(unfilteredData,yValue));
	var yMax = Math.ceil(d3.max(unfilteredData,yValue));
	
	/*var xMin = d3.min(unfilteredData,xValue);
	var xMax = d3.max(unfilteredData,xValue);
	var yMin = d3.min(unfilteredData,yValue);
	var yMax = d3.max(unfilteredData,yValue);*/

	view.xMin = xMin;
	view.xMax = xMax;
	view.yMin = yMin;
	view.yMax = yMax;

	var xScale = d3.scaleQuantize()
	.domain([xMin, xMax])
	.range(heatmapStep);
	
	var yScale = d3.scaleQuantize()
	.domain([yMin, yMax])
	.range(heatmapStep);

	console.log(xMin,xMax,yMin,yMax)

	console.log(xScale,yScale)
	
	var xMap = function(d) {return xScale(xValue(d));};
	var yMap = function(d) {return yScale(yValue(d));}; 
	
	view.data = {};
	view.dataXMin = d3.min(unfilteredData,xValue);
	view.dataXMax = d3.max(unfilteredData,xValue);
	view.dataYMin = d3.min(unfilteredData,yValue);
	view.dataYMax = d3.max(unfilteredData,yValue);

	view.xScale = xScale;
	view.yScale = yScale;

	//console.log(xScale.invertExtent(""+50))
	
	for (var i=0; i<unfilteredData.length; i++){
		var heatmapX = xMap(unfilteredData[i]);
		var heatmapY = yMap(unfilteredData[i]);
		
		view.data[heatmapX] = view.data[heatmapX] || {};
		view.data[heatmapX][heatmapY] = view.data[heatmapX][heatmapY] || {list:[], selected:true};
		view.data[heatmapX][heatmapY]['list'].push(unfilteredData[i]);
	}
	
	//console.log(view.data);
			
}




export function getHeatmap(view){
	var uniforms = {

		color:     { value: new THREE.Color( 0xffffff ) },
		texture:   { value: new THREE.TextureLoader().load( "textures/sprites/disc.png" ) }

	};

	var shaderMaterial = new THREE.ShaderMaterial( {

		uniforms:       uniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true

	});

	var X = view.options.plotX;
	var Y = view.options.plotY;
	var options = view.options;
	var scene = view.scene;
	
	var data = view.data;
	
	var num = heatmapPointCount(data);
	
	
	var geometry = new THREE.BufferGeometry();
	var colors = new Float32Array(num *3);
	var positions = new Float32Array(num *3);
	var sizes = new Float32Array(num);
	var alphas = new Float32Array(num);

	var heatmapInformation = [];
	//console.log(unfilteredData.length);
	//console.log(num);
	
	var lut = new THREE.Lut( options.colorMap, 500 );
	lut.setMax( 1000);
	lut.setMin( 0 );
	view.lut = lut;
	
	var i = 0;
	var i3 = 0;

	//var xPlotScale = d3.scaleLinear().domain([0, options.numPerSide]).range([-50,50]);
	//var yPlotScale = d3.scaleLinear().domain([0, options.numPerSide]).range([-50,50]);
	var xPlotScale = view.xPlotScale;
	var yPlotScale = view.yPlotScale;
	
	for (var x in data){
		for (var y in data[x]){
			var xPlot = xPlotScale(parseFloat(x));
			var yPlot = yPlotScale(parseFloat(y));
			
			positions[i3 + 0] = xPlot;
			positions[i3 + 1] = yPlot;
			positions[i3 + 2] = 0
			
			var numberDatapointsRepresented = countListSelected(data[x][y]['list']);
			if (numberDatapointsRepresented > 0) {
				var color = lut.getColor( numberDatapointsRepresented );
			
				colors[i3 + 0] = color.r;
				colors[i3 + 1] = color.g;
				colors[i3 + 2] = color.b;
			}
			else {
				colors[i3 + 0] = 100;
				colors[i3 + 1] = 100;
				colors[i3 + 2] = 100;
			}
			sizes[i] = options.pointCloudSize;
			alphas[i] = options.pointCloudAlpha;
			
			i++;
			i3 += 3;

			var tempInfo = {x:xPlot-50, 
							y:yPlot-50, 
							numberDatapointsRepresented: numberDatapointsRepresented,
							xStart: view.xScale.invertExtent(x)[0],
							xEnd: 	view.xScale.invertExtent(x)[1],
							yStart: view.yScale.invertExtent(y)[0],
							yEnd: 	view.yScale.invertExtent(y)[1]/*,
							heatmapX: x,
							heatmapY: y*/
							};
			//console.log(tempInfo);
			//console.log(view.xScale.invertExtent(""+xPlot)[0], view.xScale.invertExtent(""+xPlot)[1])
			heatmapInformation.push(tempInfo)
		}
	}
	
	view.heatmapInformation = heatmapInformation;
	geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
	geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
	geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

	var System = new THREE.Points(geometry, shaderMaterial);
	//return System;

	//particles.name = 'scatterPoints';
			
	view.System = System;
	//view.attributes = particles.attributes;
	//view.geometry = particles.geometry;
	scene.add(System);
	
}


export function updateHeatmap(view){
	var options = view.options;
	var System = view.System;
	var data = view.data;
	var num = heatmapPointCount(data);
	var colors = new Float32Array(num *3);
	var sizes = new Float32Array(num);
	var alphas = new Float32Array(num);
	var lut = new THREE.Lut( options.colorMap, 500 );
	lut.setMax( 1000);
	lut.setMin( 0 );
	view.lut = lut;
	var i = 0;
	var i3 = 0;
	for (var x in data){
		for (var y in data[x]){
			
			var numberDatapointsRepresented = countListSelected(data[x][y]['list']);
			if (numberDatapointsRepresented > 0) {
				var color = lut.getColor( numberDatapointsRepresented );
			
				colors[i3 + 0] = color.r;
				colors[i3 + 1] = color.g;
				colors[i3 + 2] = color.b;
				sizes[i] = options.pointCloudSize;
				alphas[i] = options.pointCloudAlpha;
			}
			else {
				colors[i3 + 0] = 100;
				colors[i3 + 1] = 100;
				colors[i3 + 2] = 100;
				sizes[i] = options.pointCloudSize;
				alphas[i] = options.pointCloudAlpha/2;
			}
			
			
			
			i++;
			i3 += 3;
		}
	}
	
	//geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
	System.geometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
	System.geometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
	System.geometry.addAttribute( 'alpha', new THREE.BufferAttribute( alphas, 1 ) );

}

export function replotHeatmap(view){
	view.scene.remove(view.System);
	//var options = view.options;
	arrangeDataToHeatmap(view,view.unfilteredData);
	getHeatmap(view);

}

function countListSelected(list) {
	var count = 0;
	
	for (var i = 0; i < list.length; i++) {
		if (list[i].selected){ count += 1;}
	}
	return count;
}

function heatmapPointCount(data){
	var count = 0;
	for (var x in data){
		for (var y in data[x]){
			count = count + 1;
		}
	}
	return count;
}