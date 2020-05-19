import BigJS from 'big.js';
import toFormat from 'toformat';

const Big = toFormat(BigJS);

const utils = {
  prettyBalance: function (amt, opts = {}) {
    if (typeof amt !== 'number' && typeof amt !== 'string') {
      throw new Error(`${amt} is not a number`);
    }

    // default option values
    opts = { power: 8, decimal: 2, unit: 'Units', ...opts };

    const bn = Big(amt);
    const divisor = Big(10).pow(opts.power);
    const displayed = bn.div(divisor).toFormat(opts.decimal);
    return `${displayed.toString()} ${opts.unit}`;
  },

  paramConversion: {
    num: [
      'Compact<Balance>',
      'BalanceOf',
      'u8', 'u16', 'u32', 'u64', 'u128',
      'i8', 'i16', 'i32', 'i64', 'i128'
    ]
  }
};

export default utils;
