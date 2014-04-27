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
	Game.Model.Techy = function (game) {
		var self = this;
		this.game = game;
		this.scene = game.currentScene;
		this.baseEntryText = "Hello. I'm quite busy right now, make it quick.";
		this.alternateEntryText = "Tell me.";
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

		this.dialogs.stackinfo = {
			branchKey: 1,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Do you plan to engage one day?",
					callback: function () {
						self.selectDialog(self.dialogs.engage);
					}
				}
			]
		};

		this.dialogs.engage = {
			branchKey: 1,
			text: "No you know I am well paid in industry and saving the galaxy isn't really my taste, too much heroism.",
			choices: []
		};

		this.dialogs.ok = {
			branchKey: 2,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "Everything is OK with engines?",
					callback: function () {
						self.selectDialog(self.dialogs.toLand);
					}
				}
			]
		};

		this.dialogs.toLand = {
			branchKey: 2,
			text: "Yes the engine core is stable. Captain, I have to tell you something about my presence in this ship.",
			choices: [
				{
					key: 0,
					text: "What a severe air, tell me",
					callback: function () {
						self.selectDialog(self.dialogs.tell);
					}
				}
			]
		};

		this.dialogs.tell = {
			branchKey: 2,
			text: "You know I'm not a military. I am a freelancer which works for Stack industry.",
			choices: [
				{
					key: 0,
					text: "I know you work for Stack industry",
					callback: function () {
						self.selectDialog(self.dialogs.stack);
					}
				}
			]
		};

		this.dialogs.stack = {
			branchKey: 2,
			text: "You certainly don't know but Stack industry was a long time ago working with gaagle. The company which discovered the light speed space travel and which became the Empire 232 years ago.",
			choices: [
				{
					key: 0,
					text: "What is the link between Gaagle and this mission?",
					callback: function () {
						self.selectDialog(self.dialogs.gaagle);
					}
				}
			]
		};

		this.dialogs.gaagle = {
			branchKey: 2,
			text: "We have participated to the conception of this technology. And we think there is on this planet a missing part which will be a big step for humankind.",
			choices: [
				{
					key: 0,
					text: "What do you have to do to get this technology?",
					callback: function () {
						self.selectDialog(self.dialogs.seeyou);
					}
				}
			]
		};

		this.dialogs.seeyou = {
			branchKey: 2,
			text: "I have to go in a spotted place on this planet and I need you to do so. You will be rewarded for your help.",
			choices: [
				{
					key: 0,
					text: "I am sorry I cannot change my orders",
					callback: function () {
						self.scene.lose("The techy waited a moment and ejected himself with a pod. The icefly exploded a few minutes later due to core engine dysfunction.");
					}
				},
				{
					key: 1,
					text: "You were honest with me I accept",
					callback: function () {
						self.selectDialog(self.dialogs.accept);
					}
				}
			]
		};

		this.dialogs.accept = {
			branchKey: 2,
			text: "I appreciate. I know it is not an easy decision.",
			choices: []
		};

		this.dialogs.technology = {
			branchKey: 3,
			text: "dummy",
			choices: [
				{
					key: 0,
					text: "What is the technology on this ship?",
					callback: function () {
						self.selectDialog(self.dialogs.shipTech);
					}
				}
			]
		};

		this.dialogs.shipTech = {
			branchKey: 3,
			text: "This ship is a class icefly. It has four ion engines with a core Higgs accelerator. It is equiped too with four safety pods, So one of us should jump in space in case of problem.",
			choices: []
		};

		this.reset();
	};

	Game.Model.Techy.prototype.setBranch = function (dialog) {
		this.dialogBranches[dialog.branchKey] = dialog;
	};

	Game.Model.Techy.prototype.selectDialog = function (dialog) {
		var currentDialog;
		this.setBranch(dialog);

		currentDialog = this.createDialog(dialog.text);
		this.scene.setDialog(currentDialog);
	};

	Game.Model.Techy.prototype.createDialog = function (text) {
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

	Game.Model.Techy.prototype.activate = function (game) {
		var currentDialog = this.createDialog(this.dialogs.entry.text);
		this.scene.setDialog(currentDialog);

		this.dialogs.entry.text = this.alternateEntryText;
	};

	Game.Model.Techy.prototype.reset = function () {
		this.dialogs.entry.text = this.baseEntryText;
		this.setBranch(this.dialogs.exitBase);
		this.setBranch(this.dialogs.stackinfo);
		this.setBranch(this.dialogs.ok);
		this.setBranch(this.dialogs.technology);
	};
}());