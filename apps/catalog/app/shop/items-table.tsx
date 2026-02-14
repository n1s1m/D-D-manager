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
import { getPublicStorageUrl as getItemImageUrl } from 'supabase-client';
import type { Item } from 'shared-types';

const columnHelper = createColumnHelper<Item>();

function truncate(str: string, maxLen: number) {
  if (!str) return '';
  return str.length <= maxLen ? str : str.slice(0, maxLen) + '…';
}

interface ItemsTableProps {
  data: Item[];
  characterId?: string | null;
  embed?: boolean;
  characterGold?: number | null;
  onBuy?: (item: Item) => void;
}

export function ItemsTable({
  data,
  characterId,
  embed,
  characterGold,
  onBuy,
}: ItemsTableProps) {
  const columns = [
    columnHelper.display({
      id: 'image',
      header: '',
      cell: ({ row }) => (
        <TableCellImage
          src={getItemImageUrl(row.original.image_url)}
          alt={row.original.name}
        />
      ),
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price (gp)',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('description', {
      header: 'Description',
      cell: (info) => truncate(info.getValue(), 60),
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const item = row.original;
        const price = Number(item.price);
        const canAfford = characterGold === null || characterGold === undefined || characterGold >= price;
        if (embed && onBuy) {
          return (
            <Button
              size="sm"
              onClick={() => onBuy(item)}
              disabled={!canAfford}
              title={!canAfford ? 'Not enough gold' : undefined}
            >
              Buy ({price} gp)
            </Button>
          );
        }
        const href = characterId
          ? `/shop/${item.id}?characterId=${characterId}`
          : `/shop/${item.id}`;
        return (
          <Button asChild variant="secondary" size="sm">
            <Link href={href}>View</Link>
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
