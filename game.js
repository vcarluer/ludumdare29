/**
 Copyright 2014 Vincent Carluer.

 This file is part of ld29.

 ld29 is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 ld29 is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with ld29.  If not, see <http://www.gnu.org/licenses/>.
 */

window.onload = function () {
	var myGame = new Game("gameDiv");
	myGame.run();
}

// Global game var
var Game = function (divId) {
	this.init(divId);
};
(function () {
	"use strict";

	Game.prototype.init = function (divId) {
		this.dom = {};

		this.dom.mainDiv = document.getElementById(divId);
	};

	Game.prototype.run = function () {
		this.dom.mainDiv.innerHTML = "Hello #LD29";
	};
}());