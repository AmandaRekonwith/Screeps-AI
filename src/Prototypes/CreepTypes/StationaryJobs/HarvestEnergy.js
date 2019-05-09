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

		if ((this.pos.x != container.pos.x) || (this.pos.y != container.pos.y))
		{
			this.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
			this.memory.currentTask = "WalkingToJobSite";
		}
		else
		{
			let spawn = Game.spawns[energySourceID];
			let link = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
			{filter: {structureType: STRUCTURE_LINK}})[0];

			let action = null;
			//AT JOB SITE

			//if (this.carry[RESOURCE_ENERGY] == this.carryCapacity){ this.memory.currentTask = "Working"; }
			if(energySource.energy == 0)
			{ 
				if(_.sum(this.carry) == this.carryCapacity){ this.memory.currentTask = "Waiting-Working"; }
				else
				{
					this.memory.currentTask = "Waiting-GatheringEnergy";
				}
			}
			else
			{
				if(_.sum(this.carry) == this.carryCapacity){ this.memory.currentTask = "Working"; }
				else
				{

					this.memory.currentTask = "Harvesting";
				}
			}

			switch(this.memory.currentTask) 
			{
				case "Harvesting":
					action = this.harvest(energySource);
					break;
	       	 	case "Working":
					if(link) 
					{
						if(link.energy < link.energyCapacity)
						{
							action = this.transfer(link, RESOURCE_ENERGY);
						}
					}

					if(action != 0 && spawn)
					{
						if(spawn.energy < spawn.energyCapacity)
						{
							action = this.transfer(spawn, RESOURCE_ENERGY);
						}
					}

					if(action != 0 && _.sum(container.store) < 2000)
					{
						action = this.transfer(container, RESOURCE_ENERGY);
					}
					break;
				case "Waiting-GatheringEnergy":
						this.withdraw(container, RESOURCE_ENERGY);
					break;
				case "Waiting-Working":
						if(spawn)
						{
							if(spawn.energy < spawn.energyCapacity)
							{
								action = this.transfer(spawn, RESOURCE_ENERGY);
							}

							if(this.ticksToLive < 1400)
		        			{
		        				spawn.renewCreep(this);
		        			}
		        		}

		        		if(action != 0)
		        		{
			        		if(container.hits < container.hitsMax)
							{
								action = this.repair(container);
							}
						}

						if(link && action != 0)
						{
							if(link.energyCapacity - link.energy > 0)
							{
								action = this.transfer(link, RESOURCE_ENERGY);
							}
						}
					break;
		    }
		}//at job site
	}
}