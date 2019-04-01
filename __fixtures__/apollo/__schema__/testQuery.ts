/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: testQuery
// ====================================================

export interface testQuery_dogs {
  __typename: "Dog";
  id: string;
  breed: string;
}

export interface testQuery {
  dogs: (testQuery_dogs | null)[] | null;
}
