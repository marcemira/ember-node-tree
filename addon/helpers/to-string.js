import { helper } from '@ember/component/helper';

export function toString([value]) {
  return String(value);
}

export default helper(toString);
