declare namespace google.maps {
  class Map {
    constructor(mapDiv: Element | null, opts?: MapOptions);
    setCenter(latLng: LatLngLiteral): void;
  }

  class Marker {
    constructor(opts: MarkerOptions);
    setMap(map: Map | null): void;
  }

  interface MapOptions {
    zoom?: number;
    center?: LatLngLiteral;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
  }

  interface MarkerOptions {
    position: LatLngLiteral;
    map: Map;
    animation?: Animation;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  enum Animation {
    DROP,
  }
}
