const root = document.querySelector("#root");
const Application = PIXI.Application;

const app = new Application({
  backgroundColor: 0x1099bb,
  antialias: true,
  resolution: devicePixelRatio,
});

root.appendChild(app.view);

const line = new PIXI.Graphics();
line.lineStyle(1, 0x000000);
line.moveTo(0, 400);
line.lineTo(800, 400);
app.stage.addChild(line);

const triangle = new PIXI.Graphics();
triangle.beginFill(0xffffff);
triangle.drawPolygon([-75, 150, 75, 150, 0, 0]);
triangle.endFill();
triangle.x = 150;
triangle.y = 425;
triangle.name = "triangle";
app.stage.addChild(triangle);

const circle = new PIXI.Graphics();
circle.beginFill(0xffffff, 1);
circle.drawCircle(0, 0, 75);
circle.x = 400;
circle.y = 500;
circle.endFill();
circle.name = "circle";
app.stage.addChild(circle);

const square = new PIXI.Graphics();
square.beginFill(0xffffff);
square.drawRect(0, 0, 150, 150);
square.x = 550;
square.y = 425;
square.endFill();
square.name = "square";
app.stage.addChild(square);

const arrayBottomFigure = [circle, square, triangle];

const amountFigure = Math.floor(Math.random() * (10 - 4)) + 4;

for (let i = 0; i < amountFigure; i++) {
  createFigure();
}

function createFigure() {
  const chooseRandomColor = Math.random() * 0xffffff;
  const figure = new PIXI.Graphics();
  const chooseRandomFigure = () => Math.floor(Math.random() * 3);
  switch (chooseRandomFigure()) {
    case 0:
      figure.lineStyle(1, 0xffbd01, 1);
      figure.beginFill(chooseRandomColor, 1);
      figure.drawCircle(0, 0, 50);
      figure.name = "circle";
      break;
    case 1:
      figure.lineStyle(1, 0xfeeb77, 1);
      figure.beginFill(chooseRandomColor, 1);
      figure.drawRect(-50, -50, 100, 100);
      figure.name = "square";
      break;
    case 2:
      figure.lineStyle(1, 0xfeeb77, 1);
      figure.beginFill(chooseRandomColor, 1);
      figure.drawPolygon([-50, 100, 50, 100, 0, 0]);
      figure.name = "triangle";
      break;
  }

  figure.endFill();
  figure.scale.set(0.8 + Math.random() * 0.4);
  figure.x = Math.random() * app.screen.width;
  figure.y = Math.random() * app.screen.height;
  figure.rotation = Math.random() * (Math.PI * 2);

  detectEdge(figure);
  app.stage.addChild(figure);

  figure.interactive = true;
  figure.buttonMode = true;
  figure
    .on("pointerdown", onDragStart)
    .on("pointerup", onDragEnd)
    .on("pointerupoutside", onDragEnd)
    .on("pointermove", onDragMove);

  function compareFigures(obj) {
    arrayBottomFigure.find((element) => {
      if (obj.name === element.name) {
        if (testFigures(obj, element)) {
          app.stage.removeChild(obj);
        } else {
          obj.position.set(obj.dragObjStart.x, obj.dragObjStart.y);
        }
      }
    });
  }

  function onDragStart(event) {
    this.alpha = 0.8;
    this.dragData = event.data;
    this.dragging = true;
    this.dragPointerStart = event.data.getLocalPosition(this.parent);
    this.dragObjStart = new PIXI.Point();
    this.dragObjStart.copyFrom(this.position);
    this.dragGlobalStart = new PIXI.Point();
    this.dragGlobalStart.copyFrom(event.data.global);
  }

  function onDragEnd(event) {
    compareFigures(this);
    this.alpha = 1;
    this.dragging = false;
    this.data = null;
  }

  function onDragMove(event) {
    if (this.dragging) {
      const data = this.dragData;
      const dragPointerEnd = data.getLocalPosition(this.parent);
      this.position.set(
        this.dragObjStart.x + (dragPointerEnd.x - this.dragPointerStart.x),
        this.dragObjStart.y + (dragPointerEnd.y - this.dragPointerStart.y)
      );
    }
  }

  function testFigures(figure, arrayElement) {
    const boundsFigure = figure.getBounds();
    const boundsElement = arrayElement.getBounds();

    return (
      boundsFigure.x < boundsElement.x + boundsElement.width / 2 &&
      boundsFigure.x + boundsFigure.width / 2 > boundsElement.x &&
      boundsFigure.y < boundsElement.y + boundsElement.height / 2 &&
      boundsFigure.y + boundsFigure.height / 2 > boundsElement.y
    );
  }
}

function detectEdge(figure) {
  const height = app.screen.height - figure.height - 220;
  const width = app.screen.width - figure.width - 220;
  if (figure.x < figure.width) {
    figure.x = figure.width;
  } else if (figure.x > width) {
    figure.x = width;
  }

  if (figure.y < figure.height) {
    figure.y = figure.height;
  } else if (figure.y > height) {
    figure.y = height;
  }
}
