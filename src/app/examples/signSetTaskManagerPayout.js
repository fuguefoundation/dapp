// Import executeTaskMultisig helper method
const executeTaskMultisig = require('../helpers/executeTaskMultisig');

// An example using the setTaskManagerPayout operation
const signSetTaskManagerPayout = async (colonyClient, taskId) => {

  // Execute task multisig operation for the given colonyJS method
  await executeTaskMultisig(
    colonyClient,
    colonyClient.setTaskManagerPayout,
    taskId,
  );

  // Get the task manager payout
  const payout = await colonyClient.getTaskPayout.call({
    taskId,
    role: 'MANAGER',
    token: colonyClient.token._contract.address,
  });

  // Check out the logs to see the task manager payout
  console.log('Task Payout Amount:', payout.amount.toNumber());

  // Return the task manager payout
  return payout;

}

// Export signSetTaskManagerPayout example
module.exports = signSetTaskManagerPayout;
