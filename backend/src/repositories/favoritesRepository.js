const { PutCommand, QueryCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("../lib/dynamoClient");
const env = require("../config/env");

async function saveFavorite({ userId, ticker, industry }) {
  const now = new Date().toISOString();
  await docClient.send(
    new PutCommand({
      TableName: env.favoritesTable,
      Item: {
        userId,
        ticker: ticker.toUpperCase(),
        industry,
        createdAt: now,
        updatedAt: now,
      },
    })
  );
}

async function listFavoritesByUser(userId) {
  const response = await docClient.send(
    new QueryCommand({
      TableName: env.favoritesTable,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    })
  );

  return response.Items || [];
}

async function searchFavoritesByIndustry({ userId, industry }) {
  const response = await docClient.send(
    new QueryCommand({
      TableName: env.favoritesTable,
      IndexName: "industry-index",
      KeyConditionExpression: "userId = :userId AND industry = :industry",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":industry": industry,
      },
    })
  );

  return response.Items || [];
}

async function removeFavorite({ userId, ticker }) {
  await docClient.send(
    new DeleteCommand({
      TableName: env.favoritesTable,
      Key: {
        userId,
        ticker: ticker.toUpperCase(),
      },
    })
  );
}

module.exports = {
  saveFavorite,
  listFavoritesByUser,
  searchFavoritesByIndustry,
  removeFavorite,
};
