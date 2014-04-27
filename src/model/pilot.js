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
	Game.Model.Pilot = function (game) {
		var self = this;
		this.game = game;
		this.scene = game.currentScene;
		this.baseEntryText = "Hey don't bother me while I pilot. What do you want?";
		this.alternateEntryText = "You again! What?";
		this.dialogBranches = [];

		this.dialogs = {};

		this.dialogs.entry = {};
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

		this.dialogs.procedure = {
			branchKey: 1,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Tell me what is the procedure to land?",
					callback: function () {
						self.selectDialog(self.dialogs.toLand);
					}
				}
			]
		};

		this.dialogs.toLand = {
			branchKey: 1,
			text: "We will land in a protected area down a cliff.",
			choices: [
				{
					key: 0,
					text: "Isn't it risky with the cliff?",
					callback: function () {
						self.selectDialog(self.dialogs.risky);
					}
				}
			]
		};

		this.dialogs.risky = {
			branchKey: 1,
			text: "We won't stay long so it's OK.",
			choices: [
				{
					key: 0,
					text: "The mission can be long",
					callback: function () {
						self.selectDialog(self.dialogs.howthat);
					}
				}
			]
		};

		this.dialogs.howthat = {
			branchKey: 1,
			text: "Forget. I just hope the mission will be short.",
			choices: [
				{
					key: 0,
					text: "I don't like your tone of voice",
					callback: function () {
						self.selectDialog(self.dialogs.dontlike);
					}
				}
			]
		};

		this.dialogs.dontlike = {
			branchKey: 1,
			text: "You know, everyone have orders, it's army you should know. Mine are to make this mission a quick one.",
			choices: [
				{
					key: 0,
					text: "Why the Empire would have gave you other orders?",
					callback: function () {
						self.selectDialog(self.dialogs.contrary);
					}
				}
			]
		};

		this.dialogs.contrary = {
			branchKey: 1,
			text: "There are traitors on this ship. I know you aren't one. Let me do my job and I take you back with me.",
			choices: [
				{
					key: 0,
					text: "We will arrest them after",
					callback: function () {
						self.scene.pilotOK = false;
						self.selectDialog(self.dialogs.arrestAfter);
					}
				},
				{
					key: 1,
					text: "I cannot accept mutiny",
					callback: function () {
						if (Math.random() <= .75) {
							self.dead = true;
							self.scene.pilotOK = true;
							self.dialogBranches = [];
							self.selectDialog(self.dialogs.mutiny);
						} else {
							self.scene.lose("The pilot grab is laser and kills you.");
						}
					}
				}
			]
		};

		this.dialogs.arrestAfter = {
			branchKey: 1,
			text: "OK we will do this. You do your mission as planned and we arrest them after.",
			choices: []
		};

		this.dialogs.mutiny = {
			branchKey: 1,
			text: "The pilot is now under arrest. You program the auto pilot on the ship, let's hope it's enough to land safely.",
			choices: [
				{
					key: 0,
					text: "continue",
					callback: function () {
						self.scene.noDialog();
					}
				}
			]
		};

		this.dialogs.model = {
			branchKey: 2,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "what is this spaceship model?",
					callback: function () {
						self.selectDialog(self.dialogs.firebee);
					}
				}
			]
		};

		this.dialogs.firebee = {
			branchKey: 2,
			text: "I am pretty sure it's a firebee.",
			choices: []
		};

		this.dialogs.empire = {
			branchKey: 3,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Why does the empire sent a so small team?",
					callback: function () {
						self.selectDialog(self.dialogs.sensible);
					}
				}
			]
		};

		this.dialogs.sensible = {
			branchKey: 3,
			text: "I suspect there is sensible information in there. They may want to control it if we find it",
			choices: [
				{
					key: 0,
					text: "What sensible information?",
					callback: function () {
						self.selectDialog(self.dialogs.likeWhat);
					}
				}
			]
		};

		this.dialogs.likeWhat = {
			branchKey: 3,
			text: "I don't know, maybe a shameful past. People are talking about a planet which have disappeared in one day and will destroy the empire. Sometimes space tavern stories can be true.",
			choices: []
		};

		this.reset();
	};

	Game.Model.Pilot.prototype.setBranch = function (dialog) {
		this.dialogBranches[dialog.branchKey] = dialog;
	};

	Game.Model.Pilot.prototype.selectDialog = function (dialog) {
		var currentDialog;
		this.setBranch(dialog);

		currentDialog = this.createDialog(dialog.text);
		this.scene.setDialog(currentDialog);
	};

	Game.Model.Pilot.prototype.createDialog = function (text) {
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

	Game.Model.Pilot.prototype.activate = function (game) {
		var currentDialog = this.createDialog(this.dialogs.entry.text);
		this.scene.setDialog(currentDialog);

		this.dialogs.entry.text = this.alternateEntryText;
	};

	Game.Model.Pilot.prototype.reset = function () {
		this.dialogs.entry.text = this.baseEntryText;
		this.setBranch(this.dialogs.exitBase);
		this.setBranch(this.dialogs.procedure);
		this.setBranch(this.dialogs.model);
		this.setBranch(this.dialogs.empire);
	};
}());