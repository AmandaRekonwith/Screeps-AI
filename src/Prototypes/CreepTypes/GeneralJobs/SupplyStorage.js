module.exports = function ()
{
	Creep.prototype.supplyStorage = function ()
	{
		let storage = Game.getObjectById(this.memory.job.targetID);

		if (storage)
		{
			let action = this.transfer(storage, RESOURCE_ENERGY);

			if (action == ERR_NOT_IN_RANGE)
			{
				let action2 = null;

				let structuresInRange = this.room.lookForAtArea(LOOK_STRUCTURES, this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1, true);
				let structuresInRangeCount = structuresInRange.length;
				if(structuresInRangeCount > 0)
				{
					for(let x=0; x<structuresInRangeCount; x++)
					{
						let structure = structuresInRange[x].structure;
						if(structure.structureType == "extension" && structure.energy < structure.energyCapacity)
						{
							action2 = this.transfer(structure, RESOURCE_ENERGY);

							console.log(action2);
						}
					}
				}

				if(action2 == null)
				{
					action2 = this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}

			if ( _.sum(storage.store) == storage.storeCapacity) // job complete
			{
				this.memory.job = null;
			}

			if (this.carry[RESOURCE_ENERGY] == 0)
			{
				this.memory.job = null;
				this.memory.currentTask = null;
			}
		}
		else
		{
			this.memory.job = null;
		}
	}
}