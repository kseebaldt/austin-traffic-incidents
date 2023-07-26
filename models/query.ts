import { AthenaExpress } from "athena-express";
import AWS from "aws-sdk";
import type { FeatureCollection, Geometry, Feature } from "geojson";

const initialBounds = {
  _sw: {
    lng: -97.7820389157104,
    lat: 30.24568468148415,
  },
  _ne: {
    lng: -97.68462108428947,
    lat: 30.28764283576136,
  },
};

type Bounds = typeof initialBounds;

type Results = {
  total: number;
  geojson: string;
};

export async function query(bounds?: Bounds): Promise<FeatureCollection> {
  AWS.config.update({
    region: process.env.MY_AWS_REGION,
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  });

  const athenaExpressConfig = {
    aws: AWS,
    s3: process.env.ATHENA_RESULTS_S3_KEY,
    getStats: true,
  };

  const athenaExpress = new AthenaExpress<Results>(athenaExpressConfig);

  const poly = toPolygon(bounds || initialBounds);

  let myQuery = {
    sql: `SELECT sum(count) as total, geojson as geojson FROM austin_traffic where month >= CAST('2022-01-01' as DATE) and ST_Contains(st_geometryfromtext('${poly}'), st_geometryfromtext(wkt)) group by geojson`,
    db: "kurtis-test-analytics",
  };

  const results = await athenaExpress.query(myQuery);
  const features =
    results && results.Items
      ? results.Items.map((r) => {
          return {
            type: "Feature",
            properties: {
              total: Number(r.total),
            },
            geometry: JSON.parse(r.geojson) as Geometry,
          } as Feature;
        })
      : [];

  return {
    type: "FeatureCollection",
    features,
  };
}

function toPolygon(bounds: Bounds) {
  return `POLYGON ((${bounds._ne.lng} ${bounds._ne.lat}, ${bounds._sw.lng} ${bounds._ne.lat}, ${bounds._sw.lng} ${bounds._sw.lat}, ${bounds._ne.lng} ${bounds._sw.lat}, ${bounds._ne.lng} ${bounds._ne.lat}))`;
}
