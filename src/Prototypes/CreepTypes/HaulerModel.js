let haulerTransportEnergyJobModel = require('Models_Job_Hauler_TransportEnergyModel');

let HaulerCreepModel =
{
	run: function (creep)
	{
		let room = creep.room;
		let jobIndex = creep.memory.jobIndex;

		if (jobIndex == null) //GET A JOB YOU LOSER
		{
			for (let containerID in room.memory.jobs.haulerJobBoard.jobs)
			{
				let haulerJob = room.memory.jobs.haulerJobBoard.jobs[containerID];
				if (haulerJob.active = false || haulerJob.creep == null)
				{
					creep.memory.jobIndex = containerID;
					creep.memory.jobType = "hauler";
				}
			}
		}

		if (creep.memory.jobType == "hauler")
		{
			haulerTransportEnergyJobModel.run(creep);
		}
	}
};

module.exports = HaulerCreepModel;