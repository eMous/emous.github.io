var PI2 = Math.PI * 2;
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var circles = [];
var mouse = {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight
};
var options = {
    totalCircles: 10,
    maxRadius: 300,
    maxLineWidth: 150,
    colors: ["#105187", "#2C8693", "#F19722", "#C33325"]
};

function init() {
    onWindowResize();
    window.addEventListener("resize", onWindowResize, false);
    document.body.addEventListener("mousemove", onMouseMove, false);
    document.body.addEventListener("touchmove", onTouchMove, false);
    for (var i = 0; i < options.totalCircles; i++) circles.push(new Circle());
}

function onTouchMove(event) {
    var touch = event.touches[0];
    mouse = {
        x: touch.clientX,
        y: touch.clientY
    };
}

function onMouseMove(event) {
    mouse = {
        x: event.clientX,
        y: event.clientY
    };
}


function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    time = new Date().getTime() * 0.001;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < circles.length; i++) circles[i].draw(context);
}

var Circle = function(args) {
    if (args === undefined) var args = {};
    this.radius = args.radius || (Math.random() * options.maxRadius) + 10;
    this.lineWidth = args.lineWidth || Math.random() * options.maxLineWidth;
    this.color = args.color || options.colors[Math.floor(Math.random() * options.colors.length)];
    this.delay = Math.random() * 100 + 4;
    this.center = {
        x: canvas.width / 2,
        y: canvas.height / 2
    };
    this.draw = function(ctx) {
        this.center.x += (mouse.x - this.center.x) / this.delay;
        this.center.y += (mouse.y - this.center.y) / this.delay;
        var scale = Math.sin(time + this.lineWidth) - 0.5;
        ctx.lineWidth = (Math.sin(time + this.lineWidth) + 1) * this.lineWidth;
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.center.x, this.center.y);
        ctx.scale(scale, scale);
        ctx.strokeStyle = this.color;
        ctx.arc(0, 0, this.radius, 0, PI2, false);
        ctx.stroke();
        ctx.restore();
    };
    return this;
};

init();
animate();