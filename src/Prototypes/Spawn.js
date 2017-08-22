let controllerCreepsNameGenerator = require('Controllers_Creeps_NameGeneratorController');

module.exports = function ()
{

	//200, 1 work part, 1 carry part, 2 move parts, 12 ticks
	StructureSpawn.prototype.createSmallestWorkerCreep =
		function ()
		{
			var body = [
				WORK,
				CARRY,
				MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "smallest",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//450, 1 work parts, 3 carry part, 4 move parts, 24 ticks
	StructureSpawn.prototype.createSmallerWorkerCreep =
		function ()
		{
			var body = [WORK,
				CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "smaller",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//700, 2 work parts, 4 carry parts, 6 move parts, 36 ticks
	StructureSpawn.prototype.createSmallWorkerCreep =
		function ()
		{
			var body = [WORK, WORK,
				CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, CARRY];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "small",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//900, 2 work parts, 6 carry parts, 8 move parts, 48 ticks
	StructureSpawn.prototype.createBigWorkerCreep =
		function ()
		{
			var body = [WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "big",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1150, 3 work parts, 7 carry parts, 10 move parts, 54 ticks
	StructureSpawn.prototype.createBiggerWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "bigger",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1450, 5 work parts, 7 carry parts, 12 move parts, 72 ticks
	StructureSpawn.prototype.createBiggestWorkerCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				size: "biggest",
				type: "worker",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1000 energy, 10 carry parts, 10 move parts, 60 ticks.
	//800 energy, 8 carry parts, 8 move parts, 48 ticks.
	//600 energy, 6 carry parts, 6 move parts, 36 ticks
	//500 energy, 5 carry parts, 5 move parts, 30 ticks.
	StructureSpawn.prototype.createHaulerCreep =
		function ()
		{
			var body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "hauler",
				currentTask: null,
				job: null
			});
		};

	//1300 energy required, 4 work parts, 2 carry parts, 1 move parts, 21 ticks.
	//1100
	//1150 39 ticks
	StructureSpawn.prototype.createStationaryCreep =
		function (roomLevel)
		{
			let size = null;
			var body = null;
			if(roomLevel == 2)
			{
				body = [WORK, WORK, WORK, WORK,
					CARRY, CARRY,
					MOVE];
				size = "smallest";

			}
			if(roomLevel == 3)
			{
				body = [WORK, WORK, WORK, WORK, WORK,
					CARRY, CARRY,
					MOVE];
				size = "smaller";
			}
			if(roomLevel >= 4)
			{
				body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
					CARRY, CARRY, CARRY,
					MOVE, MOVE, MOVE];
				size = "big";
			}
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "stationary",
				size: size,
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//1300 energy required, 10 work parts, 3 carry parts, 3 move parts, 48 ticks.
	//1100
	//1150 39 ticks
	StructureSpawn.prototype.createBigStationaryCreep =
		function ()
		{
			var body = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
				CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "stationary",
				size: "big",
				currentTask: null,
				energySource: null,
				job: null
			});
		};

	//650 energy required, 1 claimer part, 1 move part.
	StructureSpawn.prototype.createClaimerCreep =
		function ()
		{
			var body = [CLAIM, MOVE];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "claimer",
				currentTask: null,
				job: null
			});
		};

	//250 energy required, 1 carry part, 2 move parts, 1 work part.
	StructureSpawn.prototype.createRemoteUpgradeControllerCreep =
		function ()
		{
			var body = [CARRY, MOVE, MOVE, WORK];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "remoteUpgradeController",
				currentTask: null,
				job: null
			});
		};

	//1450 energy required, 3 work parts, 13 move parts, 10 carry parts.
	StructureSpawn.prototype.createRemoteBuildStructureCreep =
		function ()
		{
			var body = [WORK, WORK, WORK,
				CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
			];
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "remoteBuildStructure",
				currentTask: null,
				job: null
			});
		};

	//1250 energy required, 4 tough parts, 2 attack parts, 2 heal parts, 2 ranged attack parts, 5 move parts
	StructureSpawn.prototype.createInfantryCreep =
		function ()
		{
			var body = [TOUGH, TOUGH,
				ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
			MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
			HEAL]
			/* var body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
				MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
				ATTACK, ATTACK, ATTACK, ATTACK, ATTACK

			];
			*/
			var creepName = controllerCreepsNameGenerator.getName();
			this.createCreep(body, creepName, {
				type: "infantry",
				currentTask: null,
				job: null
			});
		};
};