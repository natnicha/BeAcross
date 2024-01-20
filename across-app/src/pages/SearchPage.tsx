import algoliasearch from "algoliasearch/lite";
import { Hit as AlgoliaHit } from "instantsearch.js";
import React from "react";
import {
  InstantSearch,
  Breadcrumb,
  Configure,
  ClearRefinements,
  CurrentRefinements,
  DynamicWidgets,
  HierarchicalMenu,
  Highlight,
  Hits,
  HitsPerPage,
  InfiniteHits,
  Menu,
  RangeInput,
  RefinementList,
  SearchBox,
  SortBy,
  ToggleRefinement,
} from "react-instantsearch";

import { Panel } from "../components";
import "./SearchPage.css";

const searchClient = algoliasearch(
  "latency",
  "6be0576ff61c053d5f9a3225e2a90f76"
);

type HitProps = {
  hit: AlgoliaHit<{
    name: string;
    price: number;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      <Highlight hit={hit} attribute="name" className="Hit-label" />
      <span className="Hit-price">${hit.price}</span>
    </>
  );
}

export function SearchPage() {
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName="instant_search"
      routing={true}
      insights={true}
    >
      <Configure ruleContexts={[]} />

      <div className="Container">
        <div>
          <DynamicWidgets>
            <Panel header="Brands">
              <RefinementList attribute="brand" showMore={true} />
            </Panel>
            <Panel header="Categories">
              <Menu attribute="categories" showMore={true} />
            </Panel>
            {/* <Panel header="Hierarchy">
              <HierarchicalMenu
                attributes={[
                  "hierarchicalCategories.lvl0",
                  "hierarchicalCategories.lvl1",
                  "hierarchicalCategories.lvl2",
                ]}
                showMore={true}
              />
            </Panel> */}
            <Panel header="Price">
              <RangeInput attribute="price" precision={1} />
            </Panel>
            <Panel header="Free Shipping">
              <ToggleRefinement
                attribute="free_shipping"
                label="Free shipping"
              />
            </Panel>
          </DynamicWidgets>
        </div>

        <div className="Search">
          {/* <Breadcrumb
            attributes={[
              "hierarchicalCategories.lvl0",
              "hierarchicalCategories.lvl1",
              "hierarchicalCategories.lvl2",
            ]}
          /> */}

          <SearchBox placeholder="Search" autoFocus />

          <div className="Search-header">
            <HitsPerPage
              items={[
                { label: "20 hits per page", value: 20, default: true },
                { label: "40 hits per page", value: 40 },
              ]}
            />
            <SortBy
              items={[
                { label: "Relevance", value: "instant_search" },
                { label: "Price (asc)", value: "instant_search_price_asc" },
                { label: "Price (desc)", value: "instant_search_price_desc" },
              ]}
            />
          </div>

          <div className="CurrentRefinements">
            <ClearRefinements />
            <CurrentRefinements
              transformItems={(items) =>
                items.map((item) => {
                  const label = item.label.startsWith("hierarchicalCategories")
                    ? "Hierarchy"
                    : item.label;

                  return {
                    ...item,
                    attribute: label,
                  };
                })
              }
            />
          </div>

          <InfiniteHits hitComponent={Hit} />
        </div>
      </div>
    </InstantSearch>
  );
}
