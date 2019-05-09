var MarketController =
{
	run: function (room)
	{
		if(room.terminal.store[RESOURCE_ENERGY] >= 100000)
		{
			let resource = Game.getObjectById(room.memory.environment.resourcesArray[0]);

			if(room.terminal.store[resource.mineralType] >= 50000)
			{
				this.examineMarketTryToSellResource(room, resource.mineralType);
			}

			if(room.storage.store[RESOURCE_ENERGY] > 975000 && room.terminal.store[RESOURCE_ENERGY] >= 10000)
			{
				resource = RESOURCE_ENERGY;
				this.examineMarketTryToSellResource(room, resource);
			}
		}
	},

	examineMarketTryToSellResource: function (room, resource)
	{
		let marketBuyOrdersArray = Game.market.getAllOrders({type: ORDER_BUY, resourceType: resource});

		let marketBuyOrdersCount = marketBuyOrdersArray.length;

		if(marketBuyOrdersCount > 0)
		{
			let highestMarketBuyOrderPrice = 0;
			let highestMarketBuyOrder = null;

			for (let x = 0; x < marketBuyOrdersCount; x++)
			{
				let marketBuyOrder = marketBuyOrdersArray[x];

				if(marketBuyOrder.price > highestMarketBuyOrderPrice && marketBuyOrder.remainingAmount > 1)
				{
					highestMarketBuyOrderPrice = marketBuyOrder.price;
					highestMarketBuyOrder = marketBuyOrder;
				}
			}

			let result = null;

			if(highestMarketBuyOrderPrice >= .01)
			{
				if(highestMarketBuyOrder.remainingAmount >= 1000)
				{
					result = Game.market.deal(highestMarketBuyOrder.id, 1000, room.name);
				}
				else
				{
					result = Game.market.deal(highestMarketBuyOrder.id, highestMarketBuyOrder.remainingAmount, room.name);
				}
			}
		}
	}
}

module.exports = MarketController;