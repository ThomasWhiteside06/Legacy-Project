export interface Pet {
  _id: string;
  name: string;
  type: string;
  gender: string;
  shelterName: string;
  phone: string;
  email: string;
  age: string | number;
  city?: string;
  location: {
    lat: number;
    lng: number;
  };
  image: string;
}