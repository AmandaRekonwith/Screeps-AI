let stationaryBargeMiningJobModel = require('Models_Job_Stationary_BargeMiningModel');

let StationaryCreepModel = {

	/** @param {Creep} creep **/
	run: function (creep)
	{
		let room = creep.room;
		let jobIndex = creep.memory.jobIndex;

		if (jobIndex == null) //GET A JOB YOU LOSER
		{
			let stationaryHarvesterJobs = room.memory.jobs.stationaryJobBoard.harvesterJobs;
			let stationaryHarvesterJobsCount = stationaryHarvesterJobs.length;

			for (let x = 0; x < stationaryHarvesterJobsCount; x++)
			{
				stationaryHarvesterJob = stationaryHarvesterJobs[x];
				if (stationaryHarvesterJob.active = false || stationaryHarvesterJob.creep == null)
				{
					creep.memory.jobIndex = x;
					creep.memory.jobType = "harvester";
				}
			}
		}

		if (creep.memory.jobType == "harvester")
		{
			stationaryBargeMiningJobModel.run(creep);
		}


	}
};

module.exports = StationaryCreepModel;