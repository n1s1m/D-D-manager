'use client';

import Link from 'next/link';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  TableCellImage,
} from '@repo/ui-components';
import { getPublicStorageUrl as getSpellImageUrl } from 'supabase-client';
import type { Spell } from 'shared-types';

function spellLevelLabel(level: number) {
  return level === 0 ? 'Cantrip' : `Level ${level}`;
}

const columnHelper = createColumnHelper<Spell>();

interface SpellsTableProps {
  data: Spell[];
  characterId?: string | null;
}

export function SpellsTable({ data, characterId }: SpellsTableProps) {
  const columns = [
    columnHelper.display({
      id: 'image',
      header: '',
      cell: ({ row }) => (
        <TableCellImage
          src={getSpellImageUrl(row.original.image_url)}
          alt={row.original.name}
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('level', {
      header: 'Level',
      cell: (info) => spellLevelLabel(info.getValue()),
    }),
    columnHelper.accessor('school', {
      header: 'School',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('casting_time', {
      header: 'Casting time',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('range', {
      header: 'Range',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('components', {
      header: 'Components',
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const href = characterId
          ? `/spells/${row.original.id}?characterId=${characterId}`
          : `/spells/${row.original.id}`;
        return (
          <Button asChild variant="secondary" size="sm">
            <Link href={href}>View & Add</Link>
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
