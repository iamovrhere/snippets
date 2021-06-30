/**
 * The motivation behind this snippet is a quick and dirty way to grab a CSV
 * (or there about) of titles + image from MAL (https://myanimelist.net).
 *
 * Usage:
 *  1. Open the relevant list in browser: https://myanimelist.net/animelist/SAMPLE
 *  2. Open the browser console.
 *  3. Copy paste into console.
 *  4. Done. Now you have your CSV.
 */

//////////////////////////////////////////////////////////////////////////////////////
// Sample starts here.
//////////////////////////////////////////////////////////////////////////////////////

/**
 *
 * Sample of single row of data.
 *
<tr class="list-table-data" >
    <td class="data status completed"></td>
    <td class="data number">49</td>
    <td class="data image">
        <a href="/anime/5114/Fullmetal_Alchemist__Brotherhood" class="link sort">
            <img src="https://cdn.myanimelist.net/r/96x136/images/anime/1223/96541.webp?s=77ef7a40d8b5fd5a5b3296a2f199b29f" class="hover-info image">
        </a>
    </td>
    <td class="data title clearfix">
        <a href="/anime/5114/Fullmetal_Alchemist__Brotherhood" class="link sort">Fullmetal Alchemist: Brotherhood</a>
        <a href="/anime/5114/Fullmetal_Alchemist__Brotherhood/video" title="Watch Episode Video" class="icon-watch ml4">Watch Episode Video</a>
        <span class="rewatching" style="display: none;"></span>
        <span class="content-status" style="display: none;"></span>
        <div class="add-edit-more">
            <span class="edit"><a href="/ownlist/anime/5114/edit?hideLayout" class="List_LightBox">Edit</a></span> <!---->
              -
            <span class="more"><a href="#">More</a></span>
        </div>
    </td>
    <td class="data score">
        <a href="#" class="link">
            <span class="score-label score-10">
                        10
            </span>
        </a> <!---->
    </td>
    <td class="data type">
                TV
    </td>
    <td class="data progress">
        <div class="progress-5114"><!----> <span>64</span> <!----></div>
    </td>
    <td id="tags-5114" class="data tags">
        <div class="tags-5114"></div> <!----> <a href="#" class="edit">Edit</a>
    </td>
    <td class="data rated">
                R
    </td>
    <td class="data days">
                6
    </td>
    <td class="data airing-started">
                04-05-09
    </td>
    <td class="data airing-finished">
                07-04-10
    </td>
    <td class="data studio">
        <span><a href="/anime/producer/4">Bones</a></span>
    </td>
    <td class="data licensor">
        <span><a href="/anime/producer/102">Funimation</a></span>
        <span>, <a href="/anime/producer/493">Aniplex of America</a></span>
    </td>
</tr>
 *
 */

/**
 * Sample of thumbnail image vs. full image:
 *
 * https://cdn.myanimelist.net/r/96x136/images/anime/1223/96541.webp?s=77ef7a40d8b5fd5a5b3296a2f199b29f
 *
 * https://cdn.myanimelist.net/images/anime/1223/96541.jpg
 */


//////////////////////////////////////////////////////////////////////////////////////
// Snippet starts here.
//////////////////////////////////////////////////////////////////////////////////////

/**
 * Makes debugging easier later when something in the DOM changes.
 *
 * @param {HTMLElement} e Element
 * @param {string} selector CSS selector
 * @return {HTMLElement}
 */
const querySelectorOrThrow = (e, selector) => {
  const result = e.querySelector(selector);
  if (!result) {
    throw new Error(`Couldn't find any '${selector}' elements`);
  }
  return result;
};

// Split out the thumbnail image into full image.
const imageBase = 'https://cdn.myanimelist.net';
const imageExtractRegEx = /\/images\/anime\/.*\./;
const imageType = 'jpg';

/**
 * Converts the image thumbnail link:
 *  `https://cdn.myanimelist.net/r/96x136/images/anime/1223/96541.webp?s=77ef7a40d8b5fd5a5b3296a2f199b29f`
 * into the expected full image:
 *  `https://cdn.myanimelist.net/images/anime/1223/96541.jpg`
 *
 * @param {string} imgUrl
 * @return {string} URL of full-sized image, assumes `jpg`
 */
const imageThumbnailToFull = imgUrl => {
  const matches = imgUrl.match(imageExtractRegEx);
  if (!matches.length) {
    console.warn(`Failed to extract full-sized image of ${imgUrl}`);
    return imgUrl;
  }
  return `${imageBase}${matches[0]}${imageType}`;
};

const cssSelectorTitleTd = 'td.title';
const cssSelectorTitleLink = 'a.link';
const cssSelectorImgTd = 'td.image';
const cssSelectorImg = 'img.image';
const cssSelectorType = 'td.type';

/**
 * Extracts the title and image from the supplied row.
 *
 * @param {HTMLElement} row
 * @return {{title: string, image: string}} Object of the row
 */
const getTitleAndImage = row => {
  const titleTd = querySelectorOrThrow(row, cssSelectorTitleTd);
  const titleLink = querySelectorOrThrow(titleTd, cssSelectorTitleLink);
  const title = titleLink.innerText;

  const imageTd = querySelectorOrThrow(row, cssSelectorImgTd);
  const img = querySelectorOrThrow(imageTd, cssSelectorImg);
  const imgSrc = img.getAttribute('src');
  const image = imageThumbnailToFull(imgSrc);

  return {
    title,
    image
  }
};

/**
 * @param {HTMLElement} row
 * @param {string} type The type column value as listed in the MAL table; e.g. TV, Movie, OVA.
 * @returns {boolean} True if the type matches, false otherwise.
 */
const isRowType = (row, type) => {
  const typeTd = querySelectorOrThrow(row, cssSelectorType);
  return type.toLowerCase() === typeTd.innerText.toLowerCase();
};

// Main starts here.
const table = document.getElementsByClassName('list-table')[0];
const rows = [...table.getElementsByClassName('list-table-data')];

const filterByType = (type) => {
  return rows.filter((row) => isRowType(row, type));
};

const filterByNotType = (type) => {
  return rows.filter((row) => !isRowType(row, type));
};

// Generate JSON string.
JSON.stringify(rows.map(getTitleAndImage));

// Generate a tab separated list
// (easier than commas or semi-colons, since titles contain those.)
var separator = '\t';
rows.reduce((csv, row) => {
  const entry = getTitleAndImage(row);
  return `${csv}\n${entry.title}${separator}${entry.image}`;
}, '');
