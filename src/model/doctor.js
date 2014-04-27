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
	Game.Model.Doctor = function (game) {
		var self = this;
		this.game = game;
		this.scene = game.currentScene;

		this.dialogs = {};

		this.dialogs.entry = {
			text: "Do you feel ok? What can I do for you?",
			choices: [
				{
					key: 0,
					free: true,
					text: "Nothing thanks",
					callback: function () {
						// self.scene.noDialog();
						self.scene.lose();
					}
				},
				{
					key: 1,
					free: false,
					text: "Any information on life forms on this planet?",
					callback: function () {
						self.scene.setDialog(self.dialogs.lifeForm);
					}
				}
			]
		};

		this.dialogs.back = {
			text: "Do you want to know something else captain?",
			choices: [
				{
					key: 0,
					free: true,
					text: "No thanks, see you later.",
					callback: function () {
						self.scene.noDialog();
					}
				}
			]
		};

		this.dialogs.lifeForm = {
			text: "No, all we know is that there is maybe water on this planet, so life is possible.",
			choices: [
				{
					key: 0,
					free: true,
					text: "OK so we may meet hostility.",
					callback: function () {
						self.scene.setDialog(self.dialogs.back);
					}
				}
			]
		};
	};

	Game.Model.Doctor.prototype.activate = function (game) {
		this.scene.setDialog(
			this.dialogs.entry
		);
	};
}());