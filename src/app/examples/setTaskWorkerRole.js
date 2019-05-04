// Import mock database
const DATABASE = require('../helpers/database');
// An example using the setTaskWorkerRole method
const setTaskWorkerRole = async (colonyClient, taskId, user) => {

  // Update the worker role of the task
  const operation = await colonyClient.setTaskWorkerRole.startOperation({
    taskId,
    user,
  });

  // Check out the logs to see the operation missing signees
  console.log('Missing Signees:', operation.missingSignees);

  // Serialize the operation into JSON format
  const operationJSON = operation.toJSON();

  // Save the operation to our mock database
  DATABASE.operations.setTaskWorkerRole = operationJSON;
}

// Export setTaskWorkerRole example
module.exports = setTaskWorkerRole;
