let RoomConstructionExtensionsController =
{
	run: function (room)
	{
		this.checkIfCanBuildExtensions(room);
		this.checkIfExtensionsMustBeDeleted(room);
	},

	checkIfExtensionsMustBeDeleted: function (room)
	{
		let roomControllerLevel = room.controller.level;

		let extensionsArray = room.find(FIND_MY_STRUCTURES,
			{
				filter: (structure) =>
				{
					return (structure.structureType == STRUCTURE_EXTENSION)
				}
			});

		let extensionsCount = extensionsArray.length;

		let maximumNumberOfExtensions = 0;

		switch (roomControllerLevel)
		{
			case 2:
				maximumNumberOfExtensions = 5;
				break;
			case 3:
				maximumNumberOfExtensions = 10;
				break;
			case 4:
				maximumNumberOfExtensions = 20;
				break;
			case 5:
				maximumNumberOfExtensions = 30;
				break;
			case 6:
				maximumNumberOfExtensions = 40;
				break;
			case 7:
				maximumNumberOfExtensions = 50;
				break;
			case 8:
				maximumNumberOfExtensions = 60;
				break;
			default:
				maximumNumberOfExtensions = 0;
		}

		if (extensionsCount > maximumNumberOfExtensions)
		{
			//DELETE ALL EXTENSION CONSTRUCTION SITES FIRST
			let extensionConstructionSitesArray = room.find(FIND_MY_CONSTRUCTION_SITES,
				{
					filter: (structure) =>
					{
						return (structure.structureType == STRUCTURE_EXTENSION)
					}
				});
			let extensionConstructionSitesCount = extensionConstructionSitesArray.length;
			for (let x = 0; x < extensionConstructionSitesCount; x++)
			{
				delete this.room.memory.jobs.firstPriorityJobs.buildStructure[extensionConstructionSitesArray[x].id];
				extensionConstructionSitesArray[x].remove();
			}
		}
		/*

		 let extensionConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES,
		 {
		 filter: (structure) =>
		 {
		 return (structure.structureType == STRUCTURE_EXTENSION)
		 }
		 });*/
	},

	checkIfCanBuildExtensions: function (room)
	{
		let roomControllerLevel = room.controller.level;

		if (roomControllerLevel > 1)
		{
			let extensions = room.find(FIND_MY_STRUCTURES,
				{
					filter: (structure) =>
					{
						return (structure.structureType == STRUCTURE_EXTENSION)
					}
				});

			let extensionConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES,
				{
					filter: (structure) =>
					{
						return (structure.structureType == STRUCTURE_EXTENSION)
					}
				});

			let totalExtensionsPlaced = extensions.length + extensionConstructionSites.length;

			let maximumNumberOfExtensions = 0;

			switch (roomControllerLevel)
			{
				case 2:
					maximumNumberOfExtensions = 5;
					break;
				case 3:
					maximumNumberOfExtensions = 10;
					break;
				case 4:
					maximumNumberOfExtensions = 20;
					break;
				case 5:
					maximumNumberOfExtensions = 30;
					break;
				case 6:
					maximumNumberOfExtensions = 40;
					break;
				case 7:
					maximumNumberOfExtensions = 50;
					break;
				case 8:
					maximumNumberOfExtensions = 60;
					break;
				default:
					maximumNumberOfExtensions = 0;
			}

			if (totalExtensionsPlaced < maximumNumberOfExtensions)
			{
				this.placeExtensionConstructionSite(room);
			}
		}
	},

	placeExtensionConstructionSite: function (room)
	{
		let spawns = room.find(FIND_MY_SPAWNS);
		let spawn = spawns[0];

		let constructionSiteFound = false;

		while (constructionSiteFound == false)
		{
			//0: left, 1: right
			let directionRandomizerLeftOrRight = Math.floor(Math.random() * 2);
			let directionLeftOrRight = "";
			if (directionRandomizerLeftOrRight == 0)
			{
				directionLeftOrRight = "Left";
			}
			if (directionRandomizerLeftOrRight == 1)
			{
				directionLeftOrRight = "Right";
			}
			//0: up, 1: down
			let directionRandomizerUpOrDown = Math.floor(Math.random() * 2);
			let directionUpOrDown = "";
			if (directionRandomizerUpOrDown == 0)
			{
				directionUpOrDown = "Up";
			}
			if (directionRandomizerUpOrDown == 1)
			{
				directionUpOrDown = "Down";
			}
			//also, remember x,y, coordinates in third dimension... x: 0, y: 1

			let extensionPlacementCoordinatesBeingChecked = room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown];
			if (extensionPlacementCoordinatesBeingChecked.x == 0 && extensionPlacementCoordinatesBeingChecked.y == 0)
			{
				room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].x = spawn.pos.x;
				room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].y = spawn.pos.y;
				extensionPlacementCoordinatesBeingChecked = room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown];
			}

			let movePositionLeftOrRight = 0;
			let movePositionUpOrDown = 0;

			if (directionLeftOrRight == "Right")
			{
				movePositionLeftOrRight = 2;
			}
			if (directionLeftOrRight == "Left")
			{
				movePositionLeftOrRight = -2;
			}
			if (directionUpOrDown == "Up")
			{
				movePositionUpOrDown = 2;
			}
			if (directionUpOrDown == "Down")
			{
				movePositionUpOrDown = -2;
			}

			let possibleXPosition = extensionPlacementCoordinatesBeingChecked.x + movePositionLeftOrRight;
			let possibleYPosition = extensionPlacementCoordinatesBeingChecked.y;

			if (possibleXPosition > 48 || possibleXPosition < 1)
			{
				if (possibleYPosition % 2 == 0)
				{
					possibleXPosition = 1 + spawn.pos.x;
				}
				else
				{
					possibleXPosition = spawn.pos.x;
				}
				possibleYPosition = possibleYPosition + movePositionUpOrDown;

				room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].x = possibleXPosition;
				room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].y = possibleYPosition;
			}

			let possiblePositionTerrainType = Game.map.getTerrainAt(possibleXPosition, possibleYPosition, room.name);

			if (possiblePositionTerrainType == "plain")
			{
				let action = room.createConstructionSite(possibleXPosition, possibleYPosition, STRUCTURE_EXTENSION);
				if (action == 0)
				{
					room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].x = possibleXPosition;
					room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].y = possibleYPosition;

					let constructionSite = room.lookForAt(LOOK_CONSTRUCTION_SITES, possibleXPosition, possibleYPosition);

					constructionSiteFound = true;
				}
			}
			else
			{
				if (possiblePositionTerrainType == "wall")
				{
					if (possibleYPosition % 2 == 0)
					{
						possibleXPosition = spawn.pos.x + 1;
					}
					else
					{
						possibleXPosition = spawn.pos.x + 0;
					}
					possibleYPosition = possibleYPosition + movePositionUpOrDown;
				}
			}

			room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].x = possibleXPosition;
			room.memory.construction.extensionPlacement[directionLeftOrRight + directionUpOrDown].y = possibleYPosition;
		}
	}
};

module.exports = RoomConstructionExtensionsController;