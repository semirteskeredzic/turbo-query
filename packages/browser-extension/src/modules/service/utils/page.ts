export function getPages<T>(allIds: T[]): T[][] {
  console.log('ids in getpages', allIds);
  const pages: T[][] = [];
  for (let i = 0; i < allIds?.length; i += 200) pages.push(allIds.slice(i, i + 200));
  console.log('pages result', pages);
  return pages;
}
