import { getPatHeader } from "./auth";
import { getRootQuery } from "./query";

export const MAX_ITEM_PER_PAGE = 19999;

export class ApiProxy {
  #config: Config;

  constructor(config: Config) {
    this.#config = config;
  }

  async getSinglePageDeletedWorkItemIds(params?: QueryParams): Promise<any> {
    const patHeader = getPatHeader(this.#config);
   // const body = 
    const searchParams = new URLSearchParams(`api-version=6.0`);
    searchParams.set("$top", Math.min(params?.top ?? Infinity, MAX_ITEM_PER_PAGE).toString());
    const SPDeletedWItemIds = await Promise.all(this.#config.project?.map(async(proj) => {
    return fetch(`https://dev.azure.com/${this.#config.org}/${proj}/_apis/wit/wiql/?${searchParams.toString()}`, {
      method: "post",
      headers: { ...patHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ query: getRootQuery({ rootAreaPath: proj, isDeleted: true }) }),
    })
      .then(this.#safeParseJson)
      .then((result) => {
        console.log('res1', result);
        return (result.workItems as { id: number }[]).map((item) => item.id);
      });
    }))

    return SPDeletedWItemIds;
  }

  async getSinglePageWorkItemIds(params?: QueryParams): Promise<number[]> {
    const patHeader = getPatHeader(this.#config);
    //const body = JSON.stringify({
    //  query: getRootQuery({ rootAreaPath: this.#config.areaPath }),
    //});
    const searchParams = new URLSearchParams(`api-version=6.0`);
    searchParams.set("$top", Math.min(params?.top ?? Infinity, MAX_ITEM_PER_PAGE).toString());
    const spwItemIds = await Promise.all(this.#config.project?.map(async(proj) => {
      return fetch(`https://dev.azure.com/${this.#config.org}/${proj}/_apis/wit/wiql/?${searchParams.toString()}`, {
      method: "post",
      headers: { ...patHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ query: getRootQuery({ rootAreaPath: proj, isDeleted: true }) }),
    }).then(this.#safeParseJson)
    .then((result) => {
      console.log('result of getSPWII', result);
      console.log('itemids in then', (result.workItems as { id: number }[]).map((item) => item.id));
      return (result.workItems as { id: number }[]).map((item) => item.id);
    });
    }))
    return spwItemIds;  
  }

  async getWorkItemTypes(): Promise<any> {
    const patHeader = getPatHeader(this.#config);
    const WITypes = await Promise.all(this.#config.project.map(async (proj) => {
      return fetch(`https://dev.azure.com/${this.#config.org}/${this.#config.project}/_apis/wit/workitemtypes?api-version=6.0`, {
      headers: { ...patHeader },
    }).then(this.#safeParseJson)
    .then((result: CollectionResponse<WorkItemType>) => result.value);
    }))

    return WITypes;
  }

  async getWorkItems(fields: string[], ids: number[]): Promise<CollectionResponse<WorkItem>> {
    const patHeader = getPatHeader(this.#config);

    const WItems = await Promise.all(this.#config.project.map(async(proj) => {
      return fetch(`https://dev.azure.com/${this.#config.org}/${proj}/_apis/wit/workitemsbatch?api-version=6.0`, {
        method: "post",
        headers: { ...patHeader, "Content-Type": "application/json"},
        body: JSON.stringify({
          ids,
          fields,
        }),
      }).then(this.#safeParseJson).then((result: CollectionResponse<WorkItem>) => {
        console.log('result',result)
        return result.value;
    })
  }))

  return WItems;
}

  async #safeParseJson(response: Response) {
    if (response.status === 401) throw new Error("Authentication error");
    if (!response.ok) throw new Error(`Status code: ${response.status}`);
    return response.json();
  }
}

export interface Config {
  org: string;
  project: Array<string>;
  areaPath: string;
  email: string;
  pat: string;
}

export interface CollectionResponse<T> {
  count: number;
  value: T[];
}

export interface WorkItem {
  id: number;
  rev: number;
  fields: BasicFields;
  url: string;
}

export interface WorkItemType {
  icon: WorkItemIcon;
  name: string;
  isDisabled: boolean;
  states: WorkItemState[];
}

export interface WorkItemIcon {
  id: string;
  url: string;
}

export interface WorkItemState {
  name: string;
  color: string;
  category: string;
}

export interface QueryParams {
  top?: number;
}

export interface BasicFields {
  "System.Title": string;
  "System.WorkItemType": string;
  "System.ChangedDate": string;
  "System.AssignedTo"?: AdoUser; // Abscent when unassigned
  "System.State": string;
  "System.IterationPath": string;
  "System.Tags"?: string; // Abscent when untagged
}

export const ALL_FIELDS: (keyof BasicFields)[] = [
  "System.Title",
  "System.WorkItemType",
  "System.ChangedDate",
  "System.AssignedTo",
  "System.State",
  "System.IterationPath",
  "System.Tags",
];

export interface AdoUser {
  displayName: string;
}
