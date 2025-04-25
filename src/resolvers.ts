import { Resolvers } from './types';
import { validateFullAmenities } from "./helpers";

export const resolvers: Resolvers = {
  Query: {
    featuredListings: (_, __, {dataSources}) => {
      return dataSources.listingAPI.getFeaturedListings();
    },
    listing: (_, { id }, { dataSources }) => {
      return dataSources.listingAPI.getListing(id);
    },
  },
  Listing: {
    amenities: ({ id, amenities }, _, { dataSources }) => {
      // There are two scenarios we need our Listing.amenities resolver to handle.
      // If we've queried for a single listing, we'll already have full amenity data available on the parent argument. In this case, we can return the amenities directly.
      // If our resolver's parent argument comes from Query.featuredListings, however, we'll have only an array of amenity IDs. In this case, we'll need to make a follow-up request to the REST API!
      return validateFullAmenities(amenities)
        ? amenities
        : dataSources.listingAPI.getAmenities(id);
    }
  },
};