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
			x: 0,
			y: 0,
			width: this.game.res.images.planet.width * this.planetScale,
			height: this.game.res.images.planet.height * this.planetScale
		};

		this.planet.base = {
			x: this.planet.width / 4,
			y: - this.planet.height * 1 / 8,
			width: this.planet.width / 4,
			height: this.planet.height / 4
		};

		this.planet.target = {
			x: - this.planet.width / 8,
			y: - this.planet.height / 2,
			width: this.planet.width,
			height: this.planet.height
		};

		this.planetDistance = 0;
		this.planetGoal = 5;

		this.landingTime = 0;
		this.landingGoal = 1;
		this.landingInfo = {
			x: this.game.options.size / 2,
			y: this.game.options.size / 4,
			scale: 0
		};
	};

	Game.Scene.Scene1.prototype.computePlanetCoord = function () {
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
			this.planetReached = true;
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
		}
	};

	Game.Scene.Scene1.prototype.tween = function (delta, base, target) {
		return base + (target - base) * delta;
	};

	Game.Scene.Scene1.prototype.update = function (delta) {
		var reactorKey, reactor;

		this.planetDistance += delta / 1000;
		this.computePlanetCoord();
		if (this.planetReached) {
			this.computeSpaceshipLanding(delta);
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

	};
}());
