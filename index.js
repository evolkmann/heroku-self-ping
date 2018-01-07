"use strict";

const request = require('request');
const isHeroku = require('is-heroku');

/**
 * heroku-self-ping
 * @param url - (required) The URL to ping. If no URL is provided,
 *              heroku-self-ping will not do anything.
 * @param options - Configuration object with one or more of the following:
 *                  -> 'interval' (number) The interval in milliseconds (Default: 20min)
 *                  -> 'logger' (function) A logger function which accepts a string (Default: console.log)
 *                  -> 'verbose' (boolean) Will produce more logs if enabled (Default: false)
 * @return {*} Returns false if no URL is provided or if the function is executed
 *             in a non-heroku environment. Otherwise will perform the request
 *             in the specified interval.
 */
export const herokuSelfPing = (url, options) => {
    if (!options) {
        options = {};
    }

    options.interval = options.interval || 20 * 1000 * 60;
    options.logger = options.logger || console.log;
    options.verbose = options.verbose || false;

    /**
     * Convenience method to log a message with a prefix.
     * @param msg The message to log to the logger configured in the options
     */
    const log = (msg) => options.logger(`[heroku-self-ping] ${msg}`);

    if (!url) {
        options.verbose && log('No URL provided. Exiting.');
        return false;
    }
    if (!isHeroku) {
        options.verbose && log('Heroku not detected. Exiting.');
        return false;
    }
    log(`Setting up hearbeat to '${url}' every ${options.interval}ms.`);

    return setInterval(() => {
        log(`Sending hearbeat to '${url}'`);
        request(url);
    }, options.interval);
};

// Make the function available for require()
module.exports = herokuSelfPing;
