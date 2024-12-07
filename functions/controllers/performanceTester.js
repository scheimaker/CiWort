/**
 * Measure the execution time of a given function.
 * @param {Function} fn - The function to test.
 * @param {...any} args - Arguments to pass to the function.
 * @returns {Promise<{result: any, duration: number}>} - The result of the function and the duration in milliseconds.
 */
const measureExecutionTime = async (fn, ...args) => {
    const startTime = process.hrtime(); // Start the timer
    const result = await fn(...args); // Run the function with arguments
    const endTime = process.hrtime(startTime); // End the timer
  
    const duration = (endTime[0] * 1e3) + (endTime[1] / 1e6); // Convert to milliseconds
    return { result, duration };
  };
  
  module.exports = measureExecutionTime;
  