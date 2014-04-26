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
(function () {
	"use strict";
	Game.Service.CanvasLoader = function (game) {
		this.game = game;
	};

	Game.Service.CanvasLoader.prototype.createCanvas = function () {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", this.game.dom.mainDivId + "canvas");
		var size = this.game.options.size;
		canvas.width = size;
		canvas.height = size;
		this.game.dom.mainDiv.appendChild(canvas);
		this.game.dom.canvas = canvas;
		this.game.dom.context = canvas.getContext("2d");
		this.game.ctx = this.game.dom.context;
		this.game.ctx.imageSmoothingEnabled= false;
	};
}());