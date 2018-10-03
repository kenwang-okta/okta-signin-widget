define(['parse-ms', '@sindresorhus/to-milliseconds'], function (parseMs, toMilliseconds) {

  const MOMENT_UNIT = {
    MILLISECOND: 'milliseconds',
    SECOND: 'seconds',
    MINUTE: 'minutes',
    HOUR: 'hours',
    DAY: 'days'
  };

  const MOMENT_UNIT_KEYS = Object.keys(MOMENT_UNIT);

  /**
   * @method convertMomentUnits
   * Conversion between moment's units and our units internally
   *
   * @param {String} momentUnit The units that val is in
   * @return {String} The key in the MOMENT_UNIT hash
   */
  const convertMomentUnits = function (momentUnit) {
    const entry = MOMENT_UNIT_KEYS.filter(k => MOMENT_UNIT[k] === momentUnit);

    return entry.length === 1 ? entry[0] : momentUnit;
  };

  return {

    /**
     * @method getTimeInHighestRelevantUnit
     * Will return a number in the units of the highest relevant time unit.
     * Only checks milliseconds, seconds, minutes, hours, and days.
     * E.g.
     *   15 minutes -> 15 minutes
     *   60 minutes ->  1 hours
     *   90 minutes -> 90 minutes
     *   24 hours   ->  1 days
     *
     * @typedef TimeWithUnit
     * @property {number} time the consolidated time
     * @property {string} unit the unit of the time

     * @param {Number} val  The amount of time
     * @param {String} unit The time unit
     * @return {TimeWithUnit} An object containing the amount of time and the unit
     */
    getTimeInHighestRelevantUnit: function (val, unit) {
      const defaultTimeObj = {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      };
      const normalizedUnit = MOMENT_UNIT[unit] || unit;
      let timeObj;

      try {
        const ms = toMilliseconds(Object.assign(defaultTimeObj, { [normalizedUnit]: val }));
        timeObj = parseMs(ms);
      } catch (error) {
        timeObj = {};
      }

      const duration = Object.keys(timeObj)
        .reduce((init, k) => {
          if (timeObj[k] !== 0) {
            init[k] = timeObj[k];
          }
          return init;
        }, {});

      let highestUnit;
      let time;
      if (Object.keys(duration).length === 1) {
        Object.keys(duration)
          .forEach(k => {
            time = duration[k];
            highestUnit = k;
          });
      } else {
        time = val;
        highestUnit = normalizedUnit;
      }

      return {
        time: time,
        unit: convertMomentUnits(highestUnit)
      };
    },

  };

});
