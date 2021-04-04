import { DashboardState } from "@activeviam/activeui-sdk";

export const serializedDashboard: DashboardState<"serialized"> = {
  pages: {
    "p-0": {
      name: "Page 1",
      content: {
        "2": {
          widgetKey: "chloropleth-map",
          query: {
            mdx:
              "SELECT NON EMPTY Crossjoin([Green-growth].[Year].[Year].Members, {[Measures].[Real GDP per capita (USD).MEAN]}) ON COLUMNS, NON EMPTY Hierarchize(Descendants({[Countries].[Country].[AllMember]}, 2, SELF_AND_BEFORE)) ON ROWS FROM [Green-growth]",
          },
          name:
            "Select countries using the lasso tool and right click to filter the dashboard on your selection!",
        },
        "3": {
          mapping: {
            xAxis: ["[Green-growth].[Year].[Year]"],
            values: [
              "[Measures].[TPES per capita (Tonne of oil equivalent).MEAN]",
            ],
            splitBy: ["ALL_MEASURES", "[Countries].[Country].[Country_Name]"],
            horizontalSubplots: [],
            verticalSubplots: [],
          },
          widgetKey: "plotly-line-chart",
          query: {
            updateMode: "once",
            mdx:
              "SELECT NON EMPTY Crossjoin({[Measures].[TPES per capita (Tonne of oil equivalent).MEAN]}, Hierarchize(Descendants({[Countries].[Country].[AllMember]}, 2, SELF_AND_BEFORE))) ON COLUMNS, NON EMPTY [Green-growth].[Year].[Year].Members ON ROWS FROM [Green-growth]",
          },
          name: "Recent evolution of energy consumption per capita",
          filters: [
            "{[Countries].[Country].[AllMember].[Europe].[France, French Republic], [Countries].[Country].[AllMember].[Europe].[Ireland], [Countries].[Country].[AllMember].[Europe].[Portugal, Portuguese Republic], [Countries].[Country].[AllMember].[Europe].[Spain, Kingdom of], [Countries].[Country].[AllMember].[Europe].[United Kingdom of Great Britain & Northern Ireland]}",
          ],
          serverKey: "my-server",
        },
        "4": {
          name: "Correlations: GDP / Energy consumption / CO2 emissions",
          mapping: {
            xValues: ["[Measures].[Real GDP per capita (USD).MEAN]"],
            yValues: [
              "[Measures].[Energy-related CO2 per capita (Tonne).MEAN]",
            ],
            size: [
              "[Measures].[TPES per capita (Tonne of oil equivalent).MEAN]",
            ],
            color: ["[Countries].[Country].[Country_Name]"],
            splitBy: [],
            horizontalSubplots: [],
            verticalSubplots: [],
          },
          widgetKey: "plotly-scatter-plot",
          query: {
            updateMode: "once",
            mdx:
              "SELECT NON EMPTY {[Measures].[Real GDP per capita (USD).MEAN], [Measures].[Energy-related CO2 per capita (Tonne).MEAN], [Measures].[TPES per capita (Tonne of oil equivalent).MEAN]} ON COLUMNS, NON EMPTY Hierarchize(Descendants({[Countries].[Country].[AllMember]}, 2, SELF_AND_BEFORE)) ON ROWS FROM [Green-growth]",
          },
          filters: [
            "{[Countries].[Country].[AllMember].[Europe].[France, French Republic], [Countries].[Country].[AllMember].[Europe].[Ireland], [Countries].[Country].[AllMember].[Europe].[Portugal, Portuguese Republic], [Countries].[Country].[AllMember].[Europe].[Spain, Kingdom of], [Countries].[Country].[AllMember].[Europe].[United Kingdom of Great Britain & Northern Ireland]}",
          ],
          serverKey: "my-server",
        },
      },
      layout: {
        children: [
          {
            children: [
              {
                leafKey: "2",
                size: 0.5,
              },
              {
                children: [
                  {
                    leafKey: "3",
                    size: 0.5,
                  },
                  {
                    leafKey: "4",
                    size: 0.5,
                  },
                ],
                direction: "row",
                size: 0.5,
              },
            ],
            direction: "column",
            size: 1,
          },
        ],
        direction: "row",
      },
      filters: [],
    },
  },
  pagesOrder: ["p-0"],
  filters: [],
};
