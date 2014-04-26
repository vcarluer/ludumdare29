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
		this.planetGoal = 50;

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
					text: "continue",
					callback: function () {
						self.currentDialog = null;
					}
				},
				{
					key: 1,
					text: "test"
				}
			]
		};

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
		var fontSize = 22, fontMargin = 3, fontMarginChoice = 6, xDia = 0, yDia = 0, wDia, hDia, marginX = 10, marginY = 5, paddingX = 10, paddingY = 5, choiceKey, choice;
		if (this.currentDialog) {
			xDia = marginX;
			yDia = marginY;
			wDia = this.game.options.size - 2 * marginX;
			hDia = this.game.options.dialogHeight - 2 * marginY;
			this.game.ctx.fillStyle = "#002a53";
			this.game.ctx.fillRect(xDia, yDia, wDia, hDia);

			xDia = marginX + paddingX;
			yDia = marginY + paddingY;
			this.game.ctx.font = fontSize + "px Arial";
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
					this.game.ctx.font = fontSize + "px Arial";
					this.game.ctx.textAlign = "left";
					this.game.ctx.textBaseline = "top";
					this.game.ctx.fillStyle = "#06fea3";
					if (this.currentChoice && this.currentChoice.key === choice.key) {
						this.game.ctx.fillStyle = "#adfefe";
					}

					this.game.ctx.fillText(choice.text, xDia, yDia);

					if (!this.choiceShapes[choice.key]) {
						var metrics = this.game.ctx.measureText(choice.text);
						this.choiceShapes[choice.key] = {
							choice: choice,
							x: xDia,
							y: yDia,
							width: metrics.width,
							height: fontSize
						}
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
					if (mouse.x > shape.x && mouse.x < shape.x + shape.width && mouse.y > shape.y && mouse.y < shape.y + shape.height) {
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

	Game.Scene.Scene1.prototype.handleMouseClick = function(mouse) {
		if (this.currentChoice && this.currentChoice.callback) {
			if (this.state == 1) {
				this.planetDistance++;
			}

			this.currentChoice.callback();
			this.currentChoice = null;
		}
	};
}());
