/**
 Copyright 2014 Vincent Carluer.

 This file is part of 1gam0414.

 1gam0414 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 1gam0414 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with 1gam0414.  If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
	"use strict";
	Game.Scene.Scene1 = function (game) {
		this.init(game);
	};

	Game.Scene.Scene1.prototype.init = function (game) {
		this.id = "Scene1";
		this.game = game;
	};

	Game.Scene.Scene1.prototype.prepare = function () {
		// game life time
		this.planetGoal = 10;

		var self = this;
		this.game.currentScene = this;
		this.shipScaleBase = this.game.options.spaceShipHeight / this.game.options.pyxelCrop.height;
		this.shipScale = this.shipScaleBase;
		this.getScaledTile = function () {
			return self.shipScale * self.game.options.tileSize;
		};

		this.spaceship = {
			xTarget: (this.game.options.size - (this.game.options.pyxelCrop.width * this.shipScale)) / 2,
			yTarget: this.game.options.dialogHeight,
			widthTarget: this.game.options.pyxelCrop.width * this.shipScale,
			heightTarget: this.game.options.pyxelCrop.height * this.shipScale
		};

		this.spaceship.x = this.spaceship.xTarget;
		this.spaceship.y = this.spaceship.yTarget;
		this.spaceship.width = this.spaceship.widthTarget;
		this.spaceship.height = this.spaceship.heightTarget;
		this.spaceship.setScale = function (scale) {
			self.shipScale = scale;
			self.spaceship.width = self.game.options.pyxelCrop.width * self.shipScale;
			self.spaceship.height = self.game.options.pyxelCrop.height * self.shipScale;
		};

		this.reactorRenderer = new Game.Renderer.SpriteRenderer({
			game: this.game,
			image: this.game.res.images.reactor,
			count: 3,
			tickDelta: 300,
			loop: true
		});

		this.reactors = [
			{
				getX: function () {
					return self.spaceship.x + self.getScaledTile();
				},
				getY: function () {
					return self.spaceship.y + self.spaceship.height;
				}
			},
			{
				getX: function () {
					return self.spaceship.x + 2 * self.getScaledTile();
				},
				getY: function () {
					return self.spaceship.y + self.spaceship.height;
				}
			},
			{
				getX: function () {
					return self.spaceship.x + 4 * self.getScaledTile();
				},
				getY: function () {
					return self.spaceship.y + self.spaceship.height;
				}
			},
			{
				getX: function () {
					return self.spaceship.x + 5 * self.getScaledTile();
				},
				getY: function () {
					return self.spaceship.y + self.spaceship.height;
				}
			}
		];

		this.planetScale = this.shipScale;
		this.planet = {
		};

		this.planetScale = this.shipScale;
		var planetComputeW = this.game.res.images.planet.width * this.planetScale;
		var planetComputeH = this.game.res.images.planet.height * this.planetScale;
		this.planet.base = {
			x: planetComputeW / 4,
			y: - planetComputeH * 1 / 8,
			width: planetComputeW / 4,
			height: planetComputeH / 4
		};

		this.planet.x = this.planet.base.x;
		this.planet.y = this.planet.base.y;
		this.planet.width = this.planet.base.width;
		this.planet.height = this.planet.base.height;

		this.planet.target = {
			x: - planetComputeW / 8,
			y: - planetComputeH / 2,
			width: planetComputeW,
			height: planetComputeH
		};

		this.planetDistance = 0;

		this.landingTime = 0;
		this.landingGoal = 1;
		this.landingInfo = {
			x: this.game.options.size / 2,
			y: this.game.options.size / 4,
			scale: 0
		};

		this.introTime = 0;
		this.introGoal = 5;
		this.introInfo = {
			x: - this.game.options.size / 2,
			y: this.game.options.size,
			scale: this.shipScaleBase
		};

		this.state = 0;

		var dialIntro = {
			text: "The main ship may have scanned water beneath the surface. Our mission: verify the information and bring a sample",
			choices: [
				{
					key: 0,
					free: true,
					text: "continue",
					callback: function () {
						self.noDialog();
					}
				}
			]
		};

		this.game.model.doctor = new Game.Model.Doctor(this.game);

		this.crewShapes = {};
		this.crewShapes.psy = {
			x: this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.crewShapes.pilot = {
			x: 3 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.crewShapes.techy = {
			x: 3 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.crewShapes.doc = {
			x: 5 * this.getScaledTile(),
			y: 2 * this.getScaledTile(),
			item: this.game.model.doctor
		};

		this.ship = {};
		this.ship.leftComm = {
			x: 0,
			y: 0
		};
		this.ship.leftWing1 = {
			x: 0,
			y: this.getScaledTile()
		};

		this.ship.leftWing2 = {
			x: 0,
			y: 2 * this.getScaledTile()
		};

		this.ship.leftCockpit = {
			x: this.getScaledTile(),
			y: 0
		};

		this.ship.dinnerRoom = {
			x: this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.dinnerRoom2 = {
			x: this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.ship.engine1 = {
			x: this.getScaledTile(),
			y: 3 * this.getScaledTile()
		};

		this.ship.dinnerRoom3 = {
			x: 2 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.empty1 = {
			x: 2 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.ship.engine2 = {
			x: 2 * this.getScaledTile(),
			y: 3 * this.getScaledTile()
		};

		this.ship.rightCockpit1 = {
			x: 3 * this.getScaledTile(),
			y: 0
		};

		this.ship.control1 = {
			x: 3 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.engineControl = {
			x: 3 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.ship.backHull = {
			x: 3 * this.getScaledTile(),
			y: 3 * this.getScaledTile()
		};

		this.ship.rightCockpit2 = {
			x: 4 * this.getScaledTile(),
			y: 0
		};

		this.ship.control2 = {
			x: 4 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.empty2 = {
			x: 4 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.ship.engine3 = {
			x: 4 * this.getScaledTile(),
			y: 3 * this.getScaledTile()
		};

		this.ship.rightCockpit3 = {
			x: 5 * this.getScaledTile(),
			y: 0
		};

		this.ship.medBay1 = {
			x: 5 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.medBay2 = {
			x: 5 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.ship.engine4 = {
			x: 5 * this.getScaledTile(),
			y: 3 * this.getScaledTile()
		};

		this.ship.rightComm = {
			x: 6 * this.getScaledTile(),
			y: 0
		};

		this.ship.rightWing1 = {
			x: 6 * this.getScaledTile(),
			y: this.getScaledTile()
		};

		this.ship.rightWing2 = {
			x: 6 * this.getScaledTile(),
			y: 2 * this.getScaledTile()
		};

		this.game.model.planet = new Game.Model.Planet(this.game);

		this.setDialog(dialIntro);
		this.registerEvents();
	};

	Game.Scene.Scene1.prototype.registerEvents = function () {
		var self = this;
		this.game.dom.canvas.addEventListener("mousemove", function(evt) {
			var mousePos = self.getMousePos(self.game.dom.canvas, evt);
			self.handleMouse(mousePos);
		}, false);

		this.game.dom.canvas.addEventListener("mouseup", function(evt) {
			var mousePos = self.getMousePos(self.game.dom.canvas, evt);
			self.handleMouseClick(mousePos);
		}, false);
	};

	Game.Scene.Scene1.prototype.setDialog = function (dialog) {
		this.currentDialog = dialog;
		this.choiceShapes = [];
		this.currentChoice = null;
		this.choiceNeeded = true;
	};

	Game.Scene.Scene1.prototype.noDialog = function (dialog) {
		this.currentDialog = null;
		this.currentChoice = null;
		this.choiceNeeded = false;
	};

	Game.Scene.Scene1.prototype.intro = function (deltaTime) {
		this.introTime += deltaTime / 1000;
		var delta = this.introTime / this.introGoal;
		if (delta <= 1) {
			this.spaceship.x = this.tween(delta, this.introInfo.x, this.spaceship.xTarget);
			this.spaceship.y = this.tween(delta, this.introInfo.y, this.spaceship.yTarget);
		} else {
			this.spaceship.x = this.spaceship.xTarget;
			this.spaceship.y = this.spaceship.yTarget
			this.state = 1;
		}
	};

	Game.Scene.Scene1.prototype.computePlanetCoord = function (deltaTime) {
		// this.planetDistance += deltaTime / 1000; // Forward is done by gameplay
		var delta = this.planetDistance / this.planetGoal;
		if (delta <= 1) {
			this.planet.x = this.tween(delta, this.planet.base.x, this.planet.target.x);
			this.planet.y = this.tween(delta, this.planet.base.y, this.planet.target.y);
			this.planet.width = this.tween(delta, this.planet.base.width, this.planet.target.width);
			this.planet.height = this.tween(delta, this.planet.base.height, this.planet.target.height);
		} else {
			this.planet.x = this.planet.target.x;
			this.planet.y = this.planet.target.y;
			this.planet.width = this.planet.target.width;
			this.planet.height = this.planet.target.height;
			this.state = 2;
		}
	};

	Game.Scene.Scene1.prototype.computeSpaceshipLanding = function (deltaTime) {
		this.landingTime += deltaTime / 1000;
		var delta = this.landingTime / this.landingGoal;
		if (delta <= 1) {
			this.spaceship.x = this.tween(delta, this.spaceship.xTarget, this.landingInfo.x);
			this.spaceship.y = this.tween(delta, this.spaceship.yTarget, this.landingInfo.y);
			this.spaceship.setScale(this.tween(delta, this.shipScaleBase, this.landingInfo.scale));
		} else {
			this.spaceship.x = this.landingInfo.x;
			this.spaceship.y = this.landingInfo.y;
			this.spaceship.setScale(this.landingInfo.scale);
			this.state = 3;
		}
	};

	Game.Scene.Scene1.prototype.tween = function (delta, base, target) {
		return base + (target - base) * delta;
	};

	Game.Scene.Scene1.prototype.update = function (delta) {
		var reactorKey, reactor;

		switch (this.state) {
			case 0:
				this.intro(delta);
				break;
			case 1:
				this.computePlanetCoord(delta);
				break;
			case 2:
				this.computeSpaceshipLanding(delta);
				break;
			default:
				break;
		}

		this.game.ctx.clearRect(0, 0, this.game.dom.canvas.width, this.game.dom.canvas.height);

		this.game.ctx.drawImage(
			this.game.res.images.bkg,
			0,
			0,
			this.game.options.size,
			this.game.options.size
		);

		this.game.ctx.drawImage(
			this.game.res.images.planet,
			this.planet.x,
			this.planet.y,
			this.planet.width,
			this.planet.height
		);

		this.game.ctx.drawImage(
			this.game.res.images.spaceship,
			this.game.options.pyxelCrop.x,
			this.game.options.pyxelCrop.y,
			this.game.options.pyxelCrop.width,
			this.game.options.pyxelCrop.height,
			this.spaceship.x,
			this.spaceship.y,
			this.spaceship.width,
			this.spaceship.height
		);

		this.game.ctx.drawImage(
			this.game.res.images.crew,
			this.game.options.pyxelCrop.x,
			this.game.options.pyxelCrop.y,
			this.game.options.pyxelCrop.width,
			this.game.options.pyxelCrop.height,
			this.spaceship.x,
			this.spaceship.y,
			this.spaceship.width,
			this.spaceship.height
		);

		for (var reactorKey in this.reactors) {
			if (this.reactors.hasOwnProperty(reactorKey)) {
				reactor = this.reactors[reactorKey];
				if (this.getScaledTile() > 0) {
					this.reactorRenderer.render(delta, reactor.getX(), reactor.getY(), this.getScaledTile(), this.getScaledTile());
				}
			}
		}

		this.renderDialog(delta);
	};

	Game.Scene.Scene1.prototype.renderDialog = function (delta) {
		var metrics, fontSize = 22, fontMargin = 3, fontMarginChoice = 6, xDia = 0, yDia = 0, wDia, hDia, marginX = 10, marginY = 5, paddingX = 10, paddingY = 5, choiceKey, choice;
		if (this.currentDialog) {
			xDia = marginX;
			yDia = marginY;
			wDia = this.game.options.size - 2 * marginX;
			hDia = this.game.options.dialogHeight - 2 * marginY;
			this.game.ctx.fillStyle = "#002a53";
			this.game.ctx.fillRect(xDia, yDia, wDia, hDia);

			xDia = marginX + paddingX;
			yDia = marginY + paddingY;
			this.game.ctx.font = fontSize + "px " + this.game.options.font;
			this.game.ctx.textAlign = "left";
			this.game.ctx.textBaseline = "top";
			this.game.ctx.fillStyle = "#60d8fe";
			this.wrapText(this.game.ctx, this.currentDialog.text, xDia, yDia, wDia, fontSize + fontMargin);

			xDia = marginX;
			yDia = this.game.options.size - hDia;
			this.game.ctx.fillStyle = "#00534c";
			this.game.ctx.fillRect(xDia, yDia, wDia, hDia);

			xDia = marginX + paddingX;
			yDia += paddingY;
			for (choiceKey in this.currentDialog.choices) {
				if (this.currentDialog.choices.hasOwnProperty(choiceKey)) {
					choice = this.currentDialog.choices[choiceKey];
					this.game.ctx.textAlign = "left";
					this.game.ctx.textBaseline = "top";
					this.game.ctx.fillStyle = "#06fea3";
					if (this.currentChoice && this.currentChoice.key === choice.key) {
						this.game.ctx.fillStyle = "#adfefe";
					}

					this.game.ctx.fillText(choice.text, xDia, yDia);
					metrics = this.game.ctx.measureText(choice.text);

					if (!this.choiceShapes[choice.key]) {
						this.choiceShapes[choice.key] = {
							choice: choice,
							x: xDia,
							y: yDia,
							width: metrics.width,
							height: fontSize
						}
					} else {
						metrics = this.game.ctx.measureText(choice.text);
						this.choiceShapes[choice.key].width = metrics.width;
					}

					yDia += fontSize + fontMarginChoice;
				}
			};
		}
	};

	Game.Scene.Scene1.prototype.wrapText = function(context, text, x, y, maxWidth, lineHeight) {
		var words = text.split(' ');
		var line = '';

		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	};

	Game.Scene.Scene1.prototype.getMousePos = function(canvas, evt) {
		var rect = this.game.dom.canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	};

	Game.Scene.Scene1.prototype.handleMouse = function(mouse) {
		var i = 0, shape, choice;
		if (this.currentDialog) {
			this.currentChoice = null;
			if (this.choiceShapes) {
				for (i = 0; i < this.choiceShapes.length; i++) {
					shape = this.choiceShapes[i];
					if (this.inRect(mouse, shape)) {
						choice = shape.choice;
						break;
					}
				}

				if (choice) {
					this.currentChoice = choice;
				}
			}
		}
	};

	Game.Scene.Scene1.prototype.inShipTile = function (mouse, shape) {
		return mouse.x > this.spaceship.x + shape.x && mouse.x < this.spaceship.x + shape.x + this.getScaledTile() && mouse.y > this.spaceship.y + shape.y && mouse.y < this.spaceship.y + shape.y + this.getScaledTile();
	};

	Game.Scene.Scene1.prototype.inRect = function (mouse, shape) {
		return mouse.x > shape.x && mouse.x < shape.x + shape.width && mouse.y > shape.y && mouse.y < shape.y + shape.height;
	};

	Game.Scene.Scene1.prototype.handleMouseClick = function(mouse) {
		var crewKey, crewShape, self = this, handled, shipKey, shipShape;
		if (this.currentChoice) {
			if (this.state == 1 && !this.currentChoice.free) {
				this.planetDistance++;
			}

			this.choiceNeeded = false;
			if (this.currentChoice.callback) {
				this.currentChoice.callback();
			}
		} else {
			if (this.state == 1) {
				if (!this.choiceNeeded) {
					for (crewKey in this.crewShapes) {
						if (this.crewShapes.hasOwnProperty(crewKey)) {
							crewShape = this.crewShapes[crewKey];
							if (this.inShipTile(mouse, crewShape)) {
								handled = true;
								if (crewShape.item) {
									crewShape.item.activate();
								}
							}
						}
					}

					if (!handled) {
						for (shipKey in this.ship) {
							if (this.ship.hasOwnProperty(shipKey)) {
								shipShape = this.ship[shipKey];
								if (this.inShipTile(mouse, shipShape)) {
									handled = true;
									if (shipShape.item) {
										shipShape.item.activate();
									}
								}
							}
						}
					}

					if (!handled) {
						handled = true;
						this.game.model.planet.activate();
					}
				}
			}
		}
	};
}());
