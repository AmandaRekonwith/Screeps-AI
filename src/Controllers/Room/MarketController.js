var MarketController =
{
	run: function (room)
	{
		if(room.terminal.store[RESOURCE_ENERGY] >= 1000)
		{
			let resource = null;
			if(room.terminal.store[RESOURCE_HYDROGEN] >= 20000){ resource = RESOURCE_HYDROGEN; }
			if(room.terminal.store[RESOURCE_OXYGEN] >= 20000){ resource = RESOURCE_OXYGEN; }
			if(room.terminal.store[RESOURCE_LEMERGIUM] >= 20000){ resource = RESOURCE_LEMERGIUM; }
			if(room.terminal.store[RESOURCE_UTRIUM] >= 20000){ resource = RESOURCE_UTRIUM; }

			if(resource != null)
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
						if(highestMarketBuyOrder.remainingAmount >= 500)
						{
							result = Game.market.deal(highestMarketBuyOrder.id, 500, room.name);
						}
						else
						{
							result = Game.market.deal(highestMarketBuyOrder.id, highestMarketBuyOrder.remainingAmount, room.name);
						}
					}
				}
			}
		}
	}
}

module.exports = MarketController;