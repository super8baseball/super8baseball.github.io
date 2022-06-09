import { createTable, getCoreRowModel, useTableInstance, getSortedRowModel } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { StyledTable } from '../styled';
import { numberDisplay } from '../utils/common';

const table = createTable();

const SumPitcherTable = ({ pitchers }) => {
  const [sorting, setSorting] = useState([]);
  const pitcherColumns = useMemo(
    () => [
      table.createDataColumn('number', {
        cell: (info) => numberDisplay(info.getValue()),
        header: () => '背號',
      }),
      table.createDataColumn('name', {
        header: () => '球員',
      }),
      table.createDataColumn('ERA', {
        cell: (info) => info.getValue().toFixed(3),
        header: () => '防禦率',
      }),
      table.createDataColumn('WHIP', {
        cell: (info) => info.getValue().toFixed(3),
        header: () => '被上壘率',
      }),
      table.createDataColumn('IPOuts', {
        cell: (info) => `${Math.floor(info.getValue() / 3)}, ${info.getValue() % 3}/3`,
        header: () => '局數',
      }),
      table.createDataColumn('H', {
        header: () => '安打',
      }),
      table.createDataColumn('HR', {
        header: () => '全壘打',
      }),
      table.createDataColumn('BB', {
        header: () => '保送',
      }),
      table.createDataColumn('HBP', {
        header: () => '觸身',
      }),
      table.createDataColumn('K', {
        header: () => '三振',
      }),
      table.createDataColumn('WP', {
        header: () => '暴投',
      }),
      table.createDataColumn('R', {
        header: () => '失分',
      }),
      table.createDataColumn('ER', {
        header: () => '責失',
      }),
      table.createDataColumn('TC', {
        header: () => '守備次數',
      }),
      table.createDataColumn('TC_E', {
        header: () => '守備失誤',
      }),
    ],
    []
  );

  const instance = useTableInstance(table, {
    data: pitchers,
    columns: pitcherColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return (
    <StyledTable>
      <h5 className="title">投手成績</h5>
      <table>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {header.renderHeader()}
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {instance.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={cell.column.id}>
                  {cell.renderCell()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </StyledTable>
  );
};

export default SumPitcherTable;
