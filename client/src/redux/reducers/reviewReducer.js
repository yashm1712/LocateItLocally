import { GET_REVIEW,POST_REVIEW } from "../constants/reviewConstants";

const INITIAL_STATE = {
  reviews: [],
};

const reviewReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_REVIEW:
      return {
        ...state,
        reviews: action.payload,
      };

    case POST_REVIEW:
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
      };

    default:
      return {
        ...state,
      };
  }
};

export default reviewReducer;