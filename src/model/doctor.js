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

		this.dialogs.lifeScan = {
			branchKey: 3,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Any information about life forms on this planet?",
					callback: function () {
						self.selectDialog(self.dialogs.lifeForm);
					}
				}
			]
		};

		this.dialogs.lifeForm = {
			branchKey: 3,
			text: "The empire mothership have done life scan on the planet. We have detected signatures. This is certainly due to water presence.",
			choices: [
				{
					key: 0,
					text: "What is your opinion about life scanned?",
					callback: function () {
						self.selectDialog(self.dialogs.lifeKind);
					}
				}
			]
		};

		this.dialogs.lifeKind = {
			branchKey: 3,
			text: "I really don't know. But it could be more than just space worms.",
			choices: [
				{
					key: 0,
					text: "So we may meet hostility there?",
					callback: function () {
						self.selectDialog(self.dialogs.lifeHostility);
					}
				}
			]
		};

		this.dialogs.lifeHostility = {
			branchKey: 3,
			text: "I think this can be good for us. If there is water beneath the surface, we may discover a new specy. It would be a hude opportunity!",
			choices: [
				{
					key: 0,
					text: "You seem to know more than you say",
					callback: function () {
						self.selectDialog(self.dialogs.knowMore);
					}
				}
			]
		};

		this.dialogs.knowMore = {
			branchKey: 3,
			text: "The mothership has scan too structures which must have been build by some kind of intelligent mind. There is clearly what looks like an entrance to a basement in the planet. We should go there and see.",
			choices: [
				{
					key: 0,
					text: "We will go to the scanned basement",
					callback: function () {
						self.glad = true;
						self.selectDialog(self.dialogs.injectToxin);
					}
				},
				{
					key: 1,
					text: "The water mission is priority",
					callback: function () {
						self.glad = false;
						self.selectDialog(self.dialogs.injectToxin);
					}
				}
			]
		};

		this.dialogs.injectToxin = {
			branchKey: 3,
			text: "OK it's time now to inject anti toxin to the crew",
			choices: [
				{
					key: 0,
					text: "Ok let's inject this anti toxin to the crew",
					callback: function () {
						if (self.glad) {
							self.scene.toxinOK = true;
							self.selectDialog(self.dialogs.toxinInjected);
						} else {
							self.scene.lose("The doctor had another plan. He injected you a toxin instead.");
						}
					}
				},
				{
					key: 1,
					text: "You are strange. I put you under custody",
					callback: function () {
						if (Math.random() <= .75) {
							self.dead = true;
							self.scene.toxinOK = true;
							self.dialogBranches = [];
							self.selectDialog(self.dialogs.custody);
						} else {
							self.scene.lose("The doctor defends himself and kills you.");
						}
					}
				}
			]
		};

		this.dialogs.custody = {
			branchKey: 3,
			text: "The doctor is now out of the game. You inject yourself the anti toxin to the crew. You are now protected from toxin infection on this planet.",
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

		this.dialogs.toxinInjected = {
			branchKey: 3,
			text: "You are now protected from toxin infection on this planet.",
			choices: []
		};

		this.dialogs.incorporated = {
			branchKey: 2,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "When did you engage in Empire's army?",
					callback: function () {
						self.selectDialog(self.dialogs.enteredArmy);
					}
				}
			]
		};

		this.dialogs.enteredArmy = {
			branchKey: 2,
			text: "I engaged the army this year after some quick exams. I had an important civil career before.",
			choices: [
				{
					key: 0,
					text: "Where did you work before?",
					callback: function () {
						self.selectDialog(self.dialogs.civilianWork);
					}
				}
			]
		};

		this.dialogs.civilianWork = {
			branchKey: 2,
			text: "I worked in MedCenter, the biggest medical company on earth",
			choices: []
		};

		this.dialogs.procedure = {
			branchKey: 1,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "So, what is the medical procedure before landing?",
					callback: function () {
						self.selectDialog(self.dialogs.antitoxin);
					}
				}
			]
		};

		this.dialogs.antitoxin = {
			branchKey: 1,
			text: "The procedure is fair simple. I have to inject anti toxin to the whole crew.",
			choices: []
		};

		this.reset();
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
		this.setBranch(this.dialogs.exitBase);
		this.setBranch(this.dialogs.procedure);
		this.setBranch(this.dialogs.incorporated);
		this.setBranch(this.dialogs.lifeScan);
	};
}());