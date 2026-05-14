import {
  defaultIndoorTables,
  defaultOpenTerraceTables,
  gardenGroups,
  indoorGroups,
  openTerraceGroups,
} from "./tableConfig.js";

const gardenCellById = gardenGroups.reduce((acc, group, columnIndex) => {
  group.forEach((id, rowIndex) => {
    acc[id] = { columnIndex, rowIndex };
  });
  return acc;
}, {});

export function getTablesCapacity(tables, ids) {
  return ids.reduce((sum, id) => sum + (tables.find((table) => table.id === id)?.seats || 0), 0);
}

export function getEligibleIndoorGroups(requestedGuests, tables = defaultIndoorTables) {
  return indoorGroups.filter((group) => getTablesCapacity(tables, group) >= requestedGuests);
}

export function getEligibleOpenTerraceGroups(requestedGuests, tables = defaultOpenTerraceTables) {
  return openTerraceGroups.filter((group) => getTablesCapacity(tables, group) >= requestedGuests);
}

export function isContinuousGroup(group, tableIds) {
  const indexes = [...new Set(tableIds)]
    .map((id) => group.indexOf(id))
    .sort((aIndex, bIndex) => aIndex - bIndex);

  if (indexes.some((index) => index < 0)) return false;

  for (let index = 1; index < indexes.length; index += 1) {
    if (indexes[index] - indexes[index - 1] !== 1) return false;
  }

  return true;
}

export function isContinuousTerraceColumnSelection(selectedTables, nextTable) {
  const ids = [...selectedTables.map((table) => table.id), nextTable.id];
  const matchingGroup = gardenGroups.find((group) => ids.every((id) => group.includes(id)));

  if (!matchingGroup) return false;

  return isContinuousGroup(matchingGroup, ids);
}

export function isLogicalTerraceSelection(selectedTables, nextTable) {
  const ids = [...new Set([...selectedTables.map((table) => table.id), nextTable.id])];
  const cells = ids.map((id) => gardenCellById[id]).filter(Boolean);

  if (cells.length !== ids.length) return false;

  if (cells.length <= 4) {
    return isContinuousTerraceColumnSelection(selectedTables, nextTable);
  }

  const selectedCells = new Set(cells.map((cell) => `${cell.columnIndex}:${cell.rowIndex}`));
  const columns = [...new Set(cells.map((cell) => cell.columnIndex))].sort((a, b) => a - b);
  const rows = [...new Set(cells.map((cell) => cell.rowIndex))].sort((a, b) => a - b);
  const hasNoGaps = (values) =>
    values.every((value, index) => index === 0 || value - values[index - 1] === 1);

  if (!hasNoGaps(columns) || !hasNoGaps(rows)) return false;

  const nextCell = gardenCellById[nextTable.id];
  const touchesCurrentSelection = selectedTables.some((table) => {
    const cell = gardenCellById[table.id];
    if (!cell) return false;

    const columnDistance = Math.abs(cell.columnIndex - nextCell.columnIndex);
    const rowDistance = Math.abs(cell.rowIndex - nextCell.rowIndex);

    return columnDistance + rowDistance === 1;
  });

  if (!touchesCurrentSelection) return false;

  return cells.every((cell) => {
    const rowCells = cells
      .filter((item) => item.rowIndex === cell.rowIndex)
      .map((item) => item.columnIndex)
      .sort((a, b) => a - b);
    const columnCells = cells
      .filter((item) => item.columnIndex === cell.columnIndex)
      .map((item) => item.rowIndex)
      .sort((a, b) => a - b);

    return hasNoGaps(rowCells) && hasNoGaps(columnCells) && selectedCells.has(`${cell.columnIndex}:${cell.rowIndex}`);
  });
}

export function canCombineTables(area, selectedTables, nextTable, requestedGuests, areaTables = []) {
  if (!selectedTables.length) return true;

  if (area === "garden") {
    if (nextTable.special) return false;
    if (selectedTables.some((table) => table.special)) return false;
    return isLogicalTerraceSelection(selectedTables, nextTable);
  }

  const allowedGroups =
    area === "openTerrace"
      ? getEligibleOpenTerraceGroups(requestedGuests, areaTables)
      : getEligibleIndoorGroups(requestedGuests, areaTables);

  const currentIds = selectedTables.map((table) => table.id);
  const nextIds = [...currentIds, nextTable.id];

  return allowedGroups.some((group) => nextIds.every((id) => group.includes(id)));
}

export function canUseAdminTableSelection(area, tableIds, options = {}) {
  const uniqueTableIds = [...new Set(tableIds.filter(Boolean))];

  if (uniqueTableIds.length <= 1) return true;

  if (area === "garden") {
    const specialIds = options.gardenSpecialIds || [];
    if (uniqueTableIds.some((id) => specialIds.includes(id))) return false;

    return gardenGroups.some(
      (group) => uniqueTableIds.every((id) => group.includes(id)) && isContinuousGroup(group, uniqueTableIds)
    );
  }

  if (area === "openTerrace") {
    return openTerraceGroups.some((group) => uniqueTableIds.every((id) => group.includes(id)));
  }

  if (area === "all") {
    return true;
  }

  return indoorGroups.some((group) => uniqueTableIds.every((id) => group.includes(id)));
}
