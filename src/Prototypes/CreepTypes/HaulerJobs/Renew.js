module.exports = function ()
{
	Creep.prototype.runHaulerRenew = function ()
	{
		let room = this.room;

		let currentTask = this.memory.currentTask;
		
		if(currentTask == "Renewing")
		{
			let spawnOneSpaceAway = this.pos.findInRange(FIND_MY_STRUCTURES, 1,
				{filter: {structureType: STRUCTURE_SPAWN}})[0];

			if(!spawnOneSpaceAway) //move closer
			{
				let spawnTwoSpacesAway = this.pos.findInRange(FIND_MY_STRUCTURES, 2,
					{filter: {structureType: STRUCTURE_SPAWN}})[0];

				if(!spawnTwoSpacesAway)
				{
					this.memory.currentTask = "Working";
				}
				else
				{
					this.moveTo(spawnTwoSpacesAway, {visualizePathStyle: {stroke: '#ffaa00'}});
				}
			}
			else
			{
				if(spawnOneSpaceAway.energy > 30 && spawnOneSpaceAway.spawning == null && this.ticksToLive < 1400)
				{
					 spawnOneSpaceAway.renewCreep(this);
				}
				else
				{
					this.memory.currentTask = "Working";
				}
			}
		}
	}
}