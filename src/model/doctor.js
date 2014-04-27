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
		this.baseEntryText = "Do you feel ok? What can I do for you?";
		this.alternateEntryText = "Do you feel ok? What can I do for you?";
		this.dialogBranches = [];

		this.dialogs = {};

		this.dialogs.entry = {};
		this.dialogs.entry.text = this.baseEntryText;
		this.dialogs.entry.choices = [];

		this.dialogs.exitBase = {
			branchKey: 0,
			text: "dummy",
			choices: [
				{
					key: 0,
					free: true,
					text: "See you later.",
					callback: function () {
						self.scene.noDialog();
					}
				}
			]
		};

		this.setBranch(this.dialogs.exitBase);

		this.dialogs.lifeScan = {
			branchKey: 1,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Any information on life forms on this planet?",
					callback: function () {
						self.selectDialog(self.dialogs.lifeForm);
					}
				}
			]
		};

		this.setBranch(this.dialogs.lifeScan);

		this.dialogs.lifeForm = {
			branchKey: 1,
			text: "We know is that there is maybe water on this planet, so life is possible.",
			choices: [
				{
					key: 0,
					text: "So we may meet hostility.",
					callback: function () {
						self.scene.noDialog();
					}
				}
			]
		};
	};

	Game.Model.Doctor.prototype.setBranch = function (dialog) {
		this.dialogBranches[dialog.branchKey] = dialog;
	};

	Game.Model.Doctor.prototype.selectDialog = function (dialog) {
		var currentDialog;
		this.setBranch(dialog);

		currentDialog = this.createDialog(dialog.text);
		this.scene.setDialog(currentDialog);
	};

	Game.Model.Doctor.prototype.createDialog = function (text) {
		var i, dialogKey, dialog, choiceKey, choice, dial = {
			text: text,
			choices: []
		};

		for (dialogKey in this.dialogBranches) {
			if (this.dialogBranches.hasOwnProperty(dialogKey)) {
				dialog = this.dialogBranches[dialogKey];
				i = 0;
				for (choiceKey in dialog.choices) {
					if (dialog.choices.hasOwnProperty(choiceKey)) {
						choice = dialog.choices[choiceKey];
						choice.key = dialog.branchKey + "-" + i;
						dial.choices[choice.key] = choice;
						i++;
					}
				}
			}
		}

		return dial;
	};

	Game.Model.Doctor.prototype.activate = function (game) {
		var currentDialog = this.createDialog(this.dialogs.entry.text);
		this.scene.setDialog(currentDialog);

		this.dialogs.entry.text = this.alternateEntryText;
	};

	Game.Model.Doctor.prototype.reset = function () {
		this.dialogs.entry.text = this.baseEntryText;
	};
}());