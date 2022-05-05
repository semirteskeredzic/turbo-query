import React from "react";
import { Config } from "../../service/ado/api-proxy";
import { DisplayItem } from "../../service/utils/get-display-item";

export interface WorkItemProps {
  config: Config;
  item: DisplayItem;
  handleIconClick: React.MouseEventHandler;
  handleIconCopy: React.ClipboardEventHandler;
  handleTextFocus: React.FocusEventHandler;
  handleLinkClick: React.MouseEventHandler;
  handleTextBlur: React.FocusEventHandler;
  handleClickToSelect: React.MouseEventHandler;
}
export const WorkItem: React.FC<WorkItemProps> = ({
  config,
  item,
  handleClickToSelect,
  handleIconClick,
  handleTextBlur,
  handleLinkClick,
  handleTextFocus,
  handleIconCopy,
}) => (
  <li className="work-item" key={item.id}>
    <span className="work-item__state-interaction" title={`State: ${item.state}`}>
      <span className="work-item__state-bar" data-state-category={item.stateCategory} style={{ "--state-color": item.stateColor } as React.CSSProperties} />
    </span>
    <a tabIndex={-1} className="u-visually-hidden js-copy-target" href={`https://dev.azure.com/${config!.org}/${config!.project}/_workitems/edit/${item.id}`}>
      {item.workItemType} {item.id}: {item.title}
    </a>
    <span
      onCopy={handleIconCopy}
      className="work-item__icon-interaction js-select-item-start"
      onClick={handleIconClick}
      title={`Type: ${item.workItemType} (Click to select type + ID + title)`}
    >
      {item.iconUrl ? (
        <img className="work-item__icon" src={item.iconUrl} alt={item.workItemType} width={16} height={16} />
      ) : (
        <div className="work-item__icon" />
      )}
    </span>
    <div className="work-item__label-list">
      <span
        className="work-item__id work-item__matchable"
        data-matched={item.isIdMatched}
        tabIndex={0}
        title={`ID: ${item.id} (Click to select)`}
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        onClick={handleClickToSelect}
      >
        {item.id}
      </span>{" "}
      <a
        className="work-item__link js-select-item-end"
        target="_blank"
        onClick={handleLinkClick}
        onFocus={handleTextFocus}
        onBlur={handleTextBlur}
        title={`Title: ${item.title} (Click to open, Alt + click to select)`}
        href={`https://dev.azure.com/${config!.org}/${config!.project}/_workitems/edit/${item.id}`}
        dangerouslySetInnerHTML={{ __html: item.titleHtml }}
      />{" "}
      {item.tags.length > 0 &&
        item.tags.map((tag, i) => (
          <React.Fragment key={i}>
            <span className="work-item__tag work-item__matchable" title={`Tag: ${tag}`} data-matched={item.isTagMatched?.[i]}>
              <span className="work-item__tag-overflow-guard">{tag}</span>
            </span>{" "}
          </React.Fragment>
        ))}
      <span className="work-item__state work-item__matchable" title={`State: ${item.state}`} data-matched={item.isStateMatched}>
        {item.state}
      </span>
      &nbsp;{"· "}
      <span className="work-item__type work-item__matchable" title={`Type: ${item.workItemType}`} data-matched={item.isWorkItemTypeMatched}>
        {item.workItemType}
      </span>
      &nbsp;{"· "}
      <span
        className="work-item__assigned-to work-item__matchable"
        title={`Assigned to: ${item.assignedTo.displayName}`}
        data-matched={item.isAssignedToUserMatched}
      >
        {item.assignedTo.displayName}
      </span>
      &nbsp;{"· "}
      <span className="work-item__path work-item__matchable" title={`Iteration: ${item.iterationPath}`} data-matched={item.isShortIterationPathMatched}>
        {item.shortIterationPath}
      </span>
    </div>
  </li>
);
