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
		// Game life time
		this.planetGoal = 30;

		// Start state
		this.state = -1;

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
		this.introGoal = 3;
		this.introInfo = {
			x: - this.game.options.size / 2,
			y: this.game.options.size,
			scale: this.shipScaleBase
		};

		this.dialIntro = {
			text: "I am Jack Sprow, captain of the icefly. The Empire mothership may have scanned water beneath this planet's surface. Our mission: verify the information and bring a sample.",
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
		this.game.model.pilot = new Game.Model.Pilot(this.game);
		this.game.model.techy = new Game.Model.Techy(this.game);
		this.game.model.psy = new Game.Model.Psy(this.game);

		this.crewShapes = {};
		this.crewShapes.psy = {
			key: 0,
			getX: function () {
				return self.getScaledTile();
			},
			getY: function () {
				return self.getScaledTile();
			},
			item: this.game.model.psy,
			sy: 1
		};

		this.crewShapes.pilot = {
			key: 1,
			getX: function () {
				return 3 * self.getScaledTile();
			},
			getY: function () {
				return self.getScaledTile();
			},
			item: this.game.model.pilot,
			sy: 2
		};

		this.crewShapes.techy = {
			key: 2,
			getX: function () {
				return 3 * self.getScaledTile();
			},
			getY: function () {
				return 2 * self.getScaledTile();
			},
			item: this.game.model.techy,
			sy: 3
		};

		this.crewShapes.doc = {
			key: 3,
			getX: function () {
				return 5 * self.getScaledTile();
			},
			getY: function () {
				return 2 * self.getScaledTile();
			},
			item: this.game.model.doctor,
			sy: 0
		};

		this.crewShapes.captain = {
			key: 4,
			getX: function () {
				return 2 * self.getScaledTile();
			},
			getY: function () {
				return 2 * self.getScaledTile();
			},
			sy: 4
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
		this.registerEvents();

		// Title screen
		this.planet.x = - planetComputeW / 4;
		this.planet.y = - planetComputeW * 7 / 11;
		this.planet.width = planetComputeW;
		this.planet.height = planetComputeH;

		this.game.res.sounds.music.play();
	};

	Game.Scene.Scene1.prototype.restart = function () {
		this.state = 0;
		this.setDialog(this.dialIntro);
		this.spaceship.setScale(this.shipScaleBase);
		this.planet.x = this.planet.base.x;
		this.planet.y = this.planet.base.y;
		this.planet.width = this.planet.base.width;
		this.planet.height = this.planet.base.height;

		this.spaceship.x = this.spaceship.xTarget;
		this.spaceship.y = this.spaceship.yTarget;
		this.spaceship.width = this.spaceship.widthTarget;
		this.spaceship.height = this.spaceship.heightTarget;

		this.introTime = 0;
		this.planetDistance = 0;
		this.landingTime = 0;

		this.game.res.sounds.music.play();
		this.game.res.sounds.musiclose.pause();
		// todo: reset game item states if needed
		this.game.model.doctor.reset();
		this.game.model.pilot.reset();
		this.game.model.techy.reset();
		this.toxinOK = false;
		this.pilotOK = false;
		this.psyOK = false;
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

	Game.Scene.Scene1.prototype.noDialog = function () {
		this.currentDialog = null;
		this.currentChoice = null;
		this.choiceNeeded = false;
	};

	Game.Scene.Scene1.prototype.intro = function (deltaTime) {
		this.introTime += deltaTime / 1000;
		var delta = this.introTime / this.introGoal;
		if (delta < 1) {
			this.spaceship.x = this.tween(delta, this.introInfo.x, this.spaceship.xTarget);
			this.spaceship.y = this.tween(delta, this.introInfo.y, this.spaceship.yTarget);
		} else {
			this.spaceship.x = this.spaceship.xTarget;
			this.spaceship.y = this.spaceship.yTarget
			this.state = 1;
		}
	};

	Game.Scene.Scene1.prototype.computePlanetCoord = function (deltaTime) {
		var delta = this.planetDistance / this.planetGoal;
		if (delta < 1) {
			this.planet.x = this.tween(delta, this.planet.base.x, this.planet.target.x);
			this.planet.y = this.tween(delta, this.planet.base.y, this.planet.target.y);
			this.planet.width = this.tween(delta, this.planet.base.width, this.planet.target.width);
			this.planet.height = this.tween(delta, this.planet.base.height, this.planet.target.height);
		} else {
			this.planet.x = this.planet.target.x;
			this.planet.y = this.planet.target.y;
			this.planet.width = this.planet.target.width;
			this.planet.height = this.planet.target.height;
			/*if (!this.toxinOK) {
				this.lose("Just after you've landed, a powerful toxin killed all the crew.")
				return;
			}

			if (!this.pilotOK) {
				this.lose("Just after you've landed, The pilot took off and fired the spaceship's weapons on you.")
				return;
			}*/

			if (!this.psyOK) {
				this.lose("With what you found down there, you really needed the psy help to focus. But you didn't forged enough links with him. He lost you.")
				return;
			}

			this.state = 2;
		}
	};

	Game.Scene.Scene1.prototype.computeSpaceshipLanding = function (deltaTime) {
		var self = this;
		this.noDialog();
		this.landingTime += deltaTime / 1000;
		var delta = this.landingTime / this.landingGoal;
		if (delta < 1) {
			this.spaceship.x = this.tween(delta, this.spaceship.xTarget, this.landingInfo.x);
			this.spaceship.y = this.tween(delta, this.spaceship.yTarget, this.landingInfo.y);
			this.spaceship.setScale(this.tween(delta, this.shipScaleBase, this.landingInfo.scale));
		} else {
			this.spaceship.x = this.landingInfo.x;
			this.spaceship.y = this.landingInfo.y;
			this.spaceship.setScale(this.landingInfo.scale);
			this.state = 3;

			this.game.res.sounds.win.play();
			this.setDialog(
				{
					text: "The crew was holding too much secrets. Like the hidden water beneath this planet's surface, this people were not what they seem to be.",
					choices: [
						{
							key: 0,
							free: true,
							text: "continue...",
							callback: function () {
								self.setDialog(
									{
										text: "You have succeeded to land safely, alive. The question now is how long will you survive? But this is another story and shall be told another time."
									}
								);
							}
						}
					]
				}
			);
		}
	};

	Game.Scene.Scene1.prototype.lose = function (optText) {
		var self = this, txt;
		this.state = 4;
		txt = "What is beneath the surface? You will never know now you are dead.";
		if (optText) {
			txt = optText + " " + txt;
		}

		this.setDialog(
			{
				text: txt,
				choices: [
					{
						key: 0,
						free: true,
						text: "restart",
						callback: function () {
							self.restart();
						}
					}
				]
			}
		);

		this.game.res.sounds.music.pause();
		this.game.res.sounds.musiclose.play();
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
			case 3: // win state
				break;
			case 4: // lose state
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

		if (!(this.state === 4) && this.state >= 0) {
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

			this.renderCrew();

			for (var reactorKey in this.reactors) {
				if (this.reactors.hasOwnProperty(reactorKey)) {
					reactor = this.reactors[reactorKey];
					if (this.getScaledTile() > 0) {
						this.reactorRenderer.render(delta, reactor.getX(), reactor.getY(), this.getScaledTile(), this.getScaledTile());
					}
				}
			}
		}

		this.renderDialog(delta);

		if (this.state === -1) {
			this.game.ctx.font = 55 + "px " + this.game.options.font;
			this.game.ctx.textAlign = "center";
			this.game.ctx.textBaseline = "center";
			this.game.ctx.fillStyle = "white";
			var titleX = this.game.options.size / 2;
			var titleY = this.game.options.size / 2;
			this.game.ctx.fillText("Beneath the surface", titleX, titleY);

			this.game.ctx.font = 25 + "px " + this.game.options.font;
			this.game.ctx.textAlign = "center";
			this.game.ctx.textBaseline = "bottom";
			this.game.ctx.fillStyle = "white";
			var titleX = this.game.options.size / 2;
			var titleY = this.game.options.size;
			this.game.ctx.fillText("Ludum dare 29 compo - wip", titleX, titleY);
		}

		if (this.state === 3) {
			this.game.ctx.font = 55 + "px " + this.game.options.font;
			this.game.ctx.textAlign = "center";
			this.game.ctx.textBaseline = "center";
			this.game.ctx.fillStyle = "white";
			var titleX = this.game.options.size / 2;
			var titleY = this.game.options.size / 2;
			this.game.ctx.fillText("The End.", titleX, titleY);
		}

		if (this.state === 4) {
			this.game.ctx.font = 55 + "px " + this.game.options.font;
			this.game.ctx.textAlign = "center";
			this.game.ctx.textBaseline = "center";
			this.game.ctx.fillStyle = "white";
			var titleX = this.game.options.size / 2;
			var titleY = this.game.options.size / 2;
			this.game.ctx.fillText("Game Over", titleX, titleY);
		}
	};

	Game.Scene.Scene1.prototype.renderCrew = function () {
		var crewKey, crewShape, sx;

		for (crewKey in this.crewShapes) {
			if (this.crewShapes.hasOwnProperty(crewKey)) {
				crewShape = this.crewShapes[crewKey];
				if (!crewShape.item || !crewShape.item.dead) {
					sx = 0;
					if (this.selectedCrew && this.selectedCrew.key === crewShape.key) {
						sx = 1;
					}

					this.game.ctx.drawImage(
						this.game.res.images.crew,
							sx * this.game.options.tileSize,
							crewShape.sy * this.game.options.tileSize,
						this.game.options.tileSize,
						this.game.options.tileSize,
							this.spaceship.x + crewShape.getX(),
							this.spaceship.y + crewShape.getY(),
						this.getScaledTile(),
						this.getScaledTile()
					);
				}
			}
		}
	};

	Game.Scene.Scene1.prototype.renderDialog = function (delta) {
		var metrics, fontSize = 22, fontMargin = 3, fontMarginChoice = 6, xDia = 0, yDia = 0, wDia, hDia, marginX = 10, marginY = 5, paddingX = 10, paddingY = 5, choiceKey, choice;
		if (this.currentDialog) {
			xDia = marginX;
			yDia = marginY;
			wDia = this.game.options.size - 2 * marginX;
			hDia = this.game.options.dialogHeight - 2 * marginY;
			this.game.ctx.fillStyle = "rgba(0, 42, 83, .4)";
			this.game.ctx.fillRect(xDia, yDia, wDia, hDia);

			xDia = marginX + paddingX;
			yDia = marginY + paddingY;
			this.game.ctx.font = fontSize + "px " + this.game.options.font;
			this.game.ctx.textAlign = "left";
			this.game.ctx.textBaseline = "top";
			this.game.ctx.fillStyle = "#60d8fe";
			this.wrapText(this.game.ctx, this.currentDialog.text, xDia, yDia, wDia, fontSize + fontMargin);

			if (this.currentDialog.choices) {
				xDia = marginX;
				yDia = this.game.options.size - hDia - marginY;
				this.game.ctx.fillStyle = "rgba(0, 83, 76, .4)";
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
				}
			}
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
		var shapeKey, shape, choice, previousChoice = this.currentChoice, crewKey, crewShape;
		if (this.currentDialog) {
			this.currentChoice = null;
			if (this.choiceShapes) {
				for (shapeKey in this.choiceShapes) {
					if (this.choiceShapes.hasOwnProperty(shapeKey)) {
						shape = this.choiceShapes[shapeKey];
						if (this.inRect(mouse, shape)) {
							choice = shape.choice;
							break;
						}
					}
				}

				if (choice) {
					if (!previousChoice || (previousChoice.key != choice.key)) {
						this.game.res.sounds.mouseover.play();
					}

					this.currentChoice = choice;

				}
			}
		} else {
			this.selectedCrew = null;
			for (crewKey in this.crewShapes) {
				if (this.crewShapes.hasOwnProperty(crewKey)) {
					crewShape = this.crewShapes[crewKey];
					if (!crewShape.item || !crewShape.item.dead) {
						if (this.inShipTileCrew(mouse, crewShape)) {
							this.selectedCrew = crewShape;
						}
					}
				}
			}
		}
	};

	Game.Scene.Scene1.prototype.inShipTile = function (mouse, shape) {
		return mouse.x > this.spaceship.x + shape.x && mouse.x < this.spaceship.x + shape.x + this.getScaledTile() && mouse.y > this.spaceship.y + shape.y && mouse.y < this.spaceship.y + shape.y + this.getScaledTile();
	};

	Game.Scene.Scene1.prototype.inShipTileCrew = function (mouse, shape) {
		return mouse.x > this.spaceship.x + shape.getX() && mouse.x < this.spaceship.x + shape.getX() + this.getScaledTile() && mouse.y > this.spaceship.y + shape.getY() && mouse.y < this.spaceship.y + shape.getY() + this.getScaledTile();
	};

	Game.Scene.Scene1.prototype.inRect = function (mouse, shape) {
		return mouse.x > shape.x && mouse.x < shape.x + shape.width && mouse.y > shape.y && mouse.y < shape.y + shape.height;
	};

	Game.Scene.Scene1.prototype.handleMouseClick = function(mouse) {
		var crewKey, crewShape, self = this, handled, shipKey, shipShape;
		if (this.currentChoice) {
			if (this.state === 1 && !this.currentChoice.free) {
				this.planetDistance++;
			}

			this.choiceNeeded = false;
			if (this.currentChoice.callback) {
				this.game.res.sounds.mouseclick.play();
				this.currentChoice.callback();
			}
		}
		else {
			if (this.state === -1) {
				this.restart();
			} else {
				if (this.state === 1) {
					if (!this.choiceNeeded) {
						for (crewKey in this.crewShapes) {
							if (this.crewShapes.hasOwnProperty(crewKey)) {
								crewShape = this.crewShapes[crewKey];
								if (!crewShape.item || !crewShape.item.dead) {
									if (this.inShipTileCrew(mouse, crewShape)) {
										handled = true;
										if (crewShape.item) {
											crewShape.item.activate();
										}
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
		}
	};
}());
