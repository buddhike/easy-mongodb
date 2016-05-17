import _ from 'lodash';

function idToString(value) {
  return _.isString(value) ? value : value.toString();
}

export default function(a, b) {
  return idToString(a) === idToString(b);
}
