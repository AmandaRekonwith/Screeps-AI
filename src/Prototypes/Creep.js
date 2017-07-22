module.exports = function ()
{
	Creep.prototype.checkWhereToGetEnergy = function ()
	{
		let storageArrayWithEnergy = this.room.find(FIND_MY_STRUCTURES, {
			filter: (structure) =>
			{
				(structure.structureType == STRUCTURE_STORAGE
				&& structure.store[RESOURCE_ENERGY] > 0);
			}
		});
		let storageArrayCount = storageArrayWithEnergy.length;
		if (storageArrayCount > 0)
		{
			this.memory.energySource = {type: "storage", targetID: storageArrayWithEnergy[0].id};
			this.memory.currentTask = "Getting Energy";
			return "storage";
		}

		let containerArrayWithEnergy = this.room.find(FIND_STRUCTURES, {
			filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
			i.store[RESOURCE_ENERGY] > 0});
		let containerArrayWithEnergyCount = containerArrayWithEnergy.length;
		if (containerArrayWithEnergyCount > 0)
		{
			let containerRandomizer = Math.floor((Math.random() * containerArrayWithEnergyCount));
			this.memory.energySource = {type: "container", targetID: containerArrayWithEnergy[containerRandomizer].id};
			this.memory.currentTask = "Getting Energy";
			return "container";
		}

		let energySourcesArray = this.room.memory.environment.energySourcesArray;
		energySourcesArray = this.FisherYatesShuffle(energySourcesArray);

		let energySourcesArrayCount = energySourcesArray.length;
		if (energySourcesArrayCount > 0)
		{
			for (let z = 0; z < energySourcesArrayCount; z++)
			{
				let energySource = energySourcesArray[z];

				if (energySource.energy > 0 && energySource.numberOfCreepsCurrentlyHarvesting < energySource.numberOfAdjacentOpenTerrainTiles)
				{
					this.memory.energySource = {type: "source", targetID: energySource.id};
					this.memory.currentTask = "Getting Energy";
				}
			}

			return "source";
		}

		return "NO ENERGY FOUND";
	}

	Creep.prototype.getEnergy = function ()
	{
		if (this.memory.energySource != null)
		{
			let energySource = this.memory.energySource;

			switch (energySource.type)
			{
				case "storage":
					this.getEnergyFromStorage();
					break;
				case "container":
					this.getEnergyFromContainer();
					break;
				case "source":
					this.getEnergyFromSource();
					break;
				default:
					break;
			}
		}
	}

	Creep.prototype.getEnergyFromStorage = function ()
	{
		let energySource = Game.getObjectById(this.memory.energySource.targetID);

		let action = this.withdraw(energySource, RESOURCE_ENERGY);

		if (action == ERR_NOT_IN_RANGE)
		{
			this.moveTo(energySource.target, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}

	Creep.prototype.getEnergyFromContainer = function ()
	{
		let energySource = Game.getObjectById(this.memory.energySource.targetID);

		let action = this.withdraw(energySource, RESOURCE_ENERGY);

		if (action == ERR_NOT_IN_RANGE)
		{
			this.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}

	Creep.prototype.getEnergyFromSource = function ()
	{
		let energySource = Game.getObjectById(this.memory.energySource.targetID);

		let action = this.harvest(energySource);

		if (action == ERR_NOT_IN_RANGE)
		{
			this.moveTo(energySource, {visualizePathStyle: {stroke: '#ffaa00'}});
		}
	}

	Creep.prototype.run = function ()
	{
		if (this.memory.currentTask == null || (this.memory.currentTask == "Getting Energy" && this.memory.energySource == null))
		{
			this.memory.currentTask = "Getting Energy";
			let where = this.checkWhereToGetEnergy();
		}

		if (this.memory.currentTask == "Getting Energy")
		{
			this.getEnergy();
		}

		if (this.memory.currentTask != "Working" && this.carry[RESOURCE_ENERGY] == this.carryCapacity)
		{
			this.memory.currentTask = "Working";
		}

		if (this.memory.currentTask == "Working")
		{
			switch (this.memory.type)
			{
				case "worker":
					this.runWorker();
					break;
				case "hauler":
					//this.runHauler();
					break;
				case "stationary":
					this.runStationary();
					break;
				default:
					"";
			}
		}
	}


	Creep.prototype.FisherYatesShuffle = function (array)
	{
		var m = array.length, t, i;

		// While there remain elements to shuffle…
		while (m)
		{

			// Pick a remaining element…
			i = Math.floor(Math.random() * m--);

			// And swap it with the current element.
			t = array[m];
			array[m] = array[i];
			array[i] = t;
		}

		return array;
	}
}