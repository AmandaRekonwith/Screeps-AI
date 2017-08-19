module.exports = function ()
{
	Creep.prototype.runStationaryResourceHarvester = function ()
	{
		 let room = this.room;
		 let resourceID = this.memory.job.targetID;
		 let resource = Game.getObjectById(resourceID);
		 let job = room.memory.jobs.stationaryJobBoard.harvestResource[resourceID];

		 let currentTask = this.memory.currentTask;

		 room.memory.jobs.stationaryJobBoard.harvestResource[resourceID].creepID = this.id;
		 room.memory.jobs.stationaryJobBoard.harvestResource[resourceID].active = true;

		 let resourceXPosition = resource.pos.x;
		 let resourceYPosition = resource.pos.y;

		 let lab = null;
		 let labExists = false;

		 let structuresArray = room.lookForAtArea(LOOK_STRUCTURES, resourceYPosition - 2, resourceXPosition - 2, resourceYPosition + 2, resourceXPosition +2, true);
		 let structuresCount = structuresArray.length;

		 for(let x=0; x<structuresCount; x++)
		 {
			 let structure = structuresArray[x].structure;

			 if(structure.structureType == "lab")
			 {
				 lab = structure;
				 labExists = true;
			 }
		 }

		 let jobPosition = null;

		 if(labExists == true)
		 {
			 let possibleJobPositionsArray = new Array();
			 possibleJobPositionsArray.push({x: resource.pos.x - 1, y: resource.pos.y - 1});
			 possibleJobPositionsArray.push({x: resource.pos.x, y: resource.pos.y - 1});
			 possibleJobPositionsArray.push({x: resource.pos.x + 1, y: resource.pos.y - 1});
			 possibleJobPositionsArray.push({x: resource.pos.x - 1, y: resource.pos.y});
			 possibleJobPositionsArray.push({x: resource.pos.x + 1, y: resource.pos.y});
			 possibleJobPositionsArray.push({x: resource.pos.x - 1, y: resource.pos.y + 1});
			 possibleJobPositionsArray.push({x: resource.pos.x, y: resource.pos.y + 1});
			 possibleJobPositionsArray.push({x: resource.pos.x + 1, y: resource.pos.y + 1});


			 for (let x = 0; x < 8; x++)
			 {
				 let adjacentStructures = room.lookForAtArea(LOOK_STRUCTURES, possibleJobPositionsArray[x].y - 1, possibleJobPositionsArray[x].x - 1,  possibleJobPositionsArray[x].y + 1,  possibleJobPositionsArray[x].x + 1, true);
				 let adjacentStructuresCount = adjacentStructures.length;

				 let labAndExtractorCount = 0;

				 for(let z=0; z<adjacentStructuresCount; z++)
				 {
					 if(adjacentStructures[z].structure.structureType == "lab" || adjacentStructures[z].structure.structureType == "extractor")
					 {
						 labAndExtractorCount += 1;
					 }
				 }

				 if(labAndExtractorCount == 2)
				 {
					 if(room.memory.environment.terrainMapArray[possibleJobPositionsArray[x].x][possibleJobPositionsArray[x].y] != 3)
					 {

						 jobPosition = possibleJobPositionsArray[x];
					 }
				 }
			 }

			 if(jobPosition != null)
			 {
				 if ((this.pos.x != jobPosition.x) || (this.pos.y != jobPosition.y))
				 {
					 this.moveTo(jobPosition.x, jobPosition.y, {visualizePathStyle: {stroke: '#ffaa00'}});
					 this.memory.currentTask = "WalkingToJobSite";
				 }
				 else
				 {
					 this.memory.currentTask = "Harvesting";
				 }
			 }

			 if (this.memory.currentTask == "Harvesting")
			 {
				 if (_.sum(this.carry) == this.carryCapacity)
				 {
					 this.memory.currentTask = "Working";
				 }
			 }

			 if (this.memory.currentTask == "Harvesting")
			 {
				 let action = this.harvest(resource);
			 }

			 if (this.memory.currentTask == "Working")
			 {
				 let action = this.transfer(lab, resource.mineralType);
			 }
		 }

		/*
		 if(this.carry.resource == this.carryCapacity && this.memory.currentTask == "Harvesting")
		 {
		 this.memory.currentTask = "DoneHarvesting";
		 }
		 */
		//let containersPositionsArray = job.containersPositionsArray;


	}
}