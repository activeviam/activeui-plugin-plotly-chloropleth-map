import { getDurationAndTimeUnit } from "./getDurationAndTimeUnit";

describe("getDurationAndTimeUnit", () => {
  it("returns an empty object", () => {
    expect(getDurationAndTimeUnit(undefined)).toMatchInlineSnapshot(
      `Object {}`,
    );
  });

  it("returns the time value and unit for a given timestamp", () => {
    const timestamp = new Date().getTime();

    expect(getDurationAndTimeUnit(timestamp)).toMatchInlineSnapshot(`
      Object {
        "duration": 0,
        "timeUnit": "second",
      }
    `);

    const minute = 60 * 1000;

    expect(getDurationAndTimeUnit(timestamp - 1 * minute))
      .toMatchInlineSnapshot(`
      Object {
        "duration": 1,
        "timeUnit": "minute",
      }
    `);

    expect(getDurationAndTimeUnit(timestamp - 3 * minute))
      .toMatchInlineSnapshot(`
      Object {
        "duration": 3,
        "timeUnit": "minute",
      }
    `);

    const day = 24 * 60 * minute;

    expect(getDurationAndTimeUnit(timestamp - 1 * day)).toMatchInlineSnapshot(`
      Object {
        "duration": 1,
        "timeUnit": "day",
      }
    `);

    const year = 365 * day;

    expect(getDurationAndTimeUnit(timestamp - 1 * year)).toMatchInlineSnapshot(`
      Object {
        "duration": 1,
        "timeUnit": "year",
      }
    `);
  });
});
