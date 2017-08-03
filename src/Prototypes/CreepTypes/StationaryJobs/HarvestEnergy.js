module.exports = function ()
{
	Creep.prototype.runStationaryEnergyHarvester = function ()
	{
		let room = this.room;
		let energySourceID = this.memory.job.targetID;
		let energySource = Game.getObjectById(energySourceID);
		let job = room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID];
		let containerID = job.containerID;
		let container = Game.getObjectById(containerID);
		let currentTask = this.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].creepID = this.id;
		room.memory.jobs.stationaryJobBoard.harvestEnergy[energySourceID].active = true;

		if ((this.pos.x != container.pos.x) || (this.pos.y != container.pos.y))
		{
			this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			this.memory.currentTask = "Harvesting";
		}

		if(	(this.memory.currentTask == "Harvesting" || this.memory.currentTask == "Working"))
		{
			if (energySource.energy == 0 || this.carry.energy == this.carryCapacity)
			{
				this.memory.currentTask = "Working";
			}

			if(this.memory.currentTask == "Harvesting")
			{
				let action = this.harvest(energySource);
			}

			if(this.memory.currentTask == "Working")
			{
				if(container.hits < container.hitsMax)
				{
					let action = this.repair(container);
				}
				else
				{
					if(container.store[RESOURCE_ENERGY] == container.storeCapacity)
					{
						let linksArray = room.lookForAtArea(LOOK_STRUCTURES, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true);
						let linksCount = linksArray.length;
						for(let y=0; y<linksCount; y++)
						{
							let structure = linksArray[y].structure;
							if(structure.structureType == "link")
							{
								this.transfer(structure, RESOURCE_ENERGY);
							}
						}
					}
					else
					{
						let action = this.transfer(container, RESOURCE_ENERGY);
					}
				}

				if (this.carry.energy == 0)
				{
					this.memory.currentTask = "Harvesting";
				}
			}
		}



		/*
		 if(this.carry.energy == this.carryCapacity && this.memory.currentTask == "Harvesting")
		 {
		 this.memory.currentTask = "DoneHarvesting";
		 }
		 */
		//let containersPositionsArray = job.containersPositionsArray;



	}
}