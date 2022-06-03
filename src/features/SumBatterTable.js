import { createTable, getCoreRowModel, useTableInstance, getSortedRowModel } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { StyledTable } from '../styled';
import { numberDisplay } from '../utils/common';

const table = createTable();

const SumBatterTable = ({ batters }) => {
  const [sorting, setSorting] = useState([]);

  const batterColumns = useMemo(
    () => [
      table.createDataColumn('number', {
        cell: (info) => numberDisplay(info.getValue()),
        header: () => '背號',
      }),
      table.createDataColumn('name', {
        header: () => '球員',
      }),
      table.createDataColumn('AVG', {
        cell: (info) => info.getValue().toFixed(3),
        header: () => '打擊率',
      }),
      table.createDataColumn('OBP', {
        cell: (info) => info.getValue().toFixed(3),
        header: () => '上壘率',
      }),
      table.createDataColumn('PA', {
        header: () => '打席',
      }),
      table.createDataColumn('AB', {
        header: () => '打數',
      }),
      table.createDataColumn('H', {
        header: () => '安打',
      }),
      table.createDataColumn('DOUBLE', {
        header: () => '二安',
      }),
      table.createDataColumn('TRIPLE', {
        header: () => '三安',
      }),
      table.createDataColumn('HR', {
        header: () => '全壘打',
      }),
      table.createDataColumn('K', {
        header: () => '三振',
      }),
      table.createDataColumn('BB', {
        header: () => '保送',
      }),
      table.createDataColumn('HBP', {
        header: () => '觸身',
      }),
      table.createDataColumn('SF', {
        header: () => '犧飛',
      }),
      table.createDataColumn('SH', {
        header: () => '短打',
      }),
      table.createDataColumn('DP', {
        header: () => '雙殺',
      }),
      table.createDataColumn('FC', {
        header: () => '野選',
      }),
      table.createDataColumn('E', {
        header: () => '失誤',
      }),
      table.createDataColumn('FO', {
        header: () => '飛出',
      }),
      table.createDataColumn('GO', {
        header: () => '滾出',
      }),
      table.createDataColumn('R', {
        header: () => '得分',
      }),
      table.createDataColumn('RBI', {
        header: () => '打點',
      }),
      table.createDataColumn('SB', {
        header: () => '盜壘成功',
      }),
      table.createDataColumn('CS', {
        header: () => '盜壘失敗',
      }),
      table.createDataColumn('TCPT', {
        cell: (info) => info.getValue().toFixed(3),
        header: () => '守備率',
      }),
      table.createDataColumn('TC', {
        header: () => '守備次數',
      }),
      table.createDataColumn('TC_E', {
        header: () => '守備失誤',
      }),
      table.createDataColumn('C_BP', {
        header: () => '捕逸',
      }),
      table.createDataColumn('C_SB', {
        header: () => '被盜壘',
      }),
      table.createDataColumn('C_CS', {
        header: () => '盜壘阻',
      }),
    ],
    []
  );

  const instance = useTableInstance(table, {
    data: batters,
    columns: batterColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <StyledTable>
      <h5 className="title">打者成績</h5>
      <table>
        <thead>
          {instance.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
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
                <td key={cell.id}>{cell.renderCell()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </StyledTable>
  );
};

export default SumBatterTable;
