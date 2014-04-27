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
	Game.Model.Captain = function (game) {
		this.game = game;
		this.scene = this.game.currentScene;
	};

	Game.Model.Captain.prototype.activate = function () {
		var self = this;
		this.scene.setDialog({
			text: "This is you, Jack Sprow, captain of this icefly class spaceship. Your mission is to inspect this planet and to find water proof. This is one of this day you feel it will be special.",
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