module.exports = function ()
{
	Creep.prototype.getMaintainerJob = function ()
	{
		if(this.room.memory.structures.roadsArray.length > 0)
		{
			let road = this.room.memory.structures.roadsArray[0];

			if (road.hits / road.hitsMax <= .5)
			{
				let job = {
					targetID: road.id,
					type: "repair"
				};
				return job;
			}

			
			/*
			for (let container in this.room.memory.structures.containersArray)
			{
				if(container.hits / container.hitsMax <= .5)
				{
					let job = {
						targetID: containerID,
						type: "repair"
					};
					return job;
				}
			}
			*/
		}

		if(this.room.memory.structures.rampartsArray[0].hits < this.room.memory.structures.wallsArray[0].hits)
		{
			let job = {
				targetID: this.room.memory.structures.rampartsArray[0].id,
				type: "repair"
			};
			return job;
		}
		else
		{
			let job = {
				targetID: this.room.memory.structures.wallsArray[0].id,
				type: "repair"
			};
			return job;
		}

		/*
		let typeOfJobRandomizer = Math.floor((Math.random() * 100));
		let percentageChanceOfWorkingRampartRepairJob = 70;

		if (typeOfJobRandomizer < percentageChanceOfWorkingRampartRepairJob) //repair rampart
		{
			let rampart = this.room.memory.structures.rampartsArray[0];

			let job = {
				targetID: rampart.id,
				type: "repair"
			};
			return job;
		}
		else
		{
			let wall = this.room.memory.structures.wallsArray[0];
			let job = {
				targetID: wall.id,
				type: "repair"
			};
			return job;
		}
		*/
	},

	Creep.prototype.runMaintainer = function ()
	{
		if(this.room.storage)
		{
			if(this.room.memory.DEFCON == 5)
			{
				if (this.memory.currentTask == "Getting Energy" || this.memory.currentTask == null)
				{
					if(this.carry[RESOURCE_ENERGY] != this.carryCapacity)
					{
						this.memory.currentTask = "Getting Energy";
						this.getEnergyFromStorage();
					}
					else
					{
						if(this.ticksToLive < 1400)
	        			{
							this.memory.currentTask = "MoveToSpawnToRenew";
						}
						else
						{
							this.memory.currentTask = "Working";
						}
					}
				}

				if(this.memory.currentTask == "MoveToSpawnToRenew")
				{
					let spawn = Game.spawns[this.room.controller.id];
					if(spawn)
					{


						if(this.ticksToLive < 1400)
	        			{
	        				let attemptRenew = spawn.renewCreep(this);
	        				if(attemptRenew == ERR_NOT_IN_RANGE)
	        				{
	        					let action = this.moveTo(spawn);
	        				}
	        			}
	        			else
	        			{
	        				this.memory.currentTask = "Working";
	        			}
					}
					else
					{
						this.memory.currentTask = "Working";
					}
				}

				if (this.memory.currentTask == "Working")
				{
					if (this.memory.job != null)
					{
						switch (this.memory.job.type)
						{
							case "repair":
								this.repairDefense();
								break;
							default:
						}
					}
					else
					{
						this.memory.job = this.getMaintainerJob();
					}
				}
			}
		}
		else
		{
			this.suicide();
		}
	},

	Creep.prototype.repairDefense = function ()
    {
        let structure = Game.getObjectById(this.memory.job.targetID);
        //it's possible that the structure could disappear if construction completes,
        // so check, and then set the current task and job to null if it's gone.
        if (structure)
        {
            let action = this.repair(structure);

            if (action == ERR_NOT_IN_RANGE)
            {
				let structuresInRange = this.room.lookForAtArea(LOOK_STRUCTURES, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
				let structuresInRangeCount = structuresInRange.length;

				let structureToRepair = null;
				if(structuresInRangeCount > 0)
				{
					for(let x=0; x<structuresInRangeCount; x++)
					{
						let structureInRange = structuresInRange[x].structure;
						let action = this.repair(structureInRange);
					}
				}

                this.moveTo(structure, {visualizePathStyle: {stroke: '#ffffff'}});
            }

            if (this.carry[RESOURCE_ENERGY] == 0)
            {
                this.memory.job = null;
                this.memory.currentTask = null;
            }

            if(structure.hits == structure.hitsMax)
            {
				this.memory.job = null;
            }
        }
        else
        {
            this.memory.job = null;
        }
    }
}



