import deepDiff, { applyChange } from 'deep-diff';
import _ from 'lodash';

export const undoableConst = {
  UNDO: 'UNDOABLE/UNDO',
  REDO: 'UNDOABLE/REDO',
  INIT: 'UNDOABLE/INIT',
};

export const undoableAction = {
  undo: () => ({ type: undoableConst.UNDO }),
  redo: () => ({ type: undoableConst.REDO }),
};

export const defaultConfig = {
  actionExclude: [],
  limit: 30,
  initAction: undoableConst.INIT,
  useDiff: false,
};

export function undoable(reducer, config = {}) {
  const undoConfig = { ...defaultConfig, ...config };
  const { limit, actionExclude, useDiff } = undoConfig;
  const initState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
  };

  function diff(lhs, rhs) {
    if (useDiff) {
      return deepDiff(lhs, rhs);
    }
    return rhs;
  }

  function applyDiff(target, diffs) {
    if (!useDiff) {
      return diffs;
    }
    const result = _.cloneDeep(target);
    Array.isArray(diffs) &&
      diffs.forEach(d => {
        applyChange(result, d);
      });
    return result;
  }

  let pastPresent = null;
  return function(state = initState, action) {
    const { past, present, future } = state;
    switch (action.type) {
      case undoableConst.UNDO: {
        const previous = applyDiff(present, past[past.length - 1]);
        pastPresent = previous || present;
        const featureDiff = diff(previous, present);
        const newPast = past.slice(0, past.length - 1);
        return {
          past: newPast,
          present: previous,
          future: [featureDiff, ...future],
        };
      }
      case undoableConst.REDO:
        const next = applyDiff(present, future[0]);
        pastPresent = next || present;
        const pastDiff = diff(next, present);
        const newFuture = future.slice(1);
        return {
          past: [...past, pastDiff],
          present: next,
          future: newFuture,
        };
      case config.initAction: {
        const newPresent = reducer(present, action);
        pastPresent = newPresent;
        return {
          ...state,
          present: newPresent,
        };
      }
      default: {
        const newPresent = reducer(present, action);
        if (present === newPresent) {
          return state;
        }
        let shouldPushHistory = true;
        if (actionExclude && actionExclude.indexOf(action.type) > -1) {
          shouldPushHistory = false;
        }
        let newPast = past;
        let newFuture = future;
        if (shouldPushHistory) {
          const pastDiff = diff(newPresent, pastPresent);
          pastPresent = newPresent || present;
          newPast = [...past, pastDiff].slice(0, limit);
          newFuture = [];
        }
        return {
          past: newPast,
          present: newPresent,
          future: newFuture,
        };
      }
    }
  };
}

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
        default: {
        }
      }
    }
    return bytes;
  }

  function formatByteSize(bytes) {
    console.log(bytes);
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + ' KiB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + ' MiB';
    else return (bytes / 1073741824).toFixed(3) + ' GiB';
  }

  return formatByteSize(sizeOf(obj));
}

if (process.browser) {
  window.getMM = memorySizeOf;
}
