/**
 * The individual units that are being compared.
 * @typedef {{title: string, image: string}} ComparisonItem
 */

/**
* A voting pair to compare against each other. Default for `voted` is `false`.
* @typedef {{
 *  left: {title: string, image: string},
 *  right: {title: string, image: string},
 *  voted: boolean
 * }} VotingPair
 */

/**
 *
 * @param {ComparisonItem}
 * @param {[ComparisonItem]} list
 * @return {[VotingPair]}
 */
const createPairs = (item, list) => list.reduce((pairList, pairItem) => {
  if (item.title !== pairItem.title) {
    pairList.push({
      left: item,
      right: pairItem,
      voted: false
    });
  }
  return pairList;
}, []);


/**
 *
 * @param {[ComparisonItem]} list
 * @return {[VotingPair]}
 */
const createPairList = list => list.reduce((result, item) =>
  result.concat(createPairs(item, list)), []);

/**
 *
 * @param {[ComparisonItem]} list
 */
const uniqueByTitles = list => Object.values(
  list.reduce((titleMap, item) => {
    titleMap[item.title] = item;
    return titleMap;
  }, {})
).sort();
