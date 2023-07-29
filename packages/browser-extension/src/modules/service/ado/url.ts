export function getItemUrl(org: string, project: Array<string>, id: number) {
  project.map((proj) => {
    return `https://dev.azure.com/${org}/${proj}/_workitems/edit/${id}`;
  })
  
}
