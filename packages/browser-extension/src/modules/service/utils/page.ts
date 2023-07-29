export function getPages<T>(allIds: T[]): T[][] {
  const pages: T[][] = [];
  console.log('all ids',allIds)
  for (let i = 0; i < allIds?.length; i += 200) pages.push(allIds.slice(i, i + 200));
  return pages;
}
