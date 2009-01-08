function translateY(y) {
	return parseInt(canvas.style.height) - y;
}

/* Class Coordinates */
function Coordinates(x, y) {
	this.X = x;
	this.Y = y;
}

/* Class Font */
function Font(name, size, color) {
	this.Name = name;
	this.Size = size;
	this.Color = color;
}

/* Class Graphics */
function Graphics( ) {
	this.Collection = new Array( );
	this.Font = new Font('sans-serif', '9px', '#333');
}

Graphics.prototype.setFont = function(name, size, color) {
	if(arguments.length > 0) {
		switch(arguments.length) {
			case 1:
				this.Font = arguments[0];
				break;

			case 2:
				throw 'There is no overload for setFont accepting two parameters.';
				break;

			case 3:
				this.Font.Name = name;
				this.Font.Size = size;
				this.Font.Color = color;
				break;
		}
	}
}

Graphics.prototype.plotPixel = function(x, y, c, p, id) {
	var newBox = document.createElement('div');
	newBox.className = 'Ink';
	newBox.style.zIndex = p;
	newBox.id = id;

	newBox.style.borderTopWidth = '1px';
	newBox.style.borderTopStyle = 'solid';
	newBox.style.borderTopColor = c;
	newBox.style.backgroundColor = Color.Transparent;

	newBox.style.width = '1px';
	newBox.style.height = '1px';

	newBox.style.left = x + 'px';
	newBox.style.top = y + 'px';
	
	return newBox;
}

Graphics.prototype.drawStringArea = function(s, x, y, w, h, c, id) {
	var newBox = this.CreateTextObject(s, 'InkText');
	var newBoxContainer = document.createElement('div');

	newBoxContainer.className = 'Ink';

	newBoxContainer.style.left = x + 'px';
	newBoxContainer.style.top = y + 'px';

	newBoxContainer.style.width = w + 'px';
	newBoxContainer.style.height = h + 'px';

	newBoxContainer.appendChild(newBox);

	newBoxContainer.id = id;

	return newBoxContainer;
}

Graphics.prototype.drawString = function(s, x, y, c, id) {
	var newBox = this.CreateTextObject(s, 'Text');

	newBox.style.left = x + 'px';
	newBox.style.top = y + 'px';

	newBox.id = id;

	return newBox;
}

Graphics.prototype.CreateTextObject = function(s, type) {
	var newBox = document.createElement('div');
	newBox.appendChild(document.createTextNode(s));
	newBox.className = type;
	
	newBox.style.fontFamily = this.Font.Name;
	newBox.style.fontSize = this.Font.Size;
	newBox.style.color = this.Font.Color;
	return newBox;
}

Graphics.prototype.drawOldCircle = function(xc, yc, r, c, p, id) {
	var circle = document.createElement('div');
	circle.className = 'Ink';
	circle.style.zIndex = p;
	circle.id = id;

	for(var a = 0; a < 360; a++) {
		circle.appendChild(this.plotPixel(r * Math.cos(a * Math.PI / 180) + xc, r * Math.sin(a * Math.PI / 180) + yc, Color.Blue, 1000));
	}

	return circle;
}

Graphics.prototype.drawCircle = function(xc, yc, r, c, p, id) {
	var circle = document.createElement('div');
	circle.className = 'Ink';
	circle.style.zIndex = p;
	circle.id = id;

	var x = xc - r;
	var y = yc - r;


	if(false) {
		circle.style.border = '1px solid #000';
		circle.style.backgroundColor = Color.Green;
		circle.appendChild(this.plotPixel(xc, yc, Color.Blue, 1000, 'debug'));
		circle.appendChild(this.plotPixel(xc+1, yc, Color.Blue, 1000));
		circle.appendChild(this.plotPixel(xc, yc+1, Color.Blue, 1000));
		circle.appendChild(this.plotPixel(xc+1, yc+1, Color.Blue, 1000));
	}
	
	yc = yc - r /2;
	xc = xc - r;
	
	circle.style.left = x + 'px';
	circle.style.top = y + 'px';

	circle.style.width = r * 2 + 'px';
	circle.style.height = r * 2 + 'px';

	var r2 = r * r;
	x = 1;
	y = parseInt((Math.sqrt(r2 - 1) + 0.5));

	circle.appendChild(this.plotPixel(xc, yc + r, c, p));
	circle.appendChild(this.plotPixel(xc, yc - r, c, p));
	circle.appendChild(this.plotPixel(xc + r, yc, c, p));
	circle.appendChild(this.plotPixel(xc - r, yc, c, p));

	while (x < y) {
		circle.appendChild(this.plotPixel(xc + x, yc + y, c, p));
		circle.appendChild(this.plotPixel(xc + x, yc - y, c, p));
		circle.appendChild(this.plotPixel(xc - x, yc + y, c, p));
		circle.appendChild(this.plotPixel(xc - x, yc - y, c, p));
		circle.appendChild(this.plotPixel(xc + y, yc + x, c, p));
		circle.appendChild(this.plotPixel(xc + y, yc - x, c, p));
		circle.appendChild(this.plotPixel(xc - y, yc + x, c, p));
		circle.appendChild(this.plotPixel(xc - y, yc - x, c, p));

		x += 1;
		y = parseInt((Math.sqrt(r2 - x*x) + 0.5));
	}

	if (x == y) {
		circle.appendChild(this.plotPixel(xc + x, yc + y, c, p));
		circle.appendChild(this.plotPixel(xc + x, yc - y, c, p));
		circle.appendChild(this.plotPixel(xc - x, yc + y, c, p));
		circle.appendChild(this.plotPixel(xc - x, yc - y, c, p));
	}

	return circle;
}

