'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useLanguage } from '@/lib/i18n';

export function GemstoneSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') ?? '';
  const { t } = useLanguage();

  const updateSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('search', value);
    else params.delete('search');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Input
      size="large"
      placeholder={t.gemstones_page.search_placeholder}
      prefix={<SearchOutlined className="text-neutral-400" />}
      defaultValue={currentSearch}
      onPressEnter={(e) => updateSearch(e.currentTarget.value)}
      allowClear
      onClear={() => updateSearch('')}
      className="mx-auto max-w-md"
    />
  );
}

export function GemstonePagination({ total, pageSize }: { total: number; pageSize: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page') ?? '1');

  if (total <= pageSize) return null;

  return (
    <div className="flex justify-center">
      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        showSizeChanger={false}
        onChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('page', String(page));
          router.push(`${pathname}?${params.toString()}`);
        }}
      />
    </div>
  );
}
