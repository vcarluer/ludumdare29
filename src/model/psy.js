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
	Game.Model.Psy = function (game) {
		var self = this;
		this.game = game;
		this.scene = game.currentScene;
		this.baseEntryText = "You seem a bit nervous captain. Tell me what is bothering you.";
		this.alternateEntryText = "I am at your disposal captain.";
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

		this.dialogs.presence = {
			branchKey: 1,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Why does the empire sent me a psy?",
					callback: function () {
						self.selectDialog(self.dialogs.psy);
					}
				}
			]
		};

		this.dialogs.psy = {
			branchKey: 1,
			text: "You should know we are often sent in risky exploration missions.",
			choices: [
				{
					key: 0,
					text: "The Empire think the mission is risky?",
					callback: function () {
						self.selectDialog(self.dialogs.risky);
					}
				}
			]
		};

		this.dialogs.risky = {
			branchKey: 1,
			text: "It sounds like that to me. They may fear you discover some scary things out there. I will help you if it happens.",
			choices: []
		};

		this.dialogs.linguist = {
			branchKey: 2,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "They tell me you're a linguist too?",
					callback: function () {
						self.selectDialog(self.dialogs.tellLinguist);
					}
				}
			]
		};

		this.dialogs.tellLinguist = {
			branchKey: 2,
			text: "Yes I am specialized in alien research. There is no intelligent alien form we know that, but we study what could be their language if they were existing. I know it can sounds weird.",
			choices: [
				{
					key: 0,
					text: "You are paid to study aliens myths?",
					callback: function () {
						self.selectDialog(self.dialogs.paid);
					}
				}
			]
		};

		this.dialogs.paid = {
			branchKey: 2,
			text: "I work with people which think aliens are existing. Some are quite crazy and believe in a lost planet called Atlantis. But they allow me to work on linguistic. Don't worry there is no link with our today's mission.",
			choices: []
		};

		this.dialogs.land = {
			branchKey: 3,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "You will stay in spaceship after landing",
					callback: function () {
						self.selectDialog(self.dialogs.after);
					}
				}
			]
		};

		this.dialogs.after = {
			branchKey: 3,
			text: "As you want but I can help you down there. Some of your crew here seems already quite nervous.",
			choices: [
				{
					key: 0,
					text: "You think they are nervous?",
					callback: function () {
						self.selectDialog(self.dialogs.nervous);
					}
				}
			]
		};

		this.dialogs.nervous = {
			branchKey: 3,
			text: "Yes. Particularly the doctor. He's certainly not used to this kind of missions. The techy is quite nervous too. The pilot seems calm, but in our job we think that being too calm is not a good sign.",
			choices: [
				{
					key: 0,
					text: "Thank you I will watch them",
					callback: function () {
						self.scene.psyOK = true;
						self.selectDialog(self.dialogs.watch);
					}
				}
			]
		};

		this.dialogs.watch = {
			branchKey: 3,
			text: "You're welcome, take care of you too.",
			choices: []
		};


		this.reset();
	};

	Game.Model.Psy.prototype.setBranch = function (dialog) {
		this.dialogBranches[dialog.branchKey] = dialog;
	};

	Game.Model.Psy.prototype.selectDialog = function (dialog) {
		var currentDialog;
		this.setBranch(dialog);

		currentDialog = this.createDialog(dialog.text);
		this.scene.setDialog(currentDialog);
	};

	Game.Model.Psy.prototype.createDialog = function (text) {
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

	Game.Model.Psy.prototype.activate = function (game) {
		var currentDialog = this.createDialog(this.dialogs.entry.text);
		this.scene.setDialog(currentDialog);

		this.dialogs.entry.text = this.alternateEntryText;
	};

	Game.Model.Psy.prototype.reset = function () {
		this.dialogs.entry.text = this.baseEntryText;
		this.setBranch(this.dialogs.exitBase);
		this.setBranch(this.dialogs.presence);
		this.setBranch(this.dialogs.linguist);
		this.setBranch(this.dialogs.land);
	};
}());