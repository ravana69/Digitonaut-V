let grid = [];
let grid_len = 100;
let palette;
let camera;

let theta_a = 45;
let theta_b = -45;
let cr = 100;

function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	colorMode(HSB, 360, 100, 100, 100);
	angleMode(DEGREES);
	palette = shuffle(["#e51c39","#f1b844","#36c4b7","#666666"]);

	ortho(-width / 4, width / 4, -height / 4, height / 4, -5000, 5000);

	camera = createCamera();
	camera.setPosition(
		cos(theta_a) * cos(theta_b) * cr,
		cos(theta_a) * sin(theta_b) * cr,
		sin(theta_b) * cr
	);
	camera.lookAt(0, 50, 0);
}

function draw() {
	if (frameCount % 200 == 0) {
		palette = shuffle(["#e51c39","#f1b844","#36c4b7","#666666"]);
	}
	randomSeed(frameCount / 200);
	grid = [];

	for (let y = 0; y < grid_len; y++) {
		grid.push([]);
		for (let x = 0; x < grid_len; x++) {
			grid[y][x] = [];
		}
	}

	orbitControl();

	ambientLight(0, 0, 50);
	directionalLight(color(0, 0, 80), 1, 0, -1);
	directionalLight(color(0, 0, 30), -1, 0, -1);
	directionalLight(color(0, 0, 50), 0, 1, 0);

	background(0);
	translate(0, height / 4, 0);
	// rotateX(-45);
	// rotateY(-22.5);

	cirs = [];
	for (let i = 0; i < 250; i++) {
		let cir = createCircle(0, 100);
		let arr = getGridCircles(cir);
		let retry = false;
		let retryCount = 0;
		for (let p = 0; p < arr.length; p++) {
			let c = arr[p];
			let len = dist(cir.x, cir.y, 0, c.x, c.y, 0) - c.l;
			if (len < 0) {
				retry = true;
				retryCount++;
				if (retryCount > 100) {
					continue;
				}
				break;
			}
			if (p == 0) {
				cir.l = len;
				arr = getGridCircles(cir);
				continue;
			}
			if (len < cir.l) {
				cir.l = len;
			}
		}
		if (retry && retryCount < 100) {
			i--;
			continue;
		}
		gridAddCircle(cir);
		cir.display();
	}
	// frameRate(1/2);

	// print("end");
}

class Circle {
	constructor(x, y, l) {
		this.x = x;
		this.y = y;
		this.l = l;
		this.h = this.l;
		this.xRes = int(random(5, 10));
		this.yRes = int(random(5, 10));
		this.color = shuffle(palette.concat());
		this.num = int(random(2, 6));
	}
	display() {
		let h = noise(this.x, this.y, frameCount / 100) * this.h * 2;

		push();
		translate(this.x - width / 2, -h / 2, this.y - height / 2);
		rotateZ(180);
		noStroke();

		for (let i = 1; i <= this.num; i++) {
			fill(this.color[i % this.color.length]);
			cylinder((this.l * i) / this.num, h, 64, 1, false, false);
		}
		pop();
	}
}

function createCircle(minL = 10, maxL = 80) {
	return new Circle(random(0, width), random(0, height), random(minL, maxL));
}

function gridX(x) {
	return constrain(int(x / grid[0].length), 0, grid[0].length - 1);
}

function gridY(y) {
	return constrain(int(y / grid.length), 0, grid.length - 1);
}

function getGridCircles(cir) {
	arr = [];
	arr = arr.concat(grid[gridY(cir.y)][gridX(cir.x)]);

	let x1 = gridX(cir.x - cir.l),
		x2 = gridX(cir.x + cir.l);
	let y1 = gridY(cir.y - cir.l),
		y2 = gridY(cir.y + cir.l);
	for (let y = y1; y <= y2; y++) {
		for (let x = x1; x <= x2; x++) {
			arr = arr.concat(grid[y][x]);
		}
	}
	return arr;
}

function gridAddCircle(cir) {
	let x1 = gridX(cir.x - cir.l),
		x2 = gridX(cir.x + cir.l);
	let y1 = gridY(cir.y - cir.l),
		y2 = gridY(cir.y + cir.l);
	for (let y = y1; y <= y2; y++) {
		for (let x = x1; x <= x2; x++) {
			grid[y][x].push(cir);
		}
	}
}