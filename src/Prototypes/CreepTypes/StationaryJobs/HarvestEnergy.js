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
			//AT JOB SITE
			switch(this.memory.currentTask) 
			{
				case "Harvesting":
		        	let action = this.harvest(energySource);
		       	 	break;
	       	 	case "Working":
		        	if(container.hits < container.hitsMax)
					{
						let action = this.repair(container);
					}
					else
					{
						//if(container.store[RESOURCE_ENERGY] == container.storeCapacity)
						/* I've run into an issue where the containers are somehow getting resources that are not energy put into them.
						I need to develop a fix. Until then, hardcoding 2000, to ensure that the above check is passed. 

						Additionally, I'm testing the hypothesis that it's more efficient to simply zap energy to the main base,
						if a link exists. Thus, if links exist, prioritize links first (instead of containers), and reduce the number of haulers...

						I've since found that hypothesis to work, but seems less efficient than hauling.
						Now trying container priority with one hauler.*/
						
						if(_.sum(container.store) < 2000)
						{
							let action = this.transfer(container, RESOURCE_ENERGY);
						}
						else
						{
							let link = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
							{filter: {structureType: STRUCTURE_LINK}})[0];

							if(link && (link.energyCapacity - link.energy) > this.carry[RESOURCE_ENERGY])
							{
								this.transfer(link, RESOURCE_ENERGY);
							}
						}
					}
					break;
		    }

			//NOW CHECK TO CHANGE JOB STATUS
			if (this.carry.energy == this.carryCapacity){ this.memory.currentTask = "Working"; }
			if (this.carry.energy == 0){ this.memory.currentTask = "Harvesting"; }

		}//at job site



		/*
		 if(this.carry.energy == this.carryCapacity && this.memory.currentTask == "Harvesting")
		 {
		 this.memory.currentTask = "DoneHarvesting";
		 }
		 */
		//let containersPositionsArray = job.containersPositionsArray;



	}
}