Graphics.prototype.drawHorizontalLine = function(x, y, w, c, s, p, id) {
	var newBox = document.createElement('div');
	newBox.className = 'Ink';

	switch(s) {
		case Border.Solid:
			newBox.style.borderTop = '1px solid ' + c;
			break;
				
		case Border.Dotted:
			newBox.style.borderTop = '1px dotted ' + c;
			break;
	}
	
	newBox.style.zIndex = p;

	newBox.style.backgroundColor = 'transparent';

	newBox.style.width = w + 'px';
	newBox.style.height = 10 + 'px';

	newBox.style.left = x + 'px';
	newBox.style.top = y + 'px';
	
	newBox.id = id;
	return newBox;
}

Graphics.prototype.drawRect = function(x1, y1, x2, y2, c, b, bc, p, id, str) {
	var newBox = document.createElement('div');
	newBox.className = 'Ink';

	switch(b) {
		case Border.None:
			newBox.className = 'Ink';
			break;
				
		case Border.Solid:
			newBox.className = 'Ink Border';
			break;
				
		case Border.Dotted:
			newBox.className = 'Ink Border';
			newBox.style.borderStyle = 'dotted';
			break;
				
		case Border.ThreeD:
			newBox.className = 'Ink ThreeDBorder';
			break;
	}

	if(bc && bc.length > 0) {
		newBox.style.borderColor = bc;
	}
	
	newBox.style.zIndex = p;

	newBox.style.backgroundColor = c;

	if(y1 > y2) {
		t = y2;
		y2 = y1;
		y1 = t;
	}

	if(x1 > x2) {
		t = x2;
		x2 = x1;
		x1 = t;
	}

	newBox.style.width = (x2-x1) + 'px';
	newBox.style.height = (y2-y1) + 'px';

	newBox.style.left = x1 + 'px';
	newBox.style.top = y1 + 'px';
	
	if(str) {
		newBox.appendChild(this.CreateTextObject(str, 'InkText'));
	}

	newBox.id = id;
	return newBox;
}

Graphics.prototype.drawLine = function(x0, y0, x1, y1, c, p) {
	var newObj = document.createElement('div');
	newObj.className = 'Absolute';

	var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

	if (steep) {
		t = y0;
		y0 = x0;
		x0 = t;

		t = y1;
		y1 = x1;
		x1 = t;
	}

	var deltax = Math.abs(x1 - x0);
	var deltay = Math.abs(y1 - y0);

	var error = 0;
	var deltaerr = deltay;

	var x = x0;
	var y = y0;

	if (x0 < x1) {
		xstep = 1;
	}
	else {
		xstep = -1;
	}
	
	if(y0 < y1) {
		ystep = 1;
	}
	else {
		ystep = -1;
	}

	if(steep) {
		newObj.appendChild(this.plotPixel(y, x, c, p));
	}
	else {
		newObj.appendChild(this.plotPixel(x, y, c, p));
	}

	while(x != x1) {
		x = x + xstep;
		error = error + deltaerr;
		if(2 * error >= deltax) {
			y = y + ystep;
			error = error - deltax;
		}
		if(steep) {
			newObj.appendChild(this.plotPixel(y, x, c, p));
		}
		else 
		{
			newObj.appendChild(this.plotPixel(x, y, c, p));
		}
	}

	return newObj;
}

Graphics.prototype.Add = function(obj) {
	this.Collection.push(obj);
}

Graphics.prototype.Attach = function(parentObj, childObj) {
	parentObj.appendChild(childObj);
}

Graphics.prototype.CreateCanvas = function(w, h, id) {
	var canvas = document.createElement('div');
	canvas.className = 'Absolute';
	canvas.id = id;

	canvas.style.width = w + 'px';
	canvas.style.height = h + 'px';

	canvas.PlotPixel = function(x, y, c, p, id) {
		var pixel = document.createElement('div');
		pixel.className = 'Ink';
		pixel.style.zIndex = p;
		pixel.id = id;

		pixel.style.borderTopWidth = '1px';
		pixel.style.borderTopStyle = 'solid';
		pixel.style.borderTopColor = c;
		pixel.style.backgroundColor = Color.Transparent;

		pixel.style.width = '1px';
		pixel.style.height = '1px';

		pixel.style.left = x + 'px';
		pixel.style.top = y + 'px';
		if(x <= parseInt(canvas.style.width) &&
		   y <= parseInt(canvas.style.height)) {
// dump(parseInt(canvas.style.left) + parseInt(canvas.style.width) + '][' + x + '\n');
			this.firstChild.appendChild(pixel);
		}
	}

	canvas.SetLocation = function(x, y) {
		canvas.style.left = x + 'px';
		canvas.style.top = y + 'px';
	}

	canvas.CreateBorder = function(width, style, color) {
		this.style.border = width + ' ' + style + ' ' + color;
	}

	canvas.appendChild(this.CreateCanvasContainer(w, h, id));

	return canvas;
}

Graphics.prototype.CreateCanvasContainer = function(w, h, id) {
	var container = document.createElement('div');
	container.className = 'Absolute';
	container.id = id + 'Container';

	container.style.width = parseInt(w) + 'px';
	container.style.height = parseInt(h) + 'px';

	return container;
}

Graphics.prototype.CleanCanvas = function(canvas) {
	if(canvas.firstChild) {
		canvas.removeChild(canvas.firstChild);
	}
	
	canvas.appendChild(this.CreateCanvasContainer(canvas.style.width, canvas.style.height, canvas.id));
}

Graphics.prototype.GetCanvas = function( ) {
	return canvas;
}