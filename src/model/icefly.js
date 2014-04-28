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
(function () {
	"use strict";
	Game.Model.Icefly = function (game) {
		this.game = game;
		this.scene = this.game.currentScene;
	};

	Game.Model.Icefly.prototype.activate = function () {
		var self = this;
		this.scene.setDialog({
			text: "The Icefly class spaceship is a light transport ship. You commend it from five years now. The hull is in fairly good condition. The four Stack industry engines are them brand new, making this ship one of the fastest in this quadrant.",
			choices: [
				{
					text: "continue",
					free: true,
					callback: function () {
						self.scene.noDialog();
					}
				}
			]
		});
	};
}());