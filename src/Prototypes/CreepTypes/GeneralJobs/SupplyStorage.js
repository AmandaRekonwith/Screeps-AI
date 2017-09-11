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

				let topLeft = {};
				if(this.pos.y-1 < 0){ topLeft.y = 0}else{topLeft.y = this.pos.y-1}
				if(this.pos.x -1 < 0){ topLeft.x = 0}else{topLeft.x = this.pos.x-1}

				let bottomRight = {};
				if(this.pos.y+1 > 49){ bottomRight.y = 49}else{bottomRight.y = this.pos.y+1}
				if(this.pos.x+1 > 49){ bottomRight.x = 49}else{bottomRight.x = this.pos.x+1}

				let structuresInRange = this.room.lookForAtArea(LOOK_STRUCTURES, topLeft.y, topLeft.x, bottomRight.y, bottomRight.x, true);

				let structuresInRangeCount = structuresInRange.length;
				if(structuresInRangeCount > 0)
				{
					for(let x=0; x<structuresInRangeCount; x++)
					{
						let structure = structuresInRange[x].structure;
						if(structure.structureType == "extension" && structure.energy < structure.energyCapacity)
						{
							action2 = this.transfer(structure, RESOURCE_ENERGY);
						}
					}
				}

				if(action2 == null)
				{
					action2 = this.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
				}

				if(this.id == '59b5491b1041e66abdc1597d')
				{
					console.log(action2);
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