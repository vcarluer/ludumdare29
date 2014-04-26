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

	Game.Service.UpdateService = function (game) {
		this.game = game;
	};

	Game.Service.UpdateService.prototype.loop = function () {
		var delta = 0, self = this, newReference;
		this.getBrowserAnimationFrame()(function () {
			self.loop();
		});

		if (!this.startTime) {
			this.startTime = (new Date()).getTime();
		} else {
			newReference = (new Date()).getTime();
			delta = newReference - this.startTime;
			this.startTime = newReference;
		}

		if (this.game.currentScene) {
			this.game.currentScene.update(delta);
		}
	};

	Game.Service.UpdateService.prototype.getBrowserAnimationFrame = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	};
}());