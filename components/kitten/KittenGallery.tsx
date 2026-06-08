'use client';

import { useMemo, useState } from 'react';
import { KittenCard } from './KittenCard';
import { type Kitten } from '@prisma/client';
import { Button } from '@/components/ui/Button';

const colorOptions = ['Brown Tabby', 'Silver Tabby', 'Cream', 'Black', 'White', 'Red', 'Blue'];
const statusOptions = ['AVAILABLE', 'RESERVED', 'SOLD'];

export function KittenGallery({ kittens }: { kittens: Kitten[] }) {
  const [viewGrid, setViewGrid] = useState(true);
  const [filterColor, setFilterColor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return kittens.filter((kitten) => {
      const matchesColor = filterColor ? kitten.color === filterColor : true;
      const matchesStatus = filterStatus ? kitten.status === filterStatus : true;
      const matchesName = kitten.name.toLowerCase().includes(query.toLowerCase());
      return matchesColor && matchesStatus && matchesName;
    });
  }, [kittens, filterColor, filterStatus, query]);

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.3em] text-royal-700">Kitten gallery</p>
            <h1 className="text-3xl font-semibold text-slate-900">Browse kittens by age, color, gender, and availability.</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant={viewGrid ? 'default' : 'secondary'} onClick={() => setViewGrid(true)}>Grid view</Button>
            <Button variant={!viewGrid ? 'default' : 'secondary'} onClick={() => setViewGrid(false)}>List view</Button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label htmlFor="kitten-search" className="sr-only">Search kittens by name</label>
            <input
              id="kitten-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name"
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
            />
          </div>
          <div>
            <label htmlFor="filter-color" className="sr-only">Filter by color</label>
            <select
              id="filter-color"
              value={filterColor}
              onChange={(event) => setFilterColor(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
            >
              <option value="">All colors</option>
              {colorOptions.map((color) => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-status" className="sr-only">Filter by status</label>
            <select
              id="filter-status"
              value={filterStatus}
              onChange={(event) => setFilterStatus(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-royal-500 focus:ring-2 focus:ring-royal-100"
            >
              <option value="">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className={viewGrid ? 'grid gap-6 md:grid-cols-2 xl:grid-cols-3' : 'space-y-4'}>
        {filtered.map((kitten) => (
          <KittenCard key={kitten.id} kitten={kitten} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-soft">
          No kittens match that filter yet. Please check back for the next available litter.
        </div>
      )}
    </div>
  );
}
