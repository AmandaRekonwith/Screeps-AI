module.exports = function ()
{
	Creep.prototype.runStationaryHarvester = function ()
	{
		let room = this.room;
		let energySourceID = this.memory.job.targetID;
		let job = room.memory.jobs.stationaryJobBoard.harvester[energySourceID];
		let jobSitePosition = job.pos;
		let currentTask = this.memory.currentTask;

		room.memory.jobs.stationaryJobBoard.harvester[energySourceID].creepID = this.id;
		room.memory.jobs.stationaryJobBoard.harvester[energySourceID].active = true;

		if ((this.pos.x != jobSitePosition.x) || (this.pos.y != jobSitePosition.y))
		{
			this.moveTo(jobSitePosition.x, jobSitePosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			if(this.carry.energy < this.carryCapacity &&
				(this.memory.currentTask == "WalkingToJobSite"
				|| this.memory.currentTask == "Harvesting"))
			{
				this.memory.currentTask = "Harvesting";

				let energySourceObject = Game.getObjectById(energySourceID);
				let energySourcePosition = energySourceObject.pos;
				let energySource = room.lookForAt(LOOK_SOURCES, energySourcePosition.x, energySourcePosition.y);

				if(energySource[0].energy == 0 || this.carry.energy == this.carryCapacity)
				{
					this.memory.currentTask = "Working";
				}
				else
				{
					this.harvest(energySource[0]);
				}
			}
			else
			{
				this.memory.currentTask = "Working";

				let containerPositionsArray = job.containerPositionsArray;
				let positionsCount = containerPositionsArray.length;

				for(let f=0; f<positionsCount; f++)
				{
					let structureContainersArray = room.find(FIND_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_CONTAINER
						&& i.hits < i.hitsMax
						&& i.pos.x == containerPositionsArray[f].x  && i.pos.y == containerPositionsArray[f].y
					});

					if (structureContainersArray != '')
					{
						let action = this.repair(structureContainersArray[0]);
					}
				}

				for(let z=0; z<positionsCount; z++)
				{
					let structureContainersArray = room.find(FIND_STRUCTURES, {
						filter: (i) => i.structureType == STRUCTURE_CONTAINER
						&& i.store[RESOURCE_ENERGY] < i.storeCapacity
						&& i.pos.x == containerPositionsArray[z].x && i.pos.y == containerPositionsArray[z].y
					});

					if(structureContainersArray != '')
					{
						let action = this.transfer(structureContainersArray[0], RESOURCE_ENERGY);
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