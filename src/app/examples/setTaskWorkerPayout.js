// Import big number library
const BN = require('bn.js');

// An example using the setTaskWorkerPayout operation
const setTaskWorkerPayout = async (colonyClient, taskId, amount, token) => {

  // Start set task worker payout operation
  const operation = await colonyClient.setTaskWorkerPayout.startOperation({
    taskId,
    token,
    amount: new BN(amount),
  })

  // Check out the logs to see the operation missing signees
  console.log('Missing Signees:', operation.missingSignees);

  // Serialize operation into JSON format
  const operationJSON = operation.toJSON();
  return operationJSON;

  // Store task worker payout operation in mock database
  // DATABASE.operations.setTaskWorkerPayout = operationJSON;

}

// Export setTaskWorkerPayout example
module.exports = setTaskWorkerPayout;